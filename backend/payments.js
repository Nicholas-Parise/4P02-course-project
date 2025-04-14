const express = require('express');
const router = express.Router();
const db = require('./db');
const authenticate = require('./middleware/authenticate');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-subscription-session', authenticate, async (req, res) => {
    try {
        const { priceId } = req.body;

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: req.user.email,
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ error: 'Unable to create checkout session' });
    }
});


router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return res.sendStatus(400);
    }

    const email = session.customer_email;

    // Handle different event types
    switch (event.type) {
        case 'checkout.session.completed':
            // Handle getting subscription 
            const session = event.data.object;
            const customerId = session.customer;
            const subscriptionId = session.subscription;
            
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);

            console.log(`Subscription successful for email: ${email}`);

            await db.query(`
                UPDATE users
                SET 
                    stripe_customer_id = $1,
                    stripe_subscription_id = $2,
                    status = $3,
                    current_period_end = to_timestamp($4),
                    plan = $5
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

            break;
        case 'customer.subscription.deleted':
            // Handle subscription cancellation
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
            break;

    }

    res.json({ received: true });
});


router.get('/subscription', authenticate, async (req, res) => {
    try {
        // Assume you stored the subscription ID for the user
        const { subscriptionId } = await getSubscriptionForUser(req.user.userId); // implement this
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        res.json(subscription);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ error: 'Could not fetch subscription' });
    }
});


router.post('/cancel-subscription', authenticate, async (req, res) => {
    try {
        const { subscriptionId } = req.body;
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