import React from 'react';
import { Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  logo: string;
}

const Footer: React.FC<FooterProps> = ({ logo }) => {
  return (
    <footer className="bg-white border-t border-stone-100 pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        <div className="col-span-1 md:col-span-1">
          {/* Logo / Name Area - Placed above social icons */}
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
          
          {/* Social Icons */}
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

export default Footer;