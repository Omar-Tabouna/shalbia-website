import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Star, ShoppingBag, Heart, Menu, X, Search, User, 
  Instagram, Facebook, Trash2, CheckCircle, AlertCircle, Truck, ShieldCheck, 
  Bell, Clock 
} from 'lucide-react';

/**
 * 📢 MAIN APPLICATION FILE
 * This file contains all the components and logic for the Shalabia website.
 * You can safely delete the 'components' folder as it is no longer needed.
 */

// ==========================================
// 🧩 INTERFACES
// ==========================================

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export interface UserData {
  name: string;
  email: string;
}

interface Notification {
  id: number;
  type: 'signup' | 'signin' | 'order';
  message: string;
  timestamp: string;
}

// ==========================================
// 📷 DATA & CONFIGURATION
// ==========================================

const IMAGES = {
  // Brand
  logo: './logo.png',
  
  // Banners
  hero: './hero.jpg',
  collection: './collection.jpg',

  // Products
  product1: './product1.jpg',
  product2: './product2.jpg',
  product3: './product3.jpg',
};

// Fallback images (Unsplash) in case local files aren't found
const FALLBACKS = {
  hero: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
  collection: "https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=2570&auto=format&fit=crop",
  product: "https://placehold.co/600x800?text=Product+Image"
};

const PRODUCT_DATA: CartItem[] = [
  { id: 1, title: "Linen Blend Dress", price: 2500, category: "Dresses", image: IMAGES.product1, inStock: true },
  { id: 2, title: "Silk Evening Scarf", price: 2500, category: "Accessories", image: IMAGES.product2, inStock: true },
  { id: 3, title: "Classic Trench Coat", price: 2500, category: "Outerwear", image: IMAGES.product3, inStock: true },
];

const ALEXANDRIA_AREAS = [
  "Agami", "Asafra", "Azarita", "Bahary", "Borg El Arab", "Camp Caesar", 
  "Dekheila", "Gleem", "Ibrahemya", "Kafr Abdo", "King Mariout", "Laurent", 
  "Maamoura", "Mahatet El Raml", "Mandara", "Mansheya", "Miami", "Moharam Bek", 
  "Montaza", "Roushdy", "San Stefano", "Schutz", "Shatby", "Sidi Beshr", 
  "Sidi Gaber", "Smouha", "Sporting", "Stanley", "Victoria", "Zizinia"
];

// ==========================================
// 🧩 SUB-COMPONENTS
// ==========================================

// --- Navbar Component ---
interface NavbarProps {
  onSearchClick: () => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onUserClick: () => void;
  cartCount: number;
  wishlistCount: number;
  logo: string;
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onSearchClick, 
  onCartClick, 
  onWishlistClick, 
  onUserClick, 
  cartCount, 
  wishlistCount, 
  logo,
  isLoggedIn
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="bg-stone-900 text-stone-100 text-xs text-center py-2 tracking-wide uppercase font-medium">
        Free Shipping on Orders Over 5,000 EGP
      </div>

      <nav 
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <button 
              className="md:hidden text-stone-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex-1 md:flex-none flex justify-center md:justify-start">
              <a href="#" className="block">
                {!logoError && logo ? (
                  <img 
                    src={logo} 
                    alt="Shalabia" 
                    className="h-12 w-auto object-contain" 
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="font-serif text-3xl font-bold tracking-wide text-stone-900">SHALABIA</span>
                )}
              </a>
            </div>

            <div className="hidden md:flex flex-1 justify-center gap-10">
              <NavLink href="#">New Arrivals</NavLink>
              <NavLink href="#">Dresses</NavLink>
              <NavLink href="#">Tops</NavLink>
              <NavLink href="#">Bottoms</NavLink>
              <NavLink href="#">Accessories</NavLink>
            </div>

            <div className="flex items-center gap-4 md:gap-6 text-stone-800">
              <button 
                className="hover:text-stone-500 transition-colors"
                onClick={onSearchClick}
              >
                <Search size={20} />
              </button>
              
              <button 
                className={`transition-colors ${isLoggedIn ? 'text-stone-900' : 'hover:text-stone-500'}`}
                onClick={onUserClick}
                title={isLoggedIn ? "Account" : "Sign In"}
              >
                <User size={20} fill={isLoggedIn ? "currentColor" : "none"} />
              </button>

