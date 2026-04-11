'use strict';

// ─────────────────────────────────────────────
// Application-wide constants
// ─────────────────────────────────────────────

module.exports = {
  // JWT
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  // Password hashing
  BCRYPT_SALT_ROUNDS: 12,

  // Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
  },

  // Upload constraints
  UPLOAD: {
    MAX_FILE_SIZE: 2 * 1024 * 1024, // 2 MB
    MAX_FILES: 5,
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
    IMAGEKIT_FOLDER: '/grocery-store/products',
  },

  // Rate limiting
  RATE_LIMIT: {
    GLOBAL: {
      WINDOW_MS: 15 * 60 * 1000, // 15 min
      MAX: 1000,
    },
    AUTH: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX: 200,
    },
  },

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },

  // Order status lifecycle
  ORDER_STATUSES: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
  ORDER_VALID_TRANSITIONS: {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: [],
  },
};
