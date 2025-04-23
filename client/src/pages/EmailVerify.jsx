import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

function EmailVerify() {
  const { backendurl } = useContext(AppContext);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from location state or localStorage
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('verifyUser');
    return saved ? JSON.parse(saved) : location.state?.user || null;
  });

  useEffect(() => {
    if (!userData?.id) {
      toast.error('Verification session expired');
      navigate('/login');
    }
  }, [userData, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!userData?.id) {
      toast.error('User information missing');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendurl}/api/user/verify-account`, {
        id: userData.id || userData._id,
        otp,
      });

      if (data.success) {
        toast.success(data.msg);
        localStorage.removeItem('verifyUser');
        navigate(`/profile/${userData.id || userData._id}`);
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error verifying account");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userData?.id) {
      toast.error('User information missing');
      return;
    }

    try {
      const { data } = await axios.post(`${backendurl}/api/user/send-otp`, {
        id: userData.id || userData._id
      });
      
      if (data.success) {
        toast.success(data.msg || 'OTP resent successfully');
      } else {
        toast.error(data.msg || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Error resending OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-4 text-sm text-gray-300">
        We've sent an OTP to your email: <b>{userData?.email}</b>
      </p>

      <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 text-black rounded"
          required
          maxLength={6}
        />
        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <button
        className="mt-4 text-sm text-blue-400 hover:underline"
        onClick={handleResend}
        disabled={loading}
      >
        Resend OTP
      </button>
    </div>
  );
}

export default EmailVerify;