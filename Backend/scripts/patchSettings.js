// Backend/scripts/patchSettings.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const StoreSettings = require('../src/models/StoreSettings.model');

const defaultSettings = {
  identity: {
    name: "Heritage Organics",
    tagline: "Pure • Authentic • Fresh",
    logoUrl: ""
  },
  contact: {
    phone: "919657459908",
    email: "contact@heritageorganics.com",
    whatsapp: "919657459908" // DEFAULT NUMBER
  },
  location: {
    address: "Mahadwar Road, Kolhapur, Maharashtra 416012",
    mapEmbedUrl: ""
  },
  businessHours: {
    weekdays: "8:00 AM – 9:00 PM",
    weekends: "9:00 AM – 7:00 PM"
  },
  delivery: {
    freeRadiusKm: 5,
    sameDayDelivery: true,
    freeDeliveryMinOrder: 500
  }
};

async function patchSettings() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    let settings = await StoreSettings.findOne();
    
    if (!settings) {
      console.log('No settings found. Creating default settings...');
      settings = await StoreSettings.create(defaultSettings);
    } else {
      console.log('Updating existing settings with WhatsApp number...');
      settings.contact.whatsapp = defaultSettings.contact.whatsapp;
      await settings.save();
    }
    
    console.log('✅ Store Settings Patched Successfully!');
    console.log('WhatsApp Number set to:', settings.contact.whatsapp);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error patching settings:', err);
    process.exit(1);
  }
}

patchSettings();
