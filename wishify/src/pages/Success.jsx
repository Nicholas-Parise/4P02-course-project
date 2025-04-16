import { useEffect,useState  } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    console.log('Stripe session ID:', sessionId);

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
  }, [navigate, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Success!</h1>
      <p className="text-lg text-gray-700">Thank you for subscribing to Wishify Pro.</p>
      <p className="text-sm text-gray-500 mt-2">You can now enjoy all the premium features.</p>
      <p className="mt-6 text-sm text-gray-400">Redirecting to homepage in {countdown}...</p>
    </div>
  );
}
