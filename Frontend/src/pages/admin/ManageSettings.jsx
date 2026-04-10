// src/pages/admin/ManageSettings.jsx
import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save } from 'lucide-react';

const ManageSettings = () => {
  const { storeSettings, updateSettings, loading } = useStore();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (storeSettings) setForm(storeSettings);
  }, [storeSettings]);

  if (loading || !form) return <div className="animate-pulse bg-gray-200 h-96 rounded-2xl w-full"></div>;

  const handleChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateSettings(form);
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in max-w-4xl">
      {/* Store Identity */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-dark border-b border-gray-100 pb-4 mb-6">Store Identity & Display</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Store Name</label>
            <input type="text" value={form.identity.name} onChange={e => handleChange('identity', 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tagline</label>
            <input type="text" value={form.identity.tagline} onChange={e => handleChange('identity', 'tagline', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
        </div>
      </div>

      {/* Contact & Hours */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-dark border-b border-gray-100 pb-4 mb-6">Contact & Business Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone Support</label>
            <input type="text" value={form.contact.phone} onChange={e => handleChange('contact', 'phone', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">WhatsApp (Digits only)</label>
            <input type="text" value={form.contact.whatsapp} onChange={e => handleChange('contact', 'whatsapp', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email Address</label>
            <input type="email" value={form.contact.email} onChange={e => handleChange('contact', 'email', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Weekday Hours</label>
            <input type="text" value={form.businessHours.weekdays} onChange={e => handleChange('businessHours', 'weekdays', e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
        </div>
      </div>

      {/* Delivery Logic */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-dark border-b border-gray-100 pb-4 mb-6">Delivery Logic</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Free Delivery Radius (km)</label>
            <input type="number" value={form.delivery.freeRadiusKm} onChange={e => handleChange('delivery', 'freeRadiusKm', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Min Order for Free Delivery (₹)</label>
            <input type="number" value={form.delivery.freeDeliveryMinOrder} onChange={e => handleChange('delivery', 'freeDeliveryMinOrder', parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-primary outline-none" />
          </div>
          <div className="flex items-center gap-3 pt-8">
            <input type="checkbox" id="sameDay" checked={form.delivery.sameDayDelivery} onChange={e => handleChange('delivery', 'sameDayDelivery', e.target.checked)} className="w-5 h-5 accent-primary" />
            <label htmlFor="sameDay" className="text-sm font-semibold text-gray-700">Offer Same-Day Delivery</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="bg-primary hover:bg-forest text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
          {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
        </button>
      </div>
    </form>
  );
};

export default ManageSettings;
