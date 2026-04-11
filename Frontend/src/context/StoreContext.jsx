// src/context/StoreContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { settingsAPI } from '../api/apiService';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data } = await settingsAPI.get();
        setStoreSettings(data.data.settings);
      } catch (err) {
        console.error('StoreContext: failed to fetch settings', err);
        // Fallback defaults so UI doesn't break if backend is down
        setStoreSettings({
          identity: { name: 'Grocery Store', tagline: 'Fresh & Pure', logoUrl: '' },
          contact: { phone: '', email: '', whatsapp: '' },
          location: { address: '', mapEmbedUrl: '' },
          businessHours: { weekdays: '8:00 AM – 9:00 PM', weekends: '9:00 AM – 7:00 PM' },
          delivery: { freeRadiusKm: 3, sameDayDelivery: true, freeDeliveryMinOrder: 499 },
          social: { instagram: '#', facebook: '#', youtube: '#' },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const { data } = await settingsAPI.update(newSettings);
      setStoreSettings(data.data.settings);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update settings',
      };
    }
  };

  return (
    <StoreContext.Provider value={{ storeSettings, loading, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
};
