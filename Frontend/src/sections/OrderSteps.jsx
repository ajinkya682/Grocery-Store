// src/sections/OrderSteps.jsx
import { Search, ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Search,
    title: '1. Browse',
    description: 'Explore our wide range of fresh groceries, dals, masalas, and daily essentials.',
    color: 'from-primary-500 to-primary-700',
    lightBg: 'bg-primary-50',
    iconColor: 'text-primary-600',
  },
  {
    step: '02',
    icon: ShoppingCart,
    title: '2. Add to Cart',
    description: 'Select your items and add them to your cart. Review your order anytime.',
    color: 'from-saffron-400 to-saffron-600',
    lightBg: 'bg-saffron-50',
    iconColor: 'text-saffron-500',
  },
  {
    step: '03',
    icon: MessageCircle,
    title: '3. WhatsApp Order',
    description: 'Tap "Order via WhatsApp" — a pre-filled message opens instantly. We confirm and deliver!',
    color: 'from-[#25D366] to-[#128C4E]',
    lightBg: 'bg-green-50',
    iconColor: 'text-[#25D366]',
  },
];

const OrderSteps = () => {
  return (
    <section id="how-it-works" className="py-16 bg-cream">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Simple Ordering in 3 Steps</h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
            No apps to download. No accounts needed. Just browse, pick, and WhatsApp us — that's it!
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary-200 via-saffron-300 to-green-300 z-0" style={{ left: '22%', right: '22%' }} />

          {steps.map(({ step, icon: Icon, title, description, color, lightBg, iconColor }, i) => (
            <div
              key={step}
              className="reveal relative z-10 flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Icon circle */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-5 relative`}>
                <Icon size={30} className="text-white" />
                {/* Step number chip */}
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center text-[10px] font-black text-gray-700 shadow">
                  {i + 1}
                </span>
              </div>

              {/* Card */}
              <div className={`${lightBg} rounded-2xl p-5 w-full border border-gray-100 shadow-card card-hover`}>
                <h3 className="font-bold text-forest text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>

              {/* Arrow between steps (mobile) */}
              {i < steps.length - 1 && (
                <div className="md:hidden mt-4 text-gray-300">
                  <ArrowRight size={20} className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderSteps;
