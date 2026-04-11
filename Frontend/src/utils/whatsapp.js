/**
 * SaaS v4 WhatsApp ordering utility
 * Logic for generating professional invoice-style messages and wa.me links.
 */

export const generateWhatsAppLink = (params = {}, storeSettings = {}) => {
  const { order = {}, currentUser = null } = params;

  // 1. Resolve target number
  const rawNumber = storeSettings?.contact?.whatsapp;
  if (!rawNumber) return null; // Let the UI handle the missing configuration

  const cleanNumber = rawNumber.replace(/\D/g, '');
  const targetPhone = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

  // 2. Format Items List (Invoice style)
  const itemsList = order.items && order.items.length > 0 
    ? order.items.map((item, i) => 
        `${i + 1}. ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`
      ).join('\n')
    : 'No items captured';

  // 3. Resolve Customer Data
  const customerName = order.shippingAddress?.name || currentUser?.name || 'Customer';
  const customerMobile = order.shippingAddress?.phone || currentUser?.mobile || 'Not Provided';
  const customerAddress = order.shippingAddress?.address || currentUser?.address || 'Not Provided';
  const customerPincode = order.shippingAddress?.pincode || currentUser?.pincode || '';

  // 4. Construct the professional message
  const message = `
NEW ORDER: ${order.orderNumber || 'PENDING'}

CUSTOMER:
Name: ${customerName}
Mobile: ${customerMobile}
Address: ${customerAddress}${customerPincode ? ` - ${customerPincode}` : ''}

ITEMS:
${itemsList}

BILLING:
Subtotal: ₹${order.pricing?.subtotal || 0}
Delivery: ₹${order.pricing?.deliveryFee === 0 ? 'FREE' : (order.pricing?.deliveryFee || 0)}
GRAND TOTAL: ₹${order.pricing?.total || 0}

Please confirm availability and delivery time. Thank you!
`.trim();

  // 5. Return the encoded URL
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
};
