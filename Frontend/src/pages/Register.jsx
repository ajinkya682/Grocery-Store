// src/pages/Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { STORE_NAME } from '../config/constants';

const Register = () => {
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { registerUser, isUserAuthenticated } = useAuth();
  const { storeSettings } = useStore();
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
      navigate('/', { replace: true });
    }
  }, [isUserAuthenticated, navigate]);

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
      if (formData.mobile.length !== 10) throw new Error('Mobile number must be 10 digits');
      
      const registrationData = {
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address,
        pincode: formData.pincode,
        pin: formData.pin,
        role: 'user'
      };
      
      const res = await registerUser(registrationData);
      if (res.success) navigate(from, { replace: true });
      else setError(res.message);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Left Decoration - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 text-white transition-colors duration-700 bg-forest">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="relative z-10">
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
            Create <br/><span className="text-accent italic">Account</span> Today.
          </h2>
          
          <p className="text-xl text-white/70 max-w-md font-medium leading-relaxed">
            Join our community to access farm-fresh groceries, track heritage spice orders, and manage your premium subscription.
          </p>

          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-forest ring-2 ring-white/10" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
              ))}
            </div>
            <p className="text-sm font-bold text-white/60">Joined by 2,000+ local families</p>
          </div>
        </div>
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

          <div className="mb-10">
            <h3 className="text-3xl font-display font-black text-slate-900 mb-2">
              Create Account
            </h3>
            <p className="text-slate-500 font-bold">
              Fill in the details below to start your journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div className="space-y-5">
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
                  className="input-field"
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
                    className="input-field pl-14"
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
                    className="input-field"
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
                    className="input-field"
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
                    className="input-field pr-12"
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
            </div>
 
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-600 text-[11px] font-black uppercase tracking-wider">{error}</p>
              </motion.div>
            )}
 
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 bg-primary hover:bg-forest shadow-2xl shadow-primary/10"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Complete Registration
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link 
              to="/login"
              className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
            >
              Already a member? <span className="text-primary underline underline-offset-4 decoration-2">Sign in</span>
            </Link>
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

export default Register;
