'use strict';

const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema(
  {
    identity: {
      name: { type: String, default: 'Grocery Store', trim: true },
      tagline: { type: String, default: 'Fresh & Pure', trim: true },
      logoUrl: { type: String, default: '' },
    },
    contact: {
      phone: { type: String, default: '', trim: true },
      email: { type: String, default: '', lowercase: true, trim: true },
      whatsapp: { 
        type: String, 
        default: '919657459908', 
        trim: true,
        validate: {
          validator: function(v) {
            return /^[0-9]{10,13}$/.test(v);
          },
          message: props => `${props.value} is not a valid WhatsApp number! Use 10-13 digits without spaces or plus signs.`
        }
      },
    },
    location: {
      address: { type: String, default: '', trim: true },
      mapEmbedUrl: { type: String, default: '' },
    },
    businessHours: {
      weekdays: { type: String, default: '8:00 AM – 9:00 PM' },
      weekends: { type: String, default: '9:00 AM – 7:00 PM' },
    },
    delivery: {
      freeRadiusKm: { type: Number, default: 3 },
      sameDayDelivery: { type: Boolean, default: true },
      freeDeliveryMinOrder: { type: Number, default: 499 },
    },
    social: {
      instagram: { type: String, default: '#' },
      facebook: { type: String, default: '#' },
      youtube: { type: String, default: '#' },
    },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
  }
);

// ─── Singleton pattern ────────────────────────────────────────────────────────
storeSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({});
  }
  return doc;
};

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

module.exports = StoreSettings;
