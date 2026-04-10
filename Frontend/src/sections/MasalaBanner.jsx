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
    <section id="masala-banner" className="py-6 bg-cream">
      <div className="container-custom">
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, #1a3a1a 0%, #2a5a20 40%, #3d6b2a 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 w-60 h-60 bg-primary-400/10 rounded-full translate-y-1/2 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[350px]">
            {/* Product image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex items-end justify-center md:justify-end overflow-hidden p-6 pb-0 md:pb-6"
            >
              {/* "Our Brand" label */}
              <div className="absolute top-10 left-10 bg-accent text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                ✦ Our Own Collection
              </div>
              <img
                src="/images/kolhapuri_masala.png"
                alt="Heritage Kolhapuri Masala"
                className="relative z-10 w-64 md:w-80 object-contain drop-shadow-2xl"
                style={{ animation: "float 4s ease-in-out infinite" }}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center px-6 md:pr-10 md:pl-4 pb-8 md:py-10"
            >
              <span className="text-accent text-xs font-bold uppercase tracking-widest mb-3">
                Kolhapuri Collection
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Our Own Kolhapuri Masala –{" "}
                <span className="text-accent">
                  Authentic. Pure. Traditional.
                </span>
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
                Crafted from 15+ hand-selected spices using a generation-old
                family recipe. No artificial colour, no preservatives — just the
                real fiery taste of Kolhapur.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-7">
                {badges.map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-1.5 bg-white/10 border border-white/15 text-gray-200 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
                  >
                    <Icon size={12} className="text-saffron-400" />
                    {text}
                  </span>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-gray-400 text-xs line-through">
                    ₹{masala?.originalPrice}
                  </p>
                  <p className="text-white text-2xl font-bold">
                    ₹{masala?.price}{" "}
                    <span className="text-sm font-normal text-gray-300">
                      / 250g
                    </span>
                  </p>
                </div>
                <button
                  id="masala-explore-btn"
                  onClick={() => masala && addItem(masala)}
                  className="btn-primary gap-2"
                >
                  Explore Kolhapuri → <ArrowRight size={15} />
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
