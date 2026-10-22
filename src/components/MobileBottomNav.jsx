import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';

export default function MobileBottomNav() {
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const { authUser } = useAuth();
  const { locale } = useLocale();

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.07)] px-2 py-1.5 transition-colors duration-200"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Beranda */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-400 font-semibold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <Home size={19} strokeWidth={2.2} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            {locale === 'id' ? 'Beranda' : 'Home'}
          </span>
        </NavLink>

        {/* Katalog */}
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-400 font-semibold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <Compass size={19} strokeWidth={2.2} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            {locale === 'id' ? 'Katalog' : 'Catalog'}
          </span>
        </NavLink>

        {/* Wishlist */}
        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-400 font-semibold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <div className="relative">
            <Heart size={19} strokeWidth={2.2} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Wishlist</span>
        </NavLink>

        {/* Keranjang */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-400 font-semibold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag size={19} strokeWidth={2.2} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            {locale === 'id' ? 'Keranjang' : 'Cart'}
          </span>
        </NavLink>

        {/* Akun -> /profile jika logged in */}
        <NavLink
          to={authUser ? "/profile" : "/login"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-400 font-semibold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`
          }
        >
          <User size={19} strokeWidth={2.2} />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">
            {authUser ? (locale === 'id' ? 'Profil' : 'Profile') : (locale === 'id' ? 'Masuk' : 'Login')}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
