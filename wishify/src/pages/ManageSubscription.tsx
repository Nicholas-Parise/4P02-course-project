import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

type SubStatus = {
  status: string;
  cancelAt: string | null;
  since: string;
  currentPeriodEnd: string;
  planName: string;
  price: {
    amount: string;
    currency: string;
    interval: string;
  };
};

export default function ManageSubscription() {

  const stripePromise = loadStripe('pk_test_51RDYNcRAn3aH2VOgUOLi7IWb1xIGEC4ab6dMBztTnka81mO0k7wpUct6qbcLpIJ4yCMqGabdnvP2XVE6k3NmPa6600DpD8aTgu');
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token') || '';

  const fetchStatus = async () => {
    const res = await fetch('https://api.wishify.ca/payments/subscription', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    const data = await res.json();
    setStatus(data);
    setLoading(false);
  };

  const cancelSubscription = async () => {
    const res = await fetch('https://api.wishify.ca/payments/cancel-subscription', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    alert('Subscription cancellation scheduled.');
    fetchStatus();
  };


  const ChangePayment = async () => {
    console.log(token);
    const res = await fetch('https://api.wishify.ca/payments/create-portal-session', {
      method: 'POST',
      headers: {
        'Authorization': "Bearer " + token,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    const stripe = await stripePromise;
   // stripe?.redirectToCheckout(data.url);
    window.location.href = data.url;
   
  };


  const reactivateSub = async () => {
    console.log(token);
    const res = await fetch('https://api.wishify.ca/payments/reactivate-subscription', {
      method: 'POST',
      headers: {
        'Authorization': "Bearer " + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priceId: 'price_1RDYS9RAn3aH2VOg7t2vQ7N5' }) // actual Stripe Price ID
    });

    const data = await res.json();

    const stripe = await stripePromise;
    //stripe?.redirectToCheckout(data.url);

    //stripe.redirectToCheckout({ url: data.url });
    //stripe.redirectToCheckout({ sessionId: data.sessionId });
    window.location.href = data.url;
    
  };



  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg">Loading subscription status...</div>
      </div>
    );
  }

  if (!status || status.status === 'none') {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">No Subscription</h2>
        <p className="text-gray-600">You don’t have an active subscription.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Subscription Details</h2>

      <div className="mb-2">
        <span className="font-semibold text-gray-700">Plan:</span> {status.planName}
      </div>

      <div className="mb-2">
        <span className="font-semibold text-gray-700">Price:</span> {status.price.amount} {status.price.currency} / {status.price.interval}
      </div>

      <div className="mb-2">
        <span className="font-semibold text-gray-700">Status:</span>{' '}
        <span
          className={`inline-block px-2 py-1 rounded text-white text-sm ${status.status === 'active'
              ? 'bg-green-500'
              : status.status === 'trialing'
                ? 'bg-blue-500'
                : 'bg-red-500'
            }`}
        >
          {status.status}
        </span>
      </div>

      <div className="mb-2">
        <span className="font-semibold text-gray-700">Member since:</span>{' '}
        {new Date(status.since).toLocaleDateString()}
      </div>

      <div className="mb-2">
        <span className="font-semibold text-gray-700">Renews on:</span>{' '}
        {new Date(status.currentPeriodEnd).toLocaleDateString()}
      </div>

      {status.cancelAt && (
        <div className="mb-4 text-yellow-700">
          <span className="font-semibold">Scheduled to cancel on:</span>{' '}
          {new Date(status.cancelAt).toLocaleDateString()}
        </div>
      )}

      {!status.cancelAt ? (
        <button
          onClick={cancelSubscription}
          className="mt-4 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
        >
          Cancel Subscription
        </button>
      ) : (
        <button
          onClick={reactivateSub}

          className="mt-4 w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
        >
          Reactivate Subscription
        </button>
      )}

      <button
        onClick={ChangePayment}
        className="mt-4 w-full px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition"
      >

        Update Payment Method
      </button>
    </div>
  );
}