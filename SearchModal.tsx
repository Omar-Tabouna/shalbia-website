import React, { useState, useEffect } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { CartItem } from './CartDrawer';

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

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[80] animate-fade-in flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-8 border-b border-stone-100">
        <div className="text-sm font-medium uppercase tracking-widest text-stone-500">Search Store</div>
        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <X size={28} className="text-stone-900" />
        </button>
      </div>

      {/* Search Input */}
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

        {/* Results */}
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

export default SearchModal;