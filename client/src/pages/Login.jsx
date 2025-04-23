import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

function Login() {
  const navigate = useNavigate();
  const { backendurl, setIsLoggedin, setUserData } = useContext(AppContext);
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (state === 'Sign Up' && !name) {
      toast.error('Please provide your name');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
  
    try {
      axios.defaults.withCredentials = true;
      
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendurl}/api/user/register`, {
          name,
          email,
          password,
        });
  
        if (data?.success) {
          const user = data.user || data;
          setIsLoggedin(true);
          setUserData(user);
          
          // Store all necessary data
          localStorage.setItem('verifyUser', JSON.stringify({
            id: user._id || user.id,
            email: user.email
          }));
  
          // 1. First ensure navigation happens
          navigate('/email-verify', {
            state: { from: 'register' },
            replace: true
          });
  
          // 2. Then send OTP (fire-and-forget)
          axios.post(`${backendurl}/api/user/send-otp`, { 
            id: user._id || user.id 
          })
            .then(otpResponse => {
              console.log('OTP sent:', otpResponse.data);
              toast.success('OTP sent to your email!');
            })
            .catch(otpError => {
              console.error('OTP error:', otpError);
              toast.error('Failed to send OTP. Please request a new one.');
            });
  
        } else {
          toast.error(data?.msg || 'Registration failed!');
        }
      } else {
        // Login logic
        const { data } = await axios.post(`${backendurl}/api/user/login`, {
          email,
          password
        });
        
        if (data?.success) {
          const user = data.user;
          
          if (!user.isAccountVerify) {
            // For unverified accounts
            setUserData(user);
            localStorage.setItem('verifyUser', JSON.stringify({
              id: user._id,
              email: user.email
            }));
        
            // Navigate first to ensure smooth transition
            navigate('/email-verify', {
              state: { from: 'login' },
              replace: true
            });
        
            // Then send OTP in background
            try {
              await axios.post(`${backendurl}/api/user/send-otp`, { 
                id: user._id 
              });
              toast.info('Verification OTP sent to your email');
            } catch (otpError) {
              console.error('OTP sending error:', otpError);
              toast.warning('Please request OTP manually on verification page');
            }
          } else {
            // For verified accounts
            setIsLoggedin(true);
            setUserData(user);
            toast.success('Login successful!');
            navigate(`/profile/${user._id}`);
          }
        } else {
          toast.error(data?.msg || 'Login failed!');
        }}
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    
    <div className='relative w-full h-screen flex items-center justify-center'>
      <Navbar/>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className='absolute inset-0 w-full h-full object-cover'
      >
        <source src={assets.home_vi} type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className='absolute inset-0 bg-black bg-opacity-50'></div>

      {/* Content */}
      <div className='relative z-10 bg-slate-900 p-10 rounded-lg shadow-lg w-full max-w-md text-indigo-300 text-sm'>
        
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt='' />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none w-full'
                type='text'
                placeholder='Full Name'
                required
              />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='' />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none w-full'
              type='email'
              placeholder='Email'
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='' />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none w-full'
              type='password'
              placeholder='Password'
              required
              minLength={6}
            />
          </div>

          {state === 'Login' && (
            <p onClick={() => navigate('/reset-pass')} className='mb-4 text-indigo-500 cursor-pointer'>
              Forgot password?
            </p>
          )}

          <button
            className='w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 text-white font-medium disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : state}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>
              Login here
            </span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>
            Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
