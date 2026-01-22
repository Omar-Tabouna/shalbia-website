import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Heart } from 'lucide-react';

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
      {/* Announcement Bar */}
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
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-stone-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo - Centered on Mobile, Left on Desktop */}
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center gap-10">
              <NavLink href="#">New Arrivals</NavLink>
              <NavLink href="#">Dresses</NavLink>
              <NavLink href="#">Tops</NavLink>
              <NavLink href="#">Bottoms</NavLink>
              <NavLink href="#">Accessories</NavLink>
            </div>

            {/* Icons */}
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

        {/* Mobile Menu Overlay */}
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

export default Navbar;