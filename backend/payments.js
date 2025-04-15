const express = require('express');
const router = express.Router();
const db = require('./db');
const bodyParser = require('body-parser');
const authenticate = require('./middleware/authenticate');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

router.post('/create-subscription-session', express.json(), authenticate, async (req, res) => {
    try {
        const { priceId } = req.body;

        if (!priceId) {
            return res.status(400).json({ error: 'priceId is required' });
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: req.user.email,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        return res.json({ url: session.url, sessionId: session.id });
        //return res.redirect(session.url);
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ error: 'Unable to create checkout session' });
    }
});



router.post('/create-portal-session', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await db.query(
            `SELECT stripe_customer_id FROM users WHERE id = $1;`, [userId]
        );

        if (!user || !user.stripeCustomerId) {
            return res.status(400).json({ error: 'No Stripe customer ID found for user.' });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: 'https://wishify.ca/manage-subscription', // redirect after managing
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating billing portal session:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

router.post('/reactivate-subscription', authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const user = await db.query(
        `SELECT stripe_subscription_id FROM users WHERE id = $1;`, [userId]
    );
  
      if (!user || !user.stripe_subscription_id) {
        return res.status(400).json({ error: 'No active subscription found.' });
      }
  
      const subscription = await stripe.subscriptions.update(user.stripe_subscription_id, {
        cancel_at_period_end: false,
      });
  
      res.json({ message: 'Subscription reactivated.', subscription });
    } catch (err) {
      console.error('Error reactivating subscription:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.sendStatus(400);
    }


    // Handle different event types
    switch (event.type) {
        case 'checkout.session.completed':
            // Handle getting subscription 

            try {
                const session = event.data.object;

                if (!session.customer_email || !session.customer || !session.subscription) {
                    console.error("Missing required session fields:", {
                        email: session.customer_email,
                        customer: session.customer,
                        subscription: session.subscription,
                    });
                    return res.status(400).send("Missing required session fields.");
                }

                const email = session.customer_email;
                const customerId = session.customer;
                const subscriptionId = session.subscription;

                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                await db.query(`
                UPDATE users
                SET 
                    stripe_customer_id = $1,
                    stripe_subscription_id = $2,
                    subscription_status = $3,
                    subscription_ends = to_timestamp($4),
                    subscription_plan = $5,
                    dateUpdated = NOW(),
                    pro = TRUE
                WHERE email = $6
                RETURNING *;
                `, [customerId,
                    subscriptionId,
                    subscription.status,
                    subscription.current_period_end,
                    subscription.items.data[0].price.id,
                    email]);

                console.log(`Subscription completed and updated for email: ${email}`);
            } catch (err) {
                console.error('Failed to update user after checkout.session.completed:', err.message);
            }

            break;
        case 'customer.subscription.deleted':
            // Handle subscription cancellation
            const subscription = event.data.object;
            const stripecustomerId = subscription.customer;

            try {
                await db.query(`
                UPDATE users
                SET 
                    subscription_status = 'canceled',
                    subscription_ends = NOW(),
                    pro = FALSE,
                    dateUpdated = NOW()
                WHERE stripe_customer_id  = $1;
                `, [stripecustomerId]);

                console.log(`Subscription canceled for customer: ${stripecustomerId}`);
            } catch (err) {
                console.error('Failed to update user after subscription.deleted:', err.message);
            }

            break;
    }

    res.json({ received: true });
});


router.get('/subscription', authenticate, async (req, res) => {
    try {
        // Assume you stored the subscription ID for the user
        const { subscriptionId } = await getSubscriptionForUser(req.user.userId);
        //const subscription = await stripe.subscriptions.retrieve(subscriptionId);
/*
        const subscription = await stripe.subscriptions.list({
            subscription: subscriptionId,
            status: 'all',
            expand: ['data.default_payment_method'],
        });
*/
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['default_payment_method']
          });

          if (!subscription) {
            return res.json({ status: 'none' });
        }

        const price = subscription.items.data[0].price;
        const product = price.product;

        res.json({
            status: subscription.status,
            cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            plan: product.name,
            price: {
                amount: (price.unit_amount / 100).toFixed(2),
                currency: price.currency.toUpperCase(),
                interval: price.recurring.interval,
            },
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ error: 'Could not fetch subscription' });
    }
});


router.post('/cancel-subscription', authenticate, async (req, res) => {
    try {
        const { subscriptionId } = await getSubscriptionForUser(req.user.userId);
        const deleted = await stripe.subscriptions.del(subscriptionId);

        await db.query(`
            UPDATE users
            SET 
                subscription_status = 'canceled',
                subscription_ends = NOW(),
                pro = FALSE,
                dateUpdated = NOW()
            WHERE email = $1
            RETURNING *;
            `, [email]);


        res.json({ canceled: true, status: deleted.status });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
});


async function getSubscriptionForUser(userId) {
    try {
        const result = await db.query(
            `
        SELECT 
          stripe_customer_id, 
          stripe_subscription_id,
          subscription_status
        FROM users
        WHERE id = $1;`,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error("User not found");
        }

        const user = result.rows[0];

        if (!user.stripe_customer_id || !user.stripe_subscription_id) {
            return {
                subscribed: false,
                reason: 'No Stripe subscription linked to this account',
            };
        }

        return {
            subscribed: user.subscription_status === 'active',
            subscriptionId: user.stripe_subscription_id,
            status: user.subscription_status,
        };
    } catch (error) {
        console.error('Error fetching subscription info:', error);
        throw new Error("Failed to retrieve subscription status.");
    }
}


module.exports = router;