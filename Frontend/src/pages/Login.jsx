// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Loader2, 
  Store, 
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  MapPin,
  Pencil
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { STORE_NAME } from '../config/constants';

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isRegistering = searchParams.get('mode') === 'register';
  
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginUser, loginAdmin, registerUser, isUserAuthenticated, isAdminAuthenticated } = useAuth();
  const { storeSettings } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || (role === 'admin' ? '/admin' : '/');

  // Form State
  const [formData, setFormData] = useState({
    name: '', // for register
    mobile: '',
    email: '', // for admin login
    address: '', // for register
    pincode: '', // for register
    pin: '', // for customer login/register
    password: '' // for admin login
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (role === 'user' && isUserAuthenticated) {
      navigate('/', { replace: true });
    } else if (role === 'admin' && isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isUserAuthenticated, isAdminAuthenticated, navigate, role]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Restrictions
    if (name === 'mobile' && value.length > 10) return;
    if (name === 'pin' && value.length > 6) return;
    if (name === 'pincode' && value.length > 6) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const toggleAuthMode = () => {
    const newMode = isRegistering ? 'login' : 'register';
    setSearchParams({ mode: newMode });
    setError('');
    // For registration, role is always user
    if (newMode === 'register') setRole('user');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Registration Flow
        if (formData.mobile.length !== 10) throw new Error('Mobile number must be 10 digits');
        const res = await registerUser({
          name: formData.name,
          mobile: formData.mobile,
          address: formData.address,
          pincode: formData.pincode,
          pin: formData.pin,
          role: 'user'
        });
        if (res.success) navigate(from, { replace: true });
        else setError(res.message);
      } else {
        // Login Flow
        if (role === 'admin') {
          const res = await loginAdmin(formData.email, formData.password);
          if (res.success) navigate('/admin');
          else setError(res.message);
        } else {
          const res = await loginUser(formData.mobile, formData.pin);
          if (res.success) navigate(from, { replace: true });
          else setError(res.message);
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Left Decoration - Desktop Only */}
      <div className={`hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 text-white transition-colors duration-700 ${role === 'admin' ? 'bg-[#0F172A]' : 'bg-forest'}`}>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <motion.div
          key={`${role}-${isRegistering}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="mb-12">
            <Link to="/" className="flex items-center gap-3 active:scale-95 transition-all">
              {storeSettings?.identity?.logoUrl ? (
                <img src={storeSettings.identity.logoUrl} alt="Logo" className="h-12 w-auto invert brightness-0" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                  <ShoppingBag size={24} />
                </div>
              )}
              <h1 className="text-2xl font-black font-display tracking-tight">
                {storeSettings?.identity?.name || STORE_NAME}
              </h1>
            </Link>
          </div>

          <h2 className="text-6xl font-display font-black leading-[1.1] mb-8">
            {isRegistering ? (
              <>Join the <br/><span className="text-accent italic">Community</span> Today.</>
            ) : role === 'admin' ? (
              <>Control your <br/><span className="text-secondary italic">Business</span> Empire.</>
            ) : (
              <>Freshness <br/><span className="text-accent italic">Delivered</span> Daily.</>
            )}
          </h2>
          
          <p className="text-xl text-white/70 max-w-md font-medium leading-relaxed">
            {isRegistering 
              ? 'Create an account to track heritage spice orders, manage your subscription, and access exclusive farm-fresh deals.'
              : role === 'admin' 
                ? 'Access the master dashboard to manage orders, catalog, and store analytics in real-time.' 
                : 'Sign in to access your farm-fresh groceries and track your premium spice deliveries.'}
          </p>

          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-forest ring-2 ring-white/10" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
              ))}
            </div>
            <p className="text-sm font-bold text-white/60">Joined by 2,000+ local families</p>
          </div>
        </motion.div>
      </div>

      {/* Right Form Component */}
      <div className="flex-1 flex flex-col p-6 sm:p-12 lg:p-20 justify-center">
        
        <div className="max-w-md mx-auto w-full">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-12 hover:text-primary transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to store
          </button>

          {/* Role Toggle (Only in Login Mode) */}
          {!isRegistering && (
            <div className="bg-gray-100/80 p-1.5 rounded-2xl flex items-center mb-10 overflow-hidden border border-gray-200/50">
              <button 
                onClick={() => { 
                  setRole('user'); 
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${role === 'user' ? 'bg-white text-forest shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <User size={14} /> Customer
              </button>
              <button 
                onClick={() => { 
                  setRole('admin'); 
                  setError(''); 
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${role === 'admin' ? 'bg-[#0F172A] text-white shadow-xl shadow-slate-900/10' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Store size={14} /> Store Owner
              </button>
            </div>
          )}

          <div className="mb-10">
            <h3 className="text-3xl font-display font-black text-slate-900 mb-2">
              {isRegistering 
                ? 'Create Account' 
                : role === 'admin' ? 'Owner Portal' : 'Glad you\'re here!'}
            </h3>
            <p className="text-slate-500 font-bold">
              {isRegistering 
                ? 'Fill in the details below to start your journey.'
                : role === 'admin' 
                  ? 'Enter your administrative credentials to continue.' 
                  : 'Sign in to your account with your 10-digit mobile number'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <AnimatePresence mode="wait">
              {isRegistering ? (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ex: Rajesh P."
                      className="input-field px-6 py-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Mobile Access</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        autoComplete="tel"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className="input-field pl-14 py-4"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">City/Area</label>
                      <input
                        name="address"
                        required
                        autoComplete="address-level2"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ex: Rajarampuri"
                        className="input-field px-6 py-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Pincode</label>
                      <input
                        type="number"
                        name="pincode"
                        required
                        autoComplete="postal-code"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="416008"
                        className="input-field px-6 py-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">6-Digit PIN</label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        name="pin"
                        required
                        autoComplete="new-password"
                        value={formData.pin}
                        onChange={handleInputChange}
                        placeholder="••••••"
                        className="input-field pr-12 py-4"
                        inputMode="numeric"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-forest"
                      >
                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : role === 'admin' ? (
                <motion.div
                  key="admin-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Admin Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="username"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="admin@shop.com"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-slate-900/20 focus:ring-4 focus:ring-slate-900/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Master Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-slate-900/20 focus:ring-4 focus:ring-slate-900/5 transition-all"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="user-login-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Mobile Access</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        required
                        autoComplete="username tel"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className="input-field pl-14 py-4"
                        inputMode="numeric"
                      />
                    </div>
                  </div>
 
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">6-Digit PIN</label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        name="pin"
                        required
                        autoComplete="current-password"
                        value={formData.pin}
                        onChange={handleInputChange}
                        placeholder="••••••"
                        className="input-field pr-12 py-4"
                        inputMode="numeric"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-forest"
                      >
                        {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Link 
                      to="/forgot-pin"
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4"
                    >
                      Forgot PIN?
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
 
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-600 text-[11px] font-black uppercase tracking-wider">{error}</p>
              </motion.div>
            )}
 
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${role === 'admin' && !isRegistering ? 'bg-[#0F172A] hover:bg-slate-800 shadow-2xl shadow-slate-900/10' : 'bg-primary hover:bg-forest shadow-2xl shadow-primary/10'}`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isRegistering 
                    ? 'Complete Registration' 
                    : role === 'admin' ? 'Access Dashboard' : 'Sign In Securely'}
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={toggleAuthMode}
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors focus:outline-none"
            >
              {isRegistering 
                ? <>Already a member? <span className="text-primary underline underline-offset-4 decoration-2">Sign In</span></>
                : <>Don't have an account? <span className="text-primary underline underline-offset-4 decoration-2">Create one</span></>
              }
            </button>
          </div>

          {/* Security Footer */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center gap-4">
             <div className="flex items-center gap-6">
                <ShieldCheck className="text-slate-300" size={32} />
                <div className="h-8 w-[1px] bg-slate-100" />
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encryption</p>
                   <p className="text-[10px] font-bold text-slate-300 italic">Certified Secure Portal</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
