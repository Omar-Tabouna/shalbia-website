import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, ShoppingBag, Heart } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer, { CartItem } from './CartDrawer';
import SearchModal from './SearchModal';
import CheckoutModal from './CheckoutModal';
import ProductModal from './ProductModal';
import WishlistDrawer from './WishlistDrawer';
import AuthModal, { UserData } from './AuthModal';

// ==========================================
// 📷 PHOTO CONFIGURATION
// ==========================================
// Instructions for adding your own photos:
// 1. Rename your image files to match the names below (e.g., 'hero.jpg', 'product1.jpg').
// 2. Drag and drop them into your project's main folder (same folder as index.html).
// 3. The website will automatically use your local photos.
//    If a local photo is missing, it will fallback to the online example image.

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

const LandingPage: React.FC = () => {
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
    <div className="relative min-h-screen flex flex-col bg-stone-50">
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

export default LandingPage;