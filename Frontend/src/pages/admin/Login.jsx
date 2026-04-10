// src/pages/admin/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Store, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('ajinkyasaivar@admin.com'); // Pre-filled for demo
  const [password, setPassword] = useState('Admin@123'); // Pre-filled for demo
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-forest p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-saffron-500/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4 relative z-10">
            <Store className="text-saffron-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white relative z-10 tracking-tight">Admin Portal</h2>
          <p className="text-green-100 text-sm mt-1 relative z-10">Sign in to manage your store</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-semibold mb-6 flex items-center gap-2 border border-red-100 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="admin@store.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary hover:bg-forest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-gray-400 flex items-center justify-center gap-1 font-medium">
            <Leaf className="w-3 h-3 text-primary" /> Grocery Store Demo Environment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
