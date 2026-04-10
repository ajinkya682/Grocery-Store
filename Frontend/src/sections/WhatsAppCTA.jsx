// src/sections/WhatsAppCTA.jsx
import { useCart } from '../context/CartContext';
import { ShieldCheck, Clock, Star } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.843L.057 23.786a.75.75 0 0 0 .921.921l5.943-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.032-1.381l-.36-.214-3.728.977.993-3.63-.235-.373A9.785 9.785 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

const perks = [
  { icon: ShieldCheck, text: 'Verified Fresh Products'    },
  { icon: Clock,       text: 'Same Day Delivery'          },
  { icon: Star,        text: 'No Hidden Charges'          },
];

const WhatsAppCTA = () => {
  const { orderViaWhatsApp, totalItems } = useCart();

  return (
    <section id="whatsapp-cta" className="py-6 bg-white">
      <div className="container-custom">
        <div
          className="relative overflow-hidden rounded-3xl text-center py-16 px-6"
          style={{
            background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-saffron-500/10 rounded-full -translate-y-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-400/15 rounded-full translate-y-1/3 blur-2xl pointer-events-none" />

          {/* WhatsApp icon with pulse */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-[#25D366]/30 rounded-full animate-ping scale-150 opacity-40" />
            <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
              <WhatsAppIcon />
            </div>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Order Directly on WhatsApp
          </h2>
          <p className="text-gray-300 max-w-md mx-auto text-sm leading-relaxed mb-8">
            Skip the apps and complicated checkouts. Just tap the button below — your order details open in WhatsApp automatically. We confirm within minutes.
          </p>

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-4 mb-9">
            {perks.map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-2 text-sm text-gray-300">
                <Icon size={15} className="text-saffron-400" />
                {text}
              </span>
            ))}
          </div>

          {/* CTA button */}
          <button
            id="whatsapp-cta-btn"
            onClick={orderViaWhatsApp}
            className="bg-accent text-white px-6 py-3 rounded-xl pulse-btn flex items-center justify-center gap-2 mx-auto font-bold shadow-soft"
          >
            <WhatsAppIcon />
            {totalItems > 0 ? `Order Now (${totalItems} items)` : 'Order Now'}
          </button>

          <p className="mt-5 text-gray-500 text-xs">
            Typically responds within 10 minutes • Available 8 AM – 9 PM
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
