// src/sections/HeroSection.jsx
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Star, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';

const stats = [
  { icon: Truck,       label: 'Free Delivery',    sub: 'Orders above ₹499' },
  { icon: ShieldCheck, label: '100% Fresh',        sub: 'Farm to your door' },
  { icon: Star,        label: 'Quality Assured',   sub: '4.9★ rated store' },
  { icon: Zap,         label: 'Daily Deals',       sub: 'New offers every day' },
];

const HeroSection = () => {
  const { orderViaWhatsApp } = useCart();

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d2010 0%, #1a3a1a 60%, #2d4a1a 100%)',
      }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero_bg.png"
          alt="Fresh Indian Groceries"
          className="w-full h-full object-cover opacity-35 mix-blend-luminosity"
        />
        {/* Radial overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2010]/90 via-[#0d2010]/60 to-transparent" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-saffron-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 right-16 w-48 h-48 bg-primary-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="container-custom relative z-10 flex-1 flex items-center pt-10 pb-6">
        <div className="max-w-xl">
          {/* Tag */}
          <div
            className="inline-flex items-center gap-2 bg-saffron-500/20 border border-saffron-400/30 text-saffron-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
            style={{ animation: 'fadeInUp 0.5s ease forwards' }}
          >
            <span className="w-1.5 h-1.5 bg-saffron-400 rounded-full animate-pulse-slow" />
            Kolhapur's Trusted Grocery Store
          </div>

          {/* Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-5"
            style={{ animation: 'fadeInUp 0.6s 0.1s ease both' }}
          >
            Daily Groceries.
            <br />
            <span className="text-saffron-400">Trusted Quality.</span>
            <br />
            Delivered Fast.
          </h1>

          {/* Sub text */}
          <p
            className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-md"
            style={{ animation: 'fadeInUp 0.6s 0.2s ease both' }}
          >
            Shop premium rice, dals, masalas & fresh staples. Order directly via WhatsApp — no apps, no hassle, just fresh groceries at your doorstep.
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-wrap gap-3"
            style={{ animation: 'fadeInUp 0.6s 0.3s ease both' }}
          >
            <a
              href="#featured-products"
              id="hero-shop-now"
              className="btn-primary text-base"
              onClick={e => {
                e.preventDefault();
                document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ShoppingBag size={18} />
              Shop Now
            </a>
            <button
              id="hero-order-whatsapp"
              onClick={orderViaWhatsApp}
              className="btn-whatsapp text-base"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Order on WhatsApp
            </button>
          </div>
        </div>

        {/* Floating badge — desktop only */}
        <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2" style={{ animation: 'float 4s ease-in-out infinite' }}>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white text-center shadow-2xl">
            <div className="text-4xl mb-1">🌿</div>
            <p className="text-sm font-bold">100% Natural</p>
            <p className="text-xs text-gray-300 mt-0.5">No preservatives</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 bg-saffron-500 mt-auto">
        <div className="container-custom py-4 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-saffron-400/50">
          {stats.map(({ icon: Icon, label, sub }, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-1.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-bold leading-tight">{label}</p>
                <p className="text-saffron-100 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
