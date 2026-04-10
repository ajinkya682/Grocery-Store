// src/pages/Contact.jsx — placeholder
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => (
  <div className="min-h-screen bg-cream pt-16">
    <div className="container-custom max-w-xl mx-auto text-center">
      <p className="text-6xl mb-4">📞</p>
      <h1 className="text-3xl font-bold text-forest mb-2">Get In Touch</h1>
      <p className="text-gray-500 text-sm mb-8">We're here to help with your grocery needs.</p>
      <div className="bg-white rounded-2xl shadow-card p-6 text-left space-y-4 mb-8">
        {[
          { icon: Phone, label: 'Phone / WhatsApp', value: '+91 98765 43210' },
          { icon: Mail,  label: 'Email',            value: 'store@grocerystore.in' },
          { icon: MapPin,label: 'Address',          value: '123, Mahadwar Road, Kolhapur, MH 416001' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-sm font-semibold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>
      <Link to="/" className="btn-green inline-flex items-center gap-2">
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </div>
  </div>
);

export default Contact;