              <button 
                className="relative hover:text-stone-500 transition-colors"
                onClick={onWishlistClick}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                className="relative hover:text-stone-500 transition-colors"
                onClick={onCartClick}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-stone-100 p-6 flex flex-col gap-6 md:hidden animate-fade-in shadow-xl">
            <a href="#" className="text-lg font-serif italic text-stone-900">New Arrivals</a>
            <a href="#" className="text-lg font-serif italic text-stone-900">Dresses</a>
            <a href="#" className="text-lg font-serif italic text-stone-900">Tops</a>
            <a href="#" className="text-lg font-serif italic text-stone-900">Bottoms</a>
            <a href="#" className="text-lg font-serif italic text-stone-900">Accessories</a>
            <div className="h-px bg-stone-200 w-full" />
            <div className="flex gap-4 text-sm font-medium text-stone-600">
              <button onClick={() => { setMobileMenuOpen(false); onUserClick(); }}>
                  {isLoggedIn ? 'Account' : 'Sign In'}
              </button>
              <button onClick={() => { setMobileMenuOpen(false); onSearchClick(); }}>Search</button>
              <button onClick={() => { setMobileMenuOpen(false); onWishlistClick(); }}>Wishlist ({wishlistCount})</button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a 
    href={href} 
    className="text-sm uppercase tracking-wider font-medium text-stone-600 hover:text-stone-900 transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-900 transition-all duration-300 group-hover:w-full" />
  </a>
);

// --- Footer Component ---
interface FooterProps {
  logo: string;
}

