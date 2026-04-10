// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';

// Inline SVGs for social icons (avoids lucide version issues)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47A2.78 2.78 0 0 0 1.46 6.42 29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const footerLinks = {
  'Quick Links': [
    { label: 'Home',     path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Contact',  path: '/contact' },
    { label: 'Our Story',path: '/' },
  ],
  'Categories': [
    { label: 'Rice & Grains',    path: '/products?category=rice-grains' },
    { label: 'Lentils & Dal',    path: '/products?category=lentils' },
    { label: 'Masalas & Spices', path: '/products?category=masalas-spices' },
    { label: 'Oils',             path: '/products?category=oils' },
    { label: 'Flour & Atta',     path: '/products?category=flour' },
    { label: 'Dairy',            path: '/products?category=dairy' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#0d2010] text-white">
      {/* Main footer */}
      <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <div>
              <p className="font-black text-white tracking-tight text-base">Grocery Store</p>
              <p className="text-[9px] text-saffron-400 font-semibold uppercase tracking-widest">Fresh & Pure</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Your trusted local grocery store delivering fresh, quality produce and authentic Kolhapuri masalas right to your door.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: InstagramIcon, href: '#', label: 'Instagram' },
              { Icon: FacebookIcon,  href: '#', label: 'Facebook' },
              { Icon: YoutubeIcon,   href: '#', label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-saffron-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{title}</h4>
            <ul className="space-y-2.5">
              {links.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-saffron-400 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">Get in Touch</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-saffron-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-400 text-sm">123, Mahadwar Road, Kolhapur, Maharashtra 416001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-saffron-400 flex-shrink-0" />
              <a href="tel:+919876543210" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-saffron-400 flex-shrink-0" />
              <a href="mailto:store@grocerystore.in" className="text-gray-400 hover:text-saffron-400 text-sm transition-colors">store@grocerystore.in</a>
            </li>
          </ul>
          <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Open Hours</p>
            <p className="text-sm text-white">Mon–Sat: 8:00 AM – 9:00 PM</p>
            <p className="text-sm text-white">Sunday: 9:00 AM – 7:00 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Grocery Store. All rights reserved.</p>
          <p>Made with ❤️ in Kolhapur, Maharashtra</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
