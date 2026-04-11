/**
 * SaaS v4 WhatsApp ordering utility
 * Logic for generating professional invoice-style messages and wa.me links.
 */

export const generateWhatsAppLink = (params = {}, storeSettings = {}) => {
  const { 
    type = 'order', // 'order' or 'inquiry'
    order = {}, 
    currentUser = null 
  } = params;

  // 1. Resolve target number
  const rawNumber = storeSettings?.contact?.whatsapp;
  if (!rawNumber) return null;

  // Cleanup: Must be 10-13 digits, numeric only
  const cleanNumber = rawNumber.replace(/\D/g, '');
  if (cleanNumber.length < 10 || cleanNumber.length > 13) return null;
  
  const targetPhone = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

  // 2. Resolve Customer Data with professional fallbacks
  const customerName = (order.shippingAddress?.name || currentUser?.name || 'Guest User').trim();
  const customerMobile = (order.shippingAddress?.phone || currentUser?.mobile || 'Not Provided').trim();
  const customerAddress = (order.shippingAddress?.address || currentUser?.address || 'Not Provided').trim();
  const customerPincode = (order.shippingAddress?.pincode || currentUser?.pincode || 'Not Provided').trim();

  let message = '';

  if (type === 'inquiry') {
    // 3a. Construct Minimal Inquiry Message
    message = `
NEW CUSTOMER INQUIRY

Customer Name: ${customerName}
Mobile: ${customerMobile}
Address: ${customerAddress}
Pincode: ${customerPincode}

Message: Customer is interested but has not selected any products.
`.trim();
  } else {
    // 3b. Format Items List (Invoice style)
    const itemsList = order.items && order.items.length > 0 
      ? order.items.map((item, i) => 
          `${i + 1}. ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`
        ).join('\n')
      : 'No items captured';

    // 4. Construct Order Message
    message = `
NEW ORDER: ${order.orderNumber || 'PENDING'}

CUSTOMER:
Name: ${customerName}
Mobile: ${customerMobile}
Address: ${customerAddress}${customerPincode !== 'Not Provided' ? ` - ${customerPincode}` : ''}

ITEMS:
${itemsList}

BILLING:
Subtotal: ₹${order.pricing?.subtotal || 0}
Delivery: ₹${order.pricing?.deliveryFee === 0 ? 'FREE' : (order.pricing?.deliveryFee || 0)}
GRAND TOTAL: ₹${order.pricing?.total || 0}

Please confirm availability and delivery time. Thank you!
`.trim();
  }

  // 5. Return the encoded URL
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
};

