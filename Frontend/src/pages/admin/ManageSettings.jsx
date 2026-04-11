// src/pages/admin/ManageSettings.jsx
import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Store, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  Shield, 
  Bell, 
  Save, 
  Check, 
  Camera,
  MessageSquare,
  Key,
  Database,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadAPI } from '../../api/apiService';

const SettingSection = ({ title, description, children }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 border-b border-slate-100 last:border-0">
    <div className="lg:col-span-4 max-w-sm">
      <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-sm font-bold text-slate-400 leading-relaxed">{description}</p>
    </div>
    <div className="lg:col-span-8 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-saas">
      <div className="space-y-8">
         {children}
      </div>
    </div>
  </div>
);

const InputGroup = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
        <Icon size={18} />
      </div>
      <input 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-700 outline-none focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all"
      />
    </div>
  </div>
);

const ToggleGroup = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
    <div>
      <p className="text-sm font-black text-slate-900">{label}</p>
      <p className="text-xs font-bold text-slate-400">{description}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition-all flex items-center px-1 ${checked ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200'}`}
    >
      <motion.div 
        animate={{ x: checked ? 24 : 0 }}
        className="w-6 h-6 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

const ManageSettings = () => {
  const { storeSettings, updateSettings } = useStore();
  const [form, setForm] = useState(storeSettings || {
    identity: { name: '', tagline: '', logoUrl: '' },
    contact: { phone: '', email: '', whatsapp: '' },
    location: { address: '', mapEmbedUrl: '' },
    businessHours: { weekdays: '8:00 AM – 9:00 PM', weekends: '9:00 AM – 7:00 PM' },
    delivery: { freeRadiusKm: 3, sameDayDelivery: true, freeDeliveryMinOrder: 499 },
    social: { instagram: '', facebook: '', youtube: '' }
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const { data } = await uploadAPI.uploadImages([file]);
      if (data?.success && data.data?.[0]?.url) {
        setForm((prev) => ({
          ...prev,
          identity: {
            ...prev.identity,
            logoUrl: data.data[0].url
          }
        }));
      }
    } catch (err) {
      console.error('Logo upload failed', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    await updateSettings(form);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-display">Store Ecosystem</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Configure your global business identity and operations.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
            success ? 'bg-green-500 text-white shadow-lg' : 'bg-primary text-white shadow-xl shadow-primary/10 hover:bg-forest'
          }`}
        >
          {saving ? 'Synchronizing...' : success ? <><Check size={18} /> Settings Applied</> : <><Save size={18} /> Commit Changes</>}
        </button>
      </div>

      <div className="space-y-4">
        {/* Section 1: Identity */}
        <SettingSection 
          title="Store Identity" 
          description="Basic public information about your business. This appears on invoices and the website header."
        >
          <div className="flex flex-col sm:flex-row gap-8 items-center pb-4">
             <div className="relative group">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 overflow-hidden">
                   {form.identity?.logoUrl ? <img src={form.identity.logoUrl} className="w-full h-full object-cover" alt="" /> : <Camera size={32} />}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-xl shadow-xl border border-slate-100 text-slate-500 hover:text-primary transition-all cursor-pointer">
                   {uploadingLogo ? <Loader2 size={16} className="animate-spin text-primary" /> : <Camera size={16} />}
                   <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
             </div>
             <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-sm font-black text-slate-900">Brand Representation</p>
                <p className="text-xs font-bold text-slate-400">Resolution: 512x512px (PNG/WebP Recommended)</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup 
              label="Legal Store Name" 
              icon={Store} 
              value={form.identity?.name} 
              onChange={(e) => setForm({...form, identity: {...form.identity, name: e.target.value}})}
              placeholder="e.g. Heritage Organics" 
            />
            <InputGroup 
              label="Contact Email" 
              icon={Globe} 
              value={form.contact?.email} 
              onChange={(e) => setForm({...form, contact: {...form.contact, email: e.target.value}})}
              placeholder="hello@store.com" 
              type="email"
            />
            <InputGroup 
              label="Business WhatsApp" 
              icon={Phone} 
              value={form.contact?.whatsapp} 
              onChange={(e) => setForm({...form, contact: {...form.contact, whatsapp: e.target.value}})}
              placeholder="+91 00000 00000" 
            />
            <InputGroup 
              label="Contact Phone" 
              icon={Phone} 
              value={form.contact?.phone} 
              onChange={(e) => setForm({...form, contact: {...form.contact, phone: e.target.value}})}
              placeholder="+91 00000 00000" 
            />
          </div>
        </SettingSection>

        {/* Section 2: Operations */}
        <SettingSection 
          title="Operational Logic" 
          description="Manage how your store handles currency, delivery fees, and timezones."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <InputGroup 
              label="Free Delivery Radius (km)" 
              icon={MapPin} 
              value={form.delivery?.freeRadiusKm} 
              onChange={(e) => setForm({...form, delivery: {...form.delivery, freeRadiusKm: Number(e.target.value)}})}
              placeholder="3" 
              type="number"
            />
             <InputGroup 
              label="Min Order for Free Delivery (₹)" 
              icon={Store} 
              value={form.delivery?.freeDeliveryMinOrder} 
              onChange={(e) => setForm({...form, delivery: {...form.delivery, freeDeliveryMinOrder: Number(e.target.value)}})}
              placeholder="499" 
              type="number"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
             <ToggleGroup 
               label="Accept Orders Mode" 
               description="Turning this off will prevent items from being added to the cart."
               checked={true}
               onChange={() => {}}
             />
             <ToggleGroup 
               label="Display Out of Stock" 
               description="Show products that have 0 inventory units in the catalog."
               checked={true}
               onChange={() => {}}
             />
          </div>
        </SettingSection>

        {/* Section 3: WhatsApp Integration */}
        <SettingSection 
          title="API & Automation" 
          description="Supercharge your workflow by connecting automated WhatsApp triggers."
        >
          <div className="space-y-6">
             <div className="bg-slate-950 p-8 rounded-[2rem] text-white flex flex-col sm:flex-row items-center gap-6 border border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                   <MessageSquare size={32} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                   <p className="text-base font-black">Official Cloud API Status</p>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Pending Setup</p>
                </div>
                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                   Authenticate
                </button>
             </div>
             
             <div className="grid grid-cols-1 gap-6">
                <InputGroup 
                  label="Instagram URL" 
                  icon={Globe} 
                  value={form.social?.instagram} 
                  onChange={(e) => setForm({...form, social: {...form.social, instagram: e.target.value}})}
                  placeholder="https://instagram.com/yourstore" 
                />
             </div>
          </div>
        </SettingSection>

        {/* Section 4: Maintenance */}
        <SettingSection 
          title="System Maintenance" 
          description="Manage your data backups and administrative security."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center sm:text-left">
             <button className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-slate-100 transition-all group flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary transition-all">
                   <Database size={20} />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-900">Export Catalog</p>
                   <p className="text-[10px] font-bold text-slate-400">Last backup: 2h ago</p>
                </div>
             </button>
             <button className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-slate-100 transition-all group flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-red-500 transition-all">
                   <Shield size={20} />
                </div>
                <div>
                   <p className="text-sm font-black text-slate-900">Admin Permissions</p>
                   <p className="text-[10px] font-bold text-slate-400">2 Active Managers</p>
                </div>
             </button>
          </div>
        </SettingSection>
      </div>
    </div>
  );
};

export default ManageSettings;
