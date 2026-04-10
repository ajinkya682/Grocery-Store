// src/pages/OurMasalas.jsx
import { useEffect, useState } from "react";
import { useProduct } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import {
  Check,
  ShoppingCart,
  Star,
  Award,
  Leaf,
  Zap,
  Phone,
  ArrowRight,
} from "lucide-react";
import LazyImage from "../components/ui/LazyImage";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const OurMasalas = () => {
  const { products } = useProduct();
  const { addItem, orderViaWhatsApp } = useCart();
  const [selectedWeight, setSelectedWeight] = useState("250 g");
  const [activeProduct, setActiveProduct] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  // Sync active product based on weight selection
  useEffect(() => {
    const p = products.find(
      (prod) =>
        prod.category === "Our Masalas" && prod.weight === selectedWeight,
    );
    setActiveProduct(p);
  }, [selectedWeight, products]);

  const handleAddToCart = () => {
    if (activeProduct) {
      addItem(activeProduct);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const ingredients = [
    {
      name: "Byadagi Chili",
      desc: "For vibrant red color & mild heat",
      icon: "🌶️",
    },
    {
      name: "Sankeshwari Chili",
      desc: "The secret to authentic spice",
      icon: "🔥",
    },
    {
      name: "Coriander Seeds",
      desc: "Roasted to aromatic perfection",
      icon: "🌿",
    },
    {
      name: "Cloves & Cinnamon",
      desc: "Hand-ground heritage spices",
      icon: "🪵",
    },
  ];

  const usageIdeas = [
    {
      title: "Chicken Gravy",
      desc: "Add 2 spoons for that authentic fiery red base.",
      img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
    },
    {
      title: "Spicy Veg Maratha",
      desc: "Perfect for thick, flavorful vegetable curries.",
      img: "https://www.cookingcarnival.com/wp-content/uploads/2023/10/Veg-maratha-1.webp",
    },
    {
      title: "Egg Curry",
      desc: "Elevates simple boiled eggs into a gourmet meal.",
      img: "https://www.spicebangla.com/wp-content/uploads/2024/08/Egg-Masala-Curry.webp",
    },
  ];

  const reviews = [
    {
      name: "Sunita Patil",
      rating: 5,
      text: "Exactly like the masala my grandmother used to make. The aroma fills the entire house!",
    },
    {
      name: "Rajesh K.",
      rating: 5,
      text: "The heat is perfect. This is now a staple in our kitchen for every Sunday chicken curry.",
    },
    {
      name: "Megha D.",
      rating: 5,
      text: "Truly pure. No artificial colors or smells. 100% recommended for authentic taste.",
    },
  ];

  return (
    <div className="animate-page">
      {/* 1. Page Hero */}
      <section className="relative min-h-[70vh] flex items-center bg-forest overflow-hidden py-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.2 }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 shadow-xl"
            >
              Flagship Collection
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight mb-6"
            >
              Authentic <br />
              <span className="text-accent underline decoration-white/20 underline-offset-8">
                Kolhapuri
              </span>{" "}
              <br />
              Masala
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-lg mb-10 font-medium"
            >
              Spice crafted with tradition, delivering rich and bold flavors.
              Hand-pounded to preserve essential oils and heritage taste.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("product-section")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="btn-primary ripple px-8"
              >
                Order Now <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-3xl aspect-[4/5] md:aspect-square">
              <LazyImage
                src="https://www.nairutivyutpadan.com/cdn/shop/files/kolhapuri_3.png?v=1768402032&width=1000"
                alt="Authentic Kolhapuri Masala"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative labels */}
            <div
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hidden md:block"
              style={{ animation: "float 4s ease-in-out infinite" }}
            >
              <p className="text-xs font-black text-gray-400 uppercase mb-1">
                Recipe From
              </p>
              <p className="text-xl font-black text-forest tracking-tighter">
                1984 Heritage
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Story Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="section-tag">Our Heritage</span>
            <h2 className="section-title text-forest text-4xl mb-6 font-display">
              Crafted in the Heart of Kolhapur
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Our masala isn't just a spice; it's a family legacy. Unlike
              mass-produced powders, we use a 15-spice blend roasted in small
              batches to ensure the highest quality and most potent aroma.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: Award, t: "Hand-Roasted", s: "Small batches" },
              { icon: Leaf, t: "100% Pure", s: "No filllers" },
              { icon: Zap, t: "Stone Ground", s: "Preserved oils" },
              { icon: Check, t: "Generational", s: "Family secret" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-light rounded-2xl text-center hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
              >
                <item.icon size={24} className="mx-auto text-secondary mb-3" />
                <p className="text-forest font-black text-sm uppercase mb-1 tracking-tight">
                  {item.t}
                </p>
                <p className="text-gray-400 text-xs font-bold">{item.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Builder / Order Section */}
      <section id="product-section" className="py-24 bg-light overflow-hidden">
        <div className="container-custom">
          <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border border-gray-100">
            <div className="space-y-8">
              <div>
                <span className="text-secondary font-black tracking-widest uppercase text-sm mb-4 block">
                  Select Quantity
                </span>
                <h3 className="text-4xl font-display font-black text-forest mb-4">
                  The Flagship Jar
                </h3>
              </div>

              {/* Weight Selector */}
              <div className="flex gap-4">
                {["100 g", "250 g", "500 g"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`
                          flex-1 py-4 rounded-2xl border-2 transition-all font-black text-sm
                          ${
                            selectedWeight === w
                              ? "border-primary bg-primary/5 text-primary shadow-lg scale-105"
                              : "border-gray-100 text-gray-400 hover:border-gray-300"
                          }
                        `}
                  >
                    {w}
                  </button>
                ))}
              </div>

              <div className="py-8 border-y border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm line-through font-bold">
                    ₹{activeProduct?.originalPrice}
                  </p>
                  <p className="text-5xl font-black text-forest">
                    ₹{activeProduct?.price}
                  </p>
                </div>
                <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-xl text-xs font-black">
                  {Math.round(
                    ((activeProduct?.originalPrice - activeProduct?.price) /
                      activeProduct?.originalPrice) *
                      100,
                  )}
                  % OFF
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-[2] py-5 rounded-2xl font-black uppercase tracking-widest transition-all ripple shadow-xl
                        ${isAdded ? "bg-forest text-white" : "bg-primary text-white hover:bg-[#07261d] active:scale-95"}
                      `}
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={20} /> Item Added!
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart size={20} /> Add to Cart
                    </span>
                  )}
                </button>
                <button
                  onClick={orderViaWhatsApp}
                  className="flex-1 btn-whatsapp py-5 rounded-2xl shadow-xl"
                >
                  <Phone size={20} /> WhatsApp
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 rounded-full scale-110 blur-3xl" />
              <LazyImage
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNB4iJxYl4e7D-F6B37_StBB--1tcWoVdVGQ&s"
                }
                alt={activeProduct?.name}
                className="relative z-10 w-full rounded-[2rem] shadow-card group-hover:rotate-2 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ingredients Breakdown */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title text-forest text-4xl mb-6">
              What's Inside?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto font-bold">
              Absolutely no fillers, no powders. Just whole spices cleaned,
              roasted, and blended.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ingredients.map((ing, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-light rounded-[2.5rem] border border-gray-100 flex flex-col items-center text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">
                  {ing.icon}
                </div>
                <h4 className="text-lg font-black text-forest mb-2">
                  {ing.name}
                </h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">
                  {ing.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Usage Ideas */}
      <section className="py-24 bg-forest text-white">
        <div className="container-custom">
          <h2 className="font-display text-4xl font-black mb-12 text-center md:text-left">
            Elevate Your Cooking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usageIdeas.map((idea, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                  <img
                    src={idea.img}
                    alt={idea.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-xl font-black tracking-tight">
                      {idea.title}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                  "{idea.desc}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Social Proof */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <h2 className="section-title text-4xl font-display text-forest mb-6">
                Loved by Local Families
              </h2>
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="fill-secondary text-secondary"
                    size={18}
                  />
                ))}
              </div>
              <p className="text-gray-600 font-bold mb-8 italic text-lg leading-relaxed">
                "Our kitchen doesn't feel the same without this masala. It's the
                soul of our Sunday lunch."
              </p>
              <button className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:translate-x-2 transition-transform">
                Read all 500+ reviews <ArrowRight size={14} />
              </button>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev, i) => (
                <div
                  key={i}
                  className="p-8 bg-light rounded-[2rem] border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(rev.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="fill-secondary text-secondary"
                        size={12}
                      />
                    ))}
                  </div>
                  <p className="text-forest font-bold mb-4 text-sm leading-relaxed tracking-tight">
                    "{rev.text}"
                  </p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    — {rev.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="py-24 bg-cream">
        <div className="container-custom">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

            <h2 className="text-white text-4xl md:text-5xl font-display font-black mb-8 relative z-10">
              Start Your Authentic <br className="hidden md:block" /> Spice
              Journey Today
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <button
                onClick={() =>
                  document
                    .getElementById("product-section")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="btn-primary px-10 py-5 text-lg"
              >
                Shop Now
              </button>
              <button
                onClick={orderViaWhatsApp}
                className="btn-secondary px-10 py-5 text-lg border-white/30 hover:bg-white/10"
              >
                Follow on Instagram
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurMasalas;
