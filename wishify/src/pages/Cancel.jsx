import { useEffect,useState  } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cancel() {

  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);


    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Subscription Canceled</h1>
        <p className="text-lg text-gray-700">Looks like you canceled the checkout process.</p>
        <p className="text-sm text-gray-500 mt-2">No worries — you can subscribe anytime from your profile menu.</p>
        <p className="mt-6 text-sm text-gray-400">Redirecting to homepage in {countdown}...</p>
      </div>
    );
  }
  