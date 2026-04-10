// src/context/StoreContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate initial load from a database backend
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // mock network delay
      
      // Load from local storage to preserve edits in demo mode, else fallback to defaults
      const saved = localStorage.getItem('mockStoreSettings');
      if (saved) {
        setStoreSettings(JSON.parse(saved));
      } else {
        setStoreSettings({
          identity: {
            name: 'Grocery Store',
            tagline: 'Fresh & Pure',
            logoUrl: '', 
          },
          contact: {
            phone: '+91 98765 43210',
            email: 'store@grocerystore.in',
            whatsapp: '919876543210', // digits only for api
          },
          location: {
            address: '123, Mahadwar Road, Kolhapur, Maharashtra 416001',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122283.68413156683!2d74.15663737330545!3d16.70862118317424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1000cdec07a29%3A0xece8ea642952e42f!2sKolhapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1707001402266!5m2!1sen!2sin', 
          },
          businessHours: {
            weekdays: '8:00 AM – 9:00 PM',
            weekends: '9:00 AM – 7:00 PM'
          },
          delivery: {
            freeRadiusKm: 3,
            sameDayDelivery: true,
            freeDeliveryMinOrder: 499,
          },
          social: {
            instagram: '#',
            facebook: '#',
            youtube: '#',
          }
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    // Simulate API POST / update
    const updated = { ...storeSettings, ...newSettings };
    setStoreSettings(updated);
    localStorage.setItem('mockStoreSettings', JSON.stringify(updated));
    return true; // Return success status
  };

  return (
    <StoreContext.Provider value={{ storeSettings, loading, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
};
