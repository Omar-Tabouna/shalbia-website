import React from 'react';
import { X, ShoppingBag, Star, Truck, ShieldCheck, Heart } from 'lucide-react';
import { CartItem } from './CartDrawer';

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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-stone-100 transition-colors shadow-sm"
        >
          <X size={24} className="text-stone-900" />
        </button>

        {/* Image Section */}
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

        {/* Details Section */}
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

export default ProductModal;