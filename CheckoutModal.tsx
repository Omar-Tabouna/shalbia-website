import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { CartItem } from './CartDrawer';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

const ALEXANDRIA_AREAS = [
  "Agami", "Asafra", "Azarita", "Bahary", "Borg El Arab", "Camp Caesar", 
  "Dekheila", "Gleem", "Ibrahemya", "Kafr Abdo", "King Mariout", "Laurent", 
  "Maamoura", "Mahatet El Raml", "Mandara", "Mansheya", "Miami", "Moharam Bek", 
  "Montaza", "Roushdy", "San Stefano", "Schutz", "Shatby", "Sidi Beshr", 
  "Sidi Gaber", "Smouha", "Sporting", "Stanley", "Victoria", "Zizinia"
];

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, onOrderComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Alexandria',
    area: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    area: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', area: '', address: '' };

    // Name Validation: At least 3 chars
    if (formData.name.trim().length < 3) {
      newErrors.name = "Please enter a valid full name (min 3 chars).";
      isValid = false;
    }

    // Phone Validation: Egyptian Format (01xxxxxxxxx)
    // 1. Remove non-digits
    const cleanPhone = formData.phone.replace(/\D/g, '');
    // 2. Check regex for 010, 011, 012, 015 and 11 total digits
    const phoneRegex = /^01[0-2,5][0-9]{8}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 11-digit phone number (e.g., 01xxxxxxxxx).";
      isValid = false;
    }

    // Area Validation
    if (!formData.area) {
      newErrors.area = "Please select your area.";
      isValid = false;
    }

    // Address Validation
    if (formData.address.trim().length < 5) {
      newErrors.address = "Please provide a detailed address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // 1. Generate Notification for Admin (Local Storage)
    try {
        const stored = localStorage.getItem('shalabia_notifications');
        const notifications = stored ? JSON.parse(stored) : [];
        
        notifications.push({
            id: Date.now(),
            type: 'order',
            message: `New Order: ${formData.name} - ${cartItems.length} items (${total.toLocaleString()} EGP)`,
            timestamp: new Date().toLocaleString()
        });

        // Keep last 50 notifications
        if (notifications.length > 50) notifications.shift();
        
        localStorage.setItem('shalabia_notifications', JSON.stringify(notifications));

        // Also save detailed order info
        const storedOrders = localStorage.getItem('shalabia_orders');
        const orders = storedOrders ? JSON.parse(storedOrders) : [];
        orders.push({
            id: Date.now(),
            customer: formData,
            items: cartItems,
            total: total,
            date: new Date().toLocaleString(),
            status: 'pending'
        });
        localStorage.setItem('shalabia_orders', JSON.stringify(orders));
        
    } catch(err) {
        console.error("Failed to save order notification", err);
    }

    // 2. Format Order Data for Excel (CSV Format) for the email body
    const csvHeader = "ItemID,Product Name,Category,Price\n";
    const csvRows = cartItems.map(item => 
      `${item.id},"${item.title}",${item.category},${item.price}`
    ).join("\n");
    
    const excelData = csvHeader + csvRows + `\n\nTOTAL,,,${total}`;

    // 3. Format Email Body
    const subject = `New Order from ${formData.name} - ${new Date().toLocaleDateString()}`;
    const body = `
NEW ORDER RECEIVED

CUSTOMER DETAILS:
------------------
Name: ${formData.name}
Phone: ${formData.phone}
City: ${formData.city}
Area: ${formData.area}
Address: ${formData.address}
Notes: ${formData.notes}

ORDER SUMMARY:
------------------
Total Items: ${cartItems.length}
Total Amount: ${total.toLocaleString()} EGP

EXCEL DATA (Copy below lines and save as .csv to open in Excel):
------------------
${excelData}
    `;

    // 4. Construct Mailto Link
    const mailtoLink = `mailto:shalabia.orders@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // 5. Open Email Client & Finish
    window.location.href = mailtoLink;

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderComplete();
      alert("Thank you! Your order has been recorded in our system. \n\nWe also opened your email client to send us the confirmation details.");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="font-serif text-2xl text-stone-900">Checkout</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1">
          
          {/* Order Summary Preview */}
          <div className="bg-stone-50 p-4 rounded-lg mb-8 border border-stone-100">
            <div className="flex justify-between text-sm mb-2 text-stone-600">
              <span>Items ({cartItems.length})</span>
              <span>{total.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 text-lg border-t border-stone-200 pt-2 mt-2">
              <span>Total</span>
              <span>{total.toLocaleString()} EGP</span>
            </div>
            <p className="text-xs text-stone-400 mt-2 text-center">Cash on Delivery (COD)</p>
          </div>

          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Full Name</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text" 
                placeholder="Jane Doe"
                className={`w-full border px-4 py-3 focus:outline-none transition-colors ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-stone-900'}`}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={12} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Phone Number</label>
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel" 
                placeholder="01xxxxxxxxx"
                className={`w-full border px-4 py-3 focus:outline-none transition-colors ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-stone-900'}`}
              />
              {errors.phone && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={12} />
                  <span>{errors.phone}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">City</label>
                <input 
                  readOnly
                  name="city"
                  value={formData.city}
                  type="text" 
                  className="w-full border border-stone-300 bg-stone-100 text-stone-500 px-4 py-3 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Area / District</label>
                <select 
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className={`w-full border px-4 py-3 focus:outline-none transition-colors bg-white appearance-none ${errors.area ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-stone-900'}`}
                >
                  <option value="" disabled>Select Area</option>
                  {ALEXANDRIA_AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.area && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    <span>{errors.area}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Detailed Address</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder="Street name, Building number, Apartment..."
                className={`w-full border px-4 py-3 focus:outline-none transition-colors resize-none ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-stone-900'}`}
              />
               {errors.address && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={12} />
                  <span>{errors.address}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Notes (Optional)</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={1}
                placeholder="Special delivery instructions..."
                className="w-full border border-stone-300 px-4 py-3 focus:outline-none focus:border-stone-900 transition-colors resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-stone-100 bg-white">
          <button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full bg-stone-900 text-white py-4 font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? 'Processing...' : 'Complete Order'} 
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
          <p className="text-center text-xs text-stone-400 mt-3">
            Clicking complete will open your email app to send the order details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;