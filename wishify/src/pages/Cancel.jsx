export default function Cancel() {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Subscription Canceled</h1>
        <p className="text-lg text-gray-700">Looks like you canceled the checkout process.</p>
        <p className="text-sm text-gray-500 mt-2">No worries — you can subscribe anytime from your profile menu.</p>
      </div>
    );
  }
  