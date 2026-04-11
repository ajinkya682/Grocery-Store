// src/sections/HeroSection.jsx
import {
  ArrowRight,
  ShoppingBag,
  Phone,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const HeroSection = () => {
  const { orderViaWhatsApp } = useCart();

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-white pt-8 lg:pt-20"
    >
      {/* Background Gradient & Pattern */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-b lg:bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#2a5a20_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="container-custom relative z-10 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            >
              <Star size={14} className="fill-primary" />
              Trusted by 5,000+ happy families
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem] font-display font-black text-forest leading-[1.1] mb-6"
            >
              Fresh Groceries <br />
              <span className="text-accent underline decoration-forest/10 decoration-wavy">Delivered</span> to Your <br className="hidden sm:block" />
              Kitchen
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 lg:mb-10 max-w-lg font-medium px-4 lg:px-0"
            >
              Premium quality products, handpicked from the farm, delivered at lighting speed. Freshness you can taste, quality you can trust.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 lg:px-0"
            >
              <a
                href="#featured-products"
                id="hero-shop-now"
                className="btn-primary w-full sm:w-auto px-10 py-5 text-base shadow-2xl"
              >
                Start Shopping
                <ShoppingBag
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>

              <button
                id="hero-whatsapp-direct"
                onClick={() => orderViaWhatsApp()}
                className="btn-secondary w-full sm:w-auto px-10 py-5 text-base border-primary/20 text-primary hover:bg-primary hover:text-white"
              >
                <Phone size={20} />
                WhatsApp Order
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 mt-10 lg:mt-12 pt-8 border-t border-gray-100 w-full sm:w-auto"
            >
              <div className="flex items-center gap-2 text-primary/70">
                <CheckCircle2 size={16} />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                  100% Organic
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary/70">
                <CheckCircle2 size={16} />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                  Same-Day Delivery
                </span>
              </div>
              <div className="flex items-center gap-2 text-primary/70">
                <CheckCircle2 size={16} />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                  No Min. Order
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Assets */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image with floating animation */}
            <div
              className="relative z-10 w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white"
              style={{ animation: "float 6s ease-in-out infinite" }}
            >
              <img
                src="https://townsquare.media/site/393/files/2025/08/attachment-franki-chamaki-ivfp_yxzuyq-unsplash-4.jpg?w=980&q=75"
                alt="Premium Groceries"
                className="w-full h-full object-cover"
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/20 to-transparent" />
            </div>

            {/* Floating UI elements */}
            <div
              className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none"
              style={{ animation: "float 8s ease-in-out infinite alternate" }}
            />
            <div
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"
              style={{
                animation: "float 10s ease-in-out infinite alternate-reverse",
              }}
            />

            {/* Highlighted Category Card (Floating) */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -right-6 top-1/4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white">
                  🌶️
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Featured
                  </p>
                  <p className="text-sm font-black text-forest">
                    Organic Masalas
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -left-6 bottom-1/4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/50 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-white">
                  🥦
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Freshness
                  </p>
                  <p className="text-sm font-black text-forest">
                    Farm Picked Daily
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
