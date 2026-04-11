// src/sections/MasalaBanner.jsx
import { ArrowRight, Award, Leaf, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProduct } from "../context/ProductContext";
import { motion } from "framer-motion";

const badges = [
  { icon: Award, text: "Heritage Recipe" },
  { icon: Leaf, text: "100% Natural" },
  { icon: Star, text: "500+ Reviews" },
];

const MasalaBanner = () => {
  const { addItem } = useCart();
  const { products } = useProduct();
  const masala = products.find((p) => p.id === 3) || products[0]; // fallback if not found

  return (
    <section id="masala-banner" className="py-10 lg:py-16 bg-cream overflow-hidden">
      <div className="container-custom">
        <div
          className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #0B3D2E 0%, #06261d 100%)",
          }}
        >
          {/* Decorative assets */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center min-h-[450px]">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 flex items-center justify-center p-10 lg:p-20 relative group"
            >
              <div className="absolute inset-0 bg-white/5 blur-[80px] rounded-full group-hover:bg-accent/10 transition-colors" />
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=640&auto=format&fit=crop"
                alt="Heritage Kolhapuri Masala"
                className="relative z-10 w-64 sm:w-80 h-64 sm:h-80 object-cover rounded-[3rem] shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute top-12 left-12 lg:top-24 lg:left-24 bg-accent text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-2xl z-20">
                ✦ Our Masterpiece
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-1/2 p-10 lg:p-20 pt-0 lg:pt-20 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <span className="text-accent text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-4">
                Authentic Spices
              </span>
              <h2 className="text-[2rem] sm:text-[3rem] lg:text-[4rem] font-display font-black text-white leading-tight mb-6">
                Our Signature <br />
                <span className="text-accent">Kolhapuri Masala</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-medium">
                A legacy recipe passed down through generations. 24 hand-roasted spices blended to perfection for that iconic fiery kick.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                {badges.map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl backdrop-blur-md"
                  >
                    <Icon size={14} className="text-accent" />
                    {text}
                  </span>
                ))}
              </div>

              {/* Price & Action */}
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                <div className="flex flex-col items-center lg:items-start">
                  <p className="text-white text-3xl font-black">
                    ₹189{" "}
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      / 250g
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => masala && addItem(masala)}
                  className="btn-primary w-full sm:w-auto px-10 py-5 text-base rounded-[1.5rem] bg-accent shadow-2xl hover:shadow-accent/40 group active:scale-95"
                >
                  Explore Collection
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasalaBanner;
