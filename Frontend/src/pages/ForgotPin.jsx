// src/pages/ForgotPin.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone,
  ShieldCheck,
  Loader2,
  ChevronRight,
  ArrowLeft,
  ShoppingBag,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { STORE_NAME } from '../config/constants';

const ForgotPin = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    newPin: ''
  });
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { resetPin } = useAuth();
  const { storeSettings } = useStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile' && value.length > 10) return;
    if (name === 'newPin' && value.length > 6) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (formData.mobile.length !== 10) throw new Error('Mobile number must be 10 digits');
      if (formData.newPin.length < 6) throw new Error('New PIN must be at least 6 digits');

      const res = await resetPin(formData.name, formData.mobile, formData.newPin);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2500);
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Something went wrong.' });
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
            Forgot <br/><span className="text-accent italic">Your PIN?</span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-md font-medium leading-relaxed">
            Verify your registration details to reset your access PIN securely.
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
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-12 hover:text-primary transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to login
          </button>

          <div className="mb-10">
            <h3 className="text-3xl font-display font-black text-slate-900 mb-2">
              Identity Verification
            </h3>
            <p className="text-slate-500 font-bold">
              Enter your registered name and mobile number to reset your PIN.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-forest/20 outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+91</span>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-forest/20 outline-none transition-all font-semibold"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">New 6-Digit PIN</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type={showPin ? 'text' : 'password'}
                    name="newPin"
                    required
                    value={formData.newPin}
                    onChange={handleInputChange}
                    placeholder="••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-forest/20 outline-none transition-all font-semibold"
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
 
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <p className="text-[11px] font-black uppercase tracking-wider">{message.text}</p>
              </motion.div>
            )}
 
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-[0.2em] text-white transition-all active:scale-95 disabled:opacity-50 bg-primary hover:bg-forest shadow-2xl shadow-primary/10"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Update PIN Securely
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center gap-4">
             <div className="flex items-center gap-6">
                <ShieldCheck className="text-slate-300" size={32} />
                <div className="h-8 w-[1px] bg-slate-100" />
                <div className="flex flex-col">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encryption</p>
                   <p className="text-[10px] font-bold text-slate-300 italic">Certified Secure Reset</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPin;