const Footer: React.FC<FooterProps> = ({ logo }) => {
  return (
    <footer className="bg-white border-t border-stone-100 pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        <div className="col-span-1 md:col-span-1">
          <a href="#" className="block mb-8">
            {logo ? (
              <img 
                src={logo} 
                alt="Shalabia" 
                className="h-8 w-auto object-contain" 
              />
            ) : (
              <span className="font-serif text-3xl font-bold tracking-wide text-stone-900">SHALABIA</span>
            )}
          </a>
          
          <div className="flex gap-4">
            <SocialIcon 
              href="https://www.instagram.com/sha_labia/"
              icon={<Instagram size={18} />} 
            />
            <SocialIcon 
              href="https://www.facebook.com/shalabiaaaa?mibextid=wwXIfr&utm_source=ig&utm_medium=social&utm_content=link_in_bio"
              icon={<Facebook size={18} />} 
            />
            <SocialIcon 
              href="https://www.tiktok.com/@sha_labia?_t=ZS-90dSuheqgj4&_r=1&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn5hKsnxqZLSrIBnge_369b8HgNfZM6Zj3eWE3S-_7UNVsD5v2k4pgiZ1H44c_aem_YieR4SktIrmlEj0IDQDcQw"
              icon={<TikTokIcon />} 
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium text-stone-900 mb-6 uppercase tracking-widest text-xs">Shop</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><a href="#" className="hover:text-stone-900 transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Dresses</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Tops & Shirts</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Bottoms</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Accessories</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-stone-900 mb-6 uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><a href="#" className="hover:text-stone-900 transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Sustainability</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-stone-900 mb-6 uppercase tracking-widest text-xs">Support</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><a href="#" className="hover:text-stone-900 transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-stone-900 transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-stone-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-400">
        <p>© {new Date().getFullYear()} Shalabia. All rights reserved.</p>
        <p>Designed with care.</p>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode; href: string }> = ({ icon, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all">
    {icon}
  </a>
);

const TikTokIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-[18px] h-[18px]"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// --- CartDrawer Component ---
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-stone-100">
            <h2 className="font-serif text-2xl text-stone-900">Your Cart ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X size={24} className="text-stone-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                <p className="text-stone-500 text-lg">Your cart is empty</p>
                <button onClick={onClose} className="text-stone-900 font-medium underline underline-offset-4">
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 animate-fade-in">
                  <div className="w-20 h-24 bg-stone-100 shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-stone-900 font-medium">{item.title}</h3>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                    <p className="text-stone-900 font-medium">{item.price.toLocaleString()} EGP</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-stone-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-serif text-xl font-bold text-stone-900">{total.toLocaleString()} EGP</span>
              </div>
              <p className="text-xs text-stone-400 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
              <button 
                onClick={onCheckout}
                className="w-full bg-stone-900 text-white py-4 font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// --- SearchModal Component ---
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: CartItem[];
  onAddToCart: (item: CartItem) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, products, onAddToCart }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CartItem[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query, products]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[80] animate-fade-in flex flex-col">
      <div className="flex items-center justify-between p-6 md:p-8 border-b border-stone-100">
        <div className="text-sm font-medium uppercase tracking-widest text-stone-500">Search Store</div>
        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <X size={28} className="text-stone-900" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 py-12">
        <div className="relative border-b-2 border-stone-200 focus-within:border-stone-900 transition-colors">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400" size={32} />
          <input 
            type="text" 
            placeholder="Search for dresses, kids, accessories..." 
            className="w-full pl-12 pr-4 py-4 text-3xl md:text-5xl font-serif text-stone-900 placeholder-stone-300 focus:outline-none bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mt-12 overflow-y-auto max-h-[60vh] no-scrollbar">
          {query && results.length === 0 ? (
             <div className="text-center text-stone-500 py-10">
               <p>No results found for "{query}"</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {results.map(item => (
                <div key={item.id} className="group flex gap-4 items-center p-4 hover:bg-stone-50 transition-colors rounded-lg cursor-pointer">
                  <div className="w-20 h-24 bg-stone-200 overflow-hidden shrink-0 relative">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className={`w-full h-full object-cover ${!item.inStock ? 'grayscale opacity-70' : ''}`} 
                    />
                    {!item.inStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <span className="text-[10px] bg-stone-900 text-white px-1 font-bold uppercase">Sold Out</span>
                        </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{item.category}</div>
                    <h3 className="font-serif text-lg text-stone-900">{item.title}</h3>
                    <div className="text-stone-600 mt-1">{item.price.toLocaleString()} EGP</div>
                    {item.inStock ? (
                        <button 
                        onClick={() => {
                            onAddToCart(item);
                            onClose();
                        }}
                        className="mt-2 text-xs font-bold uppercase tracking-widest border-b border-stone-900 pb-0.5 hover:text-stone-600 hover:border-stone-600 transition-colors"
                        >
                        Add to Cart
                        </button>
                    ) : (
                        <span className="mt-2 inline-block text-xs font-bold uppercase tracking-widest text-stone-400">
                            Out of Stock
                        </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!query && (
            <div className="text-center">
              <h3 className="text-sm font-medium uppercase tracking-widest text-stone-400 mb-6">Popular Searches</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Summer Dresses', 'Kids Wear', 'New Arrivals', 'Accessories'].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-6 py-2 border border-stone-200 rounded-full text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- CheckoutModal Component ---
interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

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
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', phone: '', area: '', address: '' };

    if (formData.name.trim().length < 3) {
      newErrors.name = "Please enter a valid full name (min 3 chars).";
      isValid = false;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    const phoneRegex = /^01[0-2,5][0-9]{8}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 11-digit phone number (e.g., 01xxxxxxxxx).";
      isValid = false;
    }

    if (!formData.area) {
      newErrors.area = "Please select your area.";
      isValid = false;
    }

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

    try {
        const stored = localStorage.getItem('shalabia_notifications');
        const notifications = stored ? JSON.parse(stored) : [];
        
        notifications.push({
            id: Date.now(),
            type: 'order',
            message: `New Order: ${formData.name} - ${cartItems.length} items (${total.toLocaleString()} EGP)`,
            timestamp: new Date().toLocaleString()
        });

        if (notifications.length > 50) notifications.shift();
        
        localStorage.setItem('shalabia_notifications', JSON.stringify(notifications));

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

    const csvHeader = "ItemID,Product Name,Category,Price\n";
    const csvRows = cartItems.map(item => 
      `${item.id},"${item.title}",${item.category},${item.price}`
    ).join("\n");
    
    const excelData = csvHeader + csvRows + `\n\nTOTAL,,,${total}`;

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

    const mailtoLink = `mailto:shalabia.orders@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <h2 className="font-serif text-2xl text-stone-900">Checkout</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
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

// --- ProductModal Component ---
interface ProductModalProps {
  product: CartItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
  isInWishlist: boolean;
  onToggleWishlist: (e: React.MouseEvent) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  isInWishlist,
  onToggleWishlist
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-slide-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-stone-100 transition-colors shadow-sm"
        >
          <X size={24} className="text-stone-900" />
        </button>

        <div className="w-full md:w-1/2 bg-stone-100 h-64 md:h-auto relative group">
           <img 
            src={product.image} 
            alt={product.title}
            className={`w-full h-full object-cover ${!product.inStock ? 'grayscale-[0.5]' : ''}`}
          />
          {!product.inStock && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-stone-900 text-white px-4 py-2 text-sm uppercase tracking-widest font-bold shadow-xl">
                    Out of Stock
                </span>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
            <div className="mb-auto">
                <span className="text-xs font-bold tracking-widest uppercase text-stone-500 mb-2 block">{product.category}</span>
                <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">{product.title}</h2>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl text-stone-900 font-medium">{product.price.toLocaleString()} EGP</span>
                    {product.inStock ? (
                        <span className="text-green-600 text-xs font-bold uppercase tracking-wide px-2 py-1 bg-green-50 rounded-full">In Stock</span>
                    ) : (
                        <span className="text-red-500 text-xs font-bold uppercase tracking-wide px-2 py-1 bg-red-50 rounded-full">Out of Stock</span>
                    )}
                </div>
                
                <div className="flex items-center gap-1 mb-8">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-stone-900 text-stone-900" />)}
                    <span className="text-xs text-stone-500 ml-2">(4.9/5 based on 24 reviews)</span>
                </div>

                <p className="text-stone-600 leading-relaxed mb-8">
                    Experience the perfect blend of comfort and elegance. This piece from our {product.category} collection is crafted with attention to detail, designed to empower your everyday style with breathable fabrics and a timeless silhouette.
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                        <Truck size={18} />
                        <span>Free shipping on orders over 5,000 EGP</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                        <ShieldCheck size={18} />
                        <span>Authentic Shalabia Design</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
              <button 
                  onClick={() => {
                      if (product.inStock) {
                        onAddToCart(product);
                        onClose();
                      }
                  }}
                  disabled={!product.inStock}
                  className={`flex-1 py-4 px-6 font-medium uppercase tracking-widest transition-colors flex items-center justify-center gap-3 ${
                      product.inStock 
                      ? 'bg-stone-900 text-white hover:bg-stone-800' 
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
              >
                  {product.inStock ? (
                      <>
                        <ShoppingBag size={20} />
                        Add to Cart
                      </>
                  ) : (
                      'Out of Stock'
                  )}
              </button>

              <button 
                onClick={onToggleWishlist}
                className={`px-5 border border-stone-200 flex items-center justify-center transition-colors ${
                  isInWishlist 
                    ? 'text-red-500 bg-red-50 border-red-100' 
                    : 'text-stone-400 hover:text-red-500 hover:border-red-200'
                }`}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- WishlistDrawer Component ---
interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onAddToCart: (item: CartItem) => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onAddToCart }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-stone-100">
            <h2 className="font-serif text-2xl text-stone-900">Your Wishlist ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X size={24} className="text-stone-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
                <p className="text-stone-500 text-lg">Your wishlist is empty</p>
                <button onClick={onClose} className="text-stone-900 font-medium underline underline-offset-4">
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 animate-fade-in">
                  <div className="w-20 h-24 bg-stone-100 shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-stone-900 font-medium">{item.title}</h3>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{item.category}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-stone-900 font-medium">{item.price.toLocaleString()} EGP</p>
                        <button 
                            onClick={() => {
                                onAddToCart(item);
                                onRemoveItem(item.id);
                            }}
                            className="flex items-center gap-1 text-xs uppercase font-bold tracking-wider text-stone-900 hover:text-stone-600 transition-colors border-b border-stone-900 pb-0.5"
                        >
                            <ShoppingBag size={14} /> Add to Cart
                        </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// --- AuthModal Component ---
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserData) => void;
  onLogout: () => void;
  currentUser: UserData | null;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onLogout, currentUser }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isOpen && currentUser?.email === 'admin@shalabia.com') {
      try {
        const stored = localStorage.getItem('shalabia_notifications');
        if (stored) {
          setNotifications(JSON.parse(stored).reverse());
        }
      } catch (e) {
        console.error("Failed to load notifications");
      }
    }
  }, [isOpen, currentUser]);

  const logNotification = (type: 'signup' | 'signin', name: string, email: string) => {
    if (email === 'admin@shalabia.com') return;

    try {
      const stored = localStorage.getItem('shalabia_notifications');
      const currentNotifications: Notification[] = stored ? JSON.parse(stored) : [];
      
      const newNotification: Notification = {
        id: Date.now(),
        type,
        message: type === 'signup' 
          ? `New Member: ${name} (${email}) joined the sisterhood.` 
          : `User Login: ${name} (${email}) signed in.`,
        timestamp: new Date().toLocaleString()
      };

      const updated = [...currentNotifications, newNotification];
      if (updated.length > 50) updated.shift();
      
      localStorage.setItem('shalabia_notifications', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to log notification", e);
    }
  };

  const clearNotifications = () => {
    localStorage.removeItem('shalabia_notifications');
    setNotifications([]);
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
        case 'signup': return 'bg-green-500';
        case 'order': return 'bg-orange-500';
        default: return 'bg-blue-500';
    }
  };

  if (!isOpen) return null;

  if (currentUser) {
    const isAdmin = currentUser.email === 'admin@shalabia.com';

    return (
       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
        <div className={`bg-white w-full ${isAdmin ? 'max-w-2xl' : 'max-w-md'} shadow-2xl relative p-8 text-center animate-slide-up max-h-[90vh] overflow-y-auto`}>
            <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900">
                <X size={24} />
            </button>
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={40} className="text-stone-400" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900 mb-2">Welcome Back, {currentUser.name}</h2>
            <p className="text-stone-500 mb-8">{currentUser.email}</p>
            
            <button 
                onClick={() => { onLogout(); onClose(); }}
                className="w-full border border-stone-200 text-stone-900 py-3 font-medium uppercase tracking-widest hover:bg-stone-50 transition-colors mb-6"
            >
                Sign Out
            </button>

            {isAdmin && (
                <div className="border-t border-stone-100 pt-6 text-left">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-stone-900 font-serif text-xl">
                            <Bell size={20} />
                            <h3>Recent Activity</h3>
                        </div>
                        {notifications.length > 0 && (
                            <button 
                                onClick={clearNotifications}
                                className="text-xs text-red-500 hover:text-red-700 underline"
                            >
                                Clear History
                            </button>
                        )}
                    </div>

                    <div className="bg-stone-50 rounded-lg border border-stone-100 max-h-60 overflow-y-auto p-4">
                        {notifications.length === 0 ? (
                            <div className="text-center text-stone-400 py-4 text-sm">
                                No recent activity recorded.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="bg-white p-3 rounded shadow-sm border border-stone-100 flex gap-3 items-start">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${getNotificationColor(notif.type)}`} />
                                        <div className="flex-1">
                                            <p className="text-sm text-stone-800 font-medium">{notif.message}</p>
                                            <div className="flex items-center gap-1 text-xs text-stone-400 mt-1">
                                                <Clock size={10} />
                                                <span>{notif.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-stone-400 mt-2 text-center">
                        * Real-time notifications for orders, logins, and signups.
                    </p>
                </div>
            )}
        </div>
       </div>
    );
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getStoredUsers = () => {
    try {
        const users = localStorage.getItem('shalabia_users');
        return users ? JSON.parse(users) : [];
    } catch (e) {
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
    }

    if (!validateEmail(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }

    if (mode === 'signup') {
        if (!formData.name) {
            setError('Please enter your full name.');
            return;
        }
        if (formData.name.trim().length < 3) {
            setError('Name must be at least 3 characters long.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
    }

    const storedUsers = getStoredUsers();

    if (mode === 'signup') {
        const existingUser = storedUsers.find((u: any) => u.email === formData.email);
        
        if (existingUser) {
            setError('An account with this email already exists.');
            return;
        }

        const newUser = {
            name: formData.name,
            email: formData.email,
            password: formData.password 
        };

        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('shalabia_users', JSON.stringify(updatedUsers));

        logNotification('signup', newUser.name, newUser.email);

        onLogin({ name: newUser.name, email: newUser.email });
        onClose();

    } else {
        const user = storedUsers.find((u: any) => u.email === formData.email);

        if (!user) {
            setError('No account found with this email. Please sign up first.');
            return;
        }

        if (user.password !== formData.password) {
            setError('Incorrect password. Please try again.');
            return;
        }

        logNotification('signin', user.name, user.email);

        onLogin({ name: user.name, email: user.email });
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md shadow-2xl relative flex flex-col max-h-[90vh] animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-stone-400 hover:text-stone-900">
            <X size={24} />
        </button>

        <div className="p-8 text-center border-b border-stone-100">
            <h2 className="font-serif text-3xl text-stone-900 mb-2">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-stone-500 text-sm">
                {mode === 'signin' ? 'Welcome back to Shalabia.' : 'Join the sisterhood today.'}
            </p>
        </div>

        <div className="p-8 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <div>
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            className="w-full border border-stone-200 p-3 focus:outline-none focus:border-stone-900 transition-colors"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                )}
                <div>
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        className="w-full border border-stone-200 p-3 focus:outline-none focus:border-stone-900 transition-colors"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password"
                        className="w-full border border-stone-200 p-3 focus:outline-none focus:border-stone-900 transition-colors"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-xs p-3 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    className="w-full bg-stone-900 text-white py-4 font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                </button>
            </form>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => {
                        setMode(mode === 'signin' ? 'signup' : 'signin');
                        setError('');
                        setFormData({ name: '', email: '', password: '' });
                    }}
                    className="text-stone-500 text-sm underline underline-offset-4 hover:text-stone-900"
                >
                    {mode === 'signin' ? "Don't have an account? Join us." : "Already have an account? Sign In."}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- ProductCard Component ---
interface ProductCardProps {
  item: CartItem;
  onAdd: () => void;
  onClick: () => void;
  isInWishlist: boolean;
  onToggleWishlist: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAdd, onClick, isInWishlist, onToggleWishlist }) => (
  <div className={`group cursor-pointer ${!item.inStock ? 'opacity-80' : ''}`} onClick={onClick}>
    <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
      <img 
        src={item.image} 
        alt={item.title} 
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!item.inStock ? 'grayscale-[0.5]' : ''}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          // Fallback to placeholder if local file is missing
          if (target.src !== FALLBACKS.product) {
             target.src = FALLBACKS.product;
          }
        }}
      />
      
      {/* Out of Stock Overlay */}
      {!item.inStock && (
        <div className="absolute inset-0 bg-white/30 flex items-center justify-center z-10">
            <div className="bg-stone-900 text-white px-3 py-1 text-xs uppercase tracking-widest font-bold shadow-lg">
                Out of Stock
            </div>
        </div>
      )}
      
      {/* Wishlist Button */}
      <button 
        onClick={onToggleWishlist}
        className={`absolute top-3 right-3 p-2 rounded-full shadow-md z-20 transition-all duration-300 ${
          isInWishlist ? 'bg-white text-red-500' : 'bg-white/70 text-stone-400 hover:bg-white hover:text-red-500'
        }`}
        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
      </button>

      {/* Quick Add Button - Only show if in stock */}
      {item.inStock && (
        <button 
            onClick={(e) => {
            e.stopPropagation();
            onAdd();
            }}
            className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-stone-900 hover:text-white"
            title="Quick Add"
        >
            <ShoppingBag size={18} />
        </button>
      )}
    </div>
    <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{item.category}</div>
    <h3 className="text-lg font-serif text-stone-900">{item.title}</h3>
    <div className="text-stone-600 mt-1">{item.price.toLocaleString()} EGP</div>
  </div>
);

// ==========================================
// 🚀 MAIN APP COMPONENT
// ==========================================

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CartItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setLoaded(true);
    
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('shalabia_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }

    // Load user from localStorage
    const savedUser = localStorage.getItem('shalabia_user');
    if (savedUser) {
        try {
            setUser(JSON.parse(savedUser));
        } catch (e) {
            console.error("Failed to parse user", e);
        }
    }
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('shalabia_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shalabia_user');
  };

  const addToCart = (item: CartItem) => {
    if (!item.inStock) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }
    setCartItems(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    const index = cartItems.findIndex(item => item.id === id);
    if (index > -1) {
      const newItems = [...cartItems];
      newItems.splice(index, 1);
      setCartItems(newItems);
    }
  };

  const toggleWishlist = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      localStorage.setItem('shalabia_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => {
      const newWishlist = prev.filter(id => id !== productId);
      localStorage.setItem('shalabia_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]); // Clear cart
    setIsCheckoutOpen(false);
  };

  // Get full product details for wishlist items
  const wishlistItems = PRODUCT_DATA.filter(p => wishlist.includes(p.id));

  // Filter Logic
  const categories = ["All", ...Array.from(new Set(PRODUCT_DATA.map(p => p.category)))];
  
  const filteredProducts = activeFilter === "All" 
    ? PRODUCT_DATA 
    : PRODUCT_DATA.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-300 selection:text-stone-900 overflow-x-hidden flex flex-col">
      <Navbar 
        onSearchClick={() => setIsSearchOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onUserClick={() => setIsAuthOpen(true)}
        cartCount={cartItems.length}
        wishlistCount={wishlist.length}
        logo={IMAGES.logo}
        isLoggedIn={!!user}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemoveItem={removeFromCart} 
        onCheckout={handleCheckoutClick}
      />

      <WishlistDrawer 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
        items={wishlistItems} 
        onRemoveItem={removeFromWishlist} 
        onAddToCart={addToCart}
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        products={PRODUCT_DATA}
        onAddToCart={addToCart}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentUser={user}
      />

      <ProductModal 
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        onAddToCart={addToCart}
        isInWishlist={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={(e) => selectedProduct && toggleWishlist(e, selectedProduct.id)}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] overflow-hidden bg-stone-200">
          <div className="absolute inset-0">
            <img 
              src={IMAGES.hero} 
              alt="Woman Fashion" 
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== FALLBACKS.hero) {
                  target.src = FALLBACKS.hero;
                }
              }}
            />
            {/* Lighter overlay to support black text */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
          </div>
          
          <div className={`relative z-10 h-full flex flex-col justify-center items-center text-center px-6 pb-24 transition-all duration-1000 transform ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-arabic text-6xl md:text-8xl lg:text-9xl text-stone-900 mb-12 font-bold tracking-wide leading-tight drop-shadow-sm max-w-5xl">
              شلبية للحلم بقية
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-stone-900 text-white px-12 py-4 font-medium text-sm uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-lg">
                Shop Collection
              </button>
            </div>
          </div>
        </section>

        {/* Brand Promise */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-6">Designed with love, crafted for you.</h2>
            <p className="text-stone-500 text-lg leading-relaxed">
              At Shalabia, we believe that style shouldn't compromise comfort. Our collections blend timeless silhouettes with breathable, sustainable fabrics that move with you, empowering your everyday elegance.
            </p>
          </div>
        </section>

        {/* Featured Collection Banner */}
        <section className="relative h-[600px] w-full overflow-hidden group cursor-pointer bg-stone-300">
            <img 
              src={IMAGES.collection} 
              alt="Women's Collection" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== FALLBACKS.collection) {
                  target.src = FALLBACKS.collection;
                }
              }}
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-12 left-6 md:left-12 text-white max-w-lg">
              <span className="text-sm uppercase tracking-widest mb-2 block font-medium">Season Essentials</span>
              <h3 className="text-4xl md:text-6xl font-serif mb-6">Summer Elegance</h3>
              <button className="flex items-center gap-3 text-sm uppercase tracking-widest bg-white text-stone-900 px-8 py-4 hover:bg-stone-100 transition-colors">
                View Collection <ArrowRight size={16} />
              </button>
            </div>
        </section>

        {/* New Arrivals */}
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-stone-500 uppercase tracking-widest text-xs font-semibold">Just Dropped</span>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mt-2">New Arrivals</h2>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors border-b border-stone-300 pb-1">
              Shop All <ArrowRight size={16} />
            </a>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 text-xs uppercase tracking-widest font-medium border rounded-full transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-900 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-stone-50 rounded-lg">
              <p className="text-stone-500">No products found in this category.</p>
              <button 
                onClick={() => setActiveFilter("All")}
                className="mt-4 text-stone-900 underline font-medium"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 animate-fade-in">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  item={product}
                  onAdd={() => addToCart(product)}
                  onClick={() => setSelectedProduct(product)}
                  isInWishlist={wishlist.includes(product.id)}
                  onToggleWishlist={(e) => toggleWishlist(e, product.id)}
                />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <button className="btn-primary">View All Products</button>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-stone-900 text-stone-50 py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Star className="mx-auto mb-6 text-stone-400" size={24} />
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Join the Sisterhood</h2>
            <p className="text-stone-400 mb-8">Sign up for exclusive early access to new collections, styling tips, and 10% off your first order.</p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-stone-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button type="submit" className="bg-white text-stone-900 px-8 py-4 font-medium uppercase tracking-widest hover:bg-stone-200 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer logo={IMAGES.logo} />
    </div>
  );
};

export default App;