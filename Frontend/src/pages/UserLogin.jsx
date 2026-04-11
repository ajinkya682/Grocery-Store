// src/pages/UserLogin.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, User, MapPin, Eye, EyeOff, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { STORE_NAME } from '../config/constants';

const UserLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginUser, registerUser, isUserAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    pin: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isUserAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isUserAuthenticated, navigate, from]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Mobile and PIN restrictions
    if (name === 'mobile' && value.length > 10) return;
    if (name === 'pin' && value.length > 6) return;
    if (name === 'pincode' && value.length > 6) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login Logic
        const res = loginUser(formData.mobile, formData.pin);
        if (res.success) {
          navigate(from, { replace: true });
        } else {
          setError(res.message);
        }
      } else {
        // Register Logic
        if (formData.mobile.length !== 10) {
          setError('Mobile number must be 10 digits');
          setIsLoading(false);
          return;
        }
        if (formData.pin.length !== 6) {
          setError('Passkey must be 6 digits');
          setIsLoading(false);
          return;
        }
        
        const res = registerUser(formData);
        if (res.success) {
          navigate(from, { replace: true });
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col pt-12">
      {/* Header */}
      <div className="container-custom flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center text-gray-600 active:scale-90 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-right">
          <h2 className="text-xl font-black text-forest">{STORE_NAME}</h2>
          <p className="text-[10px] font-black text-accent uppercase tracking-widest">Premium Store</p>
        </div>
      </div>

      <div className="container-custom flex-grow">
        <div className="max-w-md mx-auto">
          {/* Welcome Text */}
          <div className="mb-10">
            <h1 className="text-3xl font-display font-black text-forest mb-2">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h1>
            <p className="text-gray-500 font-medium">
              {isLogin 
                ? 'Sign in to access your cart and orders' 
                : 'Join us for a premium shopping experience'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2.5rem] shadow-card p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5"
                  >
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="name"
                          required={!isLogin}
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ex: Ajinkya Saivar"
                          className="input-field pl-12"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    inputMode="numeric"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="input-field pl-20"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5"
                  >
                    {/* Address & Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Address</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                          <textarea
                            name="address"
                            required={!isLogin}
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Street, City"
                            className="input-field pl-12 h-14 resize-none pt-4"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Pincode</label>
                        <input
                          type="number"
                          name="pincode"
                          required={!isLogin}
                          inputMode="numeric"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="411001"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PIN Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">6-Digit Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPin ? 'text' : 'password'}
                    name="pin"
                    required
                    inputMode="numeric"
                    value={formData.pin}
                    onChange={handleInputChange}
                    placeholder="••••••"
                    className="input-field pl-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest transition-colors"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-50 border border-red-100 p-4 rounded-2xl"
                  >
                    <p className="text-red-600 text-xs font-bold text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-5 rounded-[1.25rem] text-base overflow-hidden relative group"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  <>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLogin ? 'Login Securely' : 'Create Account'}
                      <Sparkles size={18} className="text-accent" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-sm font-bold text-gray-500 hover:text-forest transition-colors"
              >
                {isLogin ? (
                  <>New to {STORE_NAME}? <span className="text-primary underline decoration-2 underline-offset-4">Register Now</span></>
                ) : (
                  <>Already have an account? <span className="text-primary underline decoration-2 underline-offset-4">Login</span></>
                )}
              </button>
            </div>
          </div>

          {/* Safe Checkout Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-black text-gray-300 uppercase tracking-[0.2em]">
            <Lock size={12} />
            100% Secure Authentication
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
