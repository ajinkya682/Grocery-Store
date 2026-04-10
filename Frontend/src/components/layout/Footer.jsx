// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// Inline SVGs for social icons
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
    { label: 'Rice & Grains',    path: '/products?category=Rice & Grains' },
    { label: 'Lentils & Dal',    path: '/products?category=Dals & Pulses' },
    { label: 'Masalas & Spices', path: '/products?category=Masalas & Spices' },
    { label: 'Oils',             path: '/products?category=Cooking Essentials' },
    { label: 'Dairy',            path: '/products?category=Dairy & Bakery' },
  ],
};

const Footer = () => {
  const { storeSettings } = useStore();

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 text-sm font-sans pt-12">
      {/* Main footer */}
      <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-1 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="font-black font-display text-dark tracking-tight text-base">{storeSettings?.identity?.name || 'Grocery Store'}</p>
              <p className="text-[9px] text-accent font-bold uppercase tracking-[0.2em]">{storeSettings?.identity?.tagline || 'Fresh & Pure'}</p>
            </div>
          </div>
          <p className="text-gray-500 leading-relaxed mb-5 font-medium">
            Your trusted local grocery store delivering fresh, quality produce and authentic Kolhapuri masalas right to your door.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: InstagramIcon, href: storeSettings?.social?.instagram || '#', label: 'Instagram' },
              { Icon: FacebookIcon,  href: storeSettings?.social?.facebook || '#', label: 'Facebook' },
              { Icon: YoutubeIcon,   href: storeSettings?.social?.youtube || '#', label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-light hover:bg-accent hover:text-white text-gray-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-dark font-bold font-display mb-4 tracking-wide text-lg">{title}</h4>
            <ul className="space-y-3">
              {links.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="hover:text-accent font-medium transition-colors duration-200"
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
          <h4 className="text-dark font-bold font-display mb-4 tracking-wide text-lg">Get in Touch</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
              <span className="font-medium text-gray-500">123, Mahadwar Road, Kolhapur, Maharashtra 416001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-accent flex-shrink-0" />
              <a href={`tel:${storeSettings?.contact?.phone?.replace(/\s+/g,'')}`} className="font-medium hover:text-accent transition-colors text-gray-500">{storeSettings?.contact?.phone || '+91 98765 43210'}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-accent flex-shrink-0" />
              <a href={`mailto:${storeSettings?.contact?.email}`} className="font-medium hover:text-accent transition-colors text-gray-500">{storeSettings?.contact?.email || 'store@grocerystore.in'}</a>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-light rounded-xl border border-gray-100">
            <p className="text-xs font-bold mb-1 text-dark">Open Hours</p>
            <p className="font-medium text-gray-500 text-xs">Mon–Sun: {storeSettings?.businessHours?.weekdays || '8:00 AM – 9:00 PM'}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-light/50">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center font-medium justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} {storeSettings?.identity?.name || 'Grocery Store'}. All rights reserved.</p>
          <p>Made with ❤️ in Kolhapur, Maharashtra</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
