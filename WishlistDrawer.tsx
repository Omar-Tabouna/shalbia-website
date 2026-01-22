import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from './CartDrawer';

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
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-100">
            <h2 className="font-serif text-2xl text-stone-900">Your Wishlist ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
              <X size={24} className="text-stone-500" />
            </button>
          </div>

          {/* Items */}
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

export default WishlistDrawer;