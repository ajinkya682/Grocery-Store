// src/context/StoreContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [storeSettings, setStoreSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate initial load from a database backend
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800)); // mock network delay

      // Load from local storage to preserve edits in demo mode, else fallback to defaults
      const saved = localStorage.getItem("mockStoreSettings");
      if (saved) {
        setStoreSettings(JSON.parse(saved));
      } else {
        setStoreSettings({
          identity: {
            name: "Grocery Store",
            tagline: "Fresh & Pure",
            logoUrl:
              "https://thumbs.dreamstime.com/b/vegetables-shopping-cart-trolley-grocery-logo-icon-design-vector-171090350.jpg",
          },
          contact: {
            phone: "+91 96574 59908",
            email: "store@grocerystore.in",
            whatsapp: "919657459908", // digits only for api
          },
          location: {
            address: "123, Mahadwar Road, Kolhapur, Maharashtra 416001",
            mapEmbexdUrl:
              "https://www.google.com/maps/embed?pb=!4v1775840831657!6m8!1m7!1sXzqdHW2LwzuaohvXdZ2VaA!2m2!1d20.44931100225097!2d75.42171643227351!3f8.223857883319795!4f-11.264841458621476!5f0.7820865974627469",
          },
          businessHours: {
            weekdays: "8:00 AM – 9:00 PM",
            weekends: "9:00 AM – 7:00 PM",
          },
          delivery: {
            freeRadiusKm: 3,
            sameDayDelivery: true,
            freeDeliveryMinOrder: 499,
          },
          social: {
            instagram: "#",
            facebook: "#",
            youtube: "#",
          },
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
    localStorage.setItem("mockStoreSettings", JSON.stringify(updated));
    return true; // Return success status
  };

  return (
    <StoreContext.Provider value={{ storeSettings, loading, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
};
