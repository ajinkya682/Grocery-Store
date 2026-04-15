// src/pages/Contact.jsx
import { Store, MapPin, Phone, Clock, MessageSquare, Send } from "lucide-react";
import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

const Contact = () => {
  const { storeSettings } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    const rawWa = storeSettings?.contact?.whatsapp || "919657459908";
    const waNumber = rawWa.replace(/\D/g, "");
    const phone = waNumber.length === 10 ? `91${waNumber}` : waNumber;

    const text = `*New Contact Message*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Message:* ${formData.message}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="container-custom">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-forest mb-4">
            Get in Touch
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            We're a local family store — always happy to help. Reach out on
            WhatsApp for the fastest response.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact Info Card */}
            <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Store size={20} className="text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-forest">
                  {storeSettings?.identity?.name || "Local Grocery"}
                </h2>
              </div>

              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <MapPin
                    size={20}
                    className="text-saffron-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {storeSettings?.identity?.tagline || "Main Market Road"}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {storeSettings?.location?.address ||
                        "Heritage Square, Kolhapur"}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone
                    size={20}
                    className="text-saffron-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                      {storeSettings?.contact?.phone || "+91 96574 59908"}
                    </p>
                    <p className="text-sm text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-1">
                      Direct Business Line
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock
                    size={20}
                    className="text-saffron-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                      Mon–Sat:{" "}
                      {storeSettings?.businessHours?.weekdays || "8am–9pm"}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                      Sun: {storeSettings?.businessHours?.weekends || "9am–6pm"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp Direct */}
            <button
              onClick={handleSendMessage}
              className="w-full text-left block bg-[#25D366] hover:bg-[#128C7E] rounded-3xl p-8 transition-colors group cursor-pointer shadow-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={24} className="text-white" />
                <h2 className="text-xl font-bold text-white group-hover:underline">
                  Chat with us on WhatsApp
                </h2>
              </div>
              <p className="text-white/90 text-sm font-medium">
                Fastest way to reach us — typically responds in minutes
              </p>
            </button>

            {/* Our Story Outline */}
            <div className="bg-transparent p-6 rounded-3xl relative overflow-hidden">
              <h3 className="text-lg font-bold text-forest mb-4">Our Story</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                For over 20 years, our family has been at the heart of the
                community, sourcing the finest grains and freshest produce
                directly from local farmers.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                What started as a small grain stall has grown into a trusted
                destination for quality. We believe that food is family, and
                every product we stock is something we'd serve at our own table.
              </p>
              <Store
                size={120}
                className="absolute -bottom-6 -right-6 text-primary-200/50 -rotate-12"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Map Interaction */}
            <div className="w-full h-[450px] bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-100 shadow-card">
              <iframe
                title="Store Location"
                src="https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1776263501135!5m2!1sen!2sin!6m8!1m7!1sXzqdHW2LwzuaohvXdZ2VaA!2m2!1d20.44931100225097!2d75.42171643227351!3f17.03308702281748!4f-5.698954223846755!5f1.2205083079694439"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-card p-8 lg:p-10 border border-gray-100">
              <h2 className="text-2xl font-display font-bold text-forest mb-8">
                Send us a message
              </h2>
              <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full bg-gray-50 px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="How can we help you today?"
                    rows="6"
                    className="w-full bg-gray-50 px-4 py-3.5 rounded-xl border border-transparent focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-forest hover:bg-forest-light text-white font-semibold py-4 px-8 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                  <p className="text-xs text-gray-400 italic mt-4">
                    We'll reply via email within 24 hours
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
