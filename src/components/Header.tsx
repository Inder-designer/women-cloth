'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGetCartQuery } from '@/store/api/cartApi';
import { useGetWishlistQuery } from '@/store/api/wishlistApi';
import { useLogoutMutation } from '@/store/api/authApi';
import { products } from '@/data/products';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthContext();
  
  // Only fetch cart and wishlist if authenticated
  const { data: cart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [logout] = useLogoutMutation();

  const cartItemsCount = cart?.totalItems || 0;
  const wishlistItemsCount = wishlist?.products?.length || 0;

  // Handle search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleProductClick = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#D32F2F]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo with Punjabi Touch */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#D32F2F] flex items-center justify-center">
              <span className="text-2xl text-white font-bold">ਸ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#8B4513] font-playfair leading-tight">Surkh-E-Punjab</h1>
              <p className="text-[10px] text-[#D32F2F] leading-none">ਸੁਰਖ਼-ਏ-ਪੰਜਾਬ</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              Shop
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              About
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Search Toggle Button */}
            <button 
              className="text-gray-700 hover:text-[#D32F2F] transition"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              title="Search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {isAuthenticated && user ? (
              <div className="hidden sm:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#D32F2F] transition"
                  title="Account"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">{user.firstName}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D32F2F] transition"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#D32F2F] transition"
                    >
                      My Orders
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={async () => {
                        await logout();
                        setIsUserMenuOpen(false);
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="hidden sm:block text-gray-700 hover:text-[#D32F2F] transition" title="Account">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            
            <Link href="/wishlist" className="text-gray-700 hover:text-[#D32F2F] transition relative" title="Wishlist">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D32F2F] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>
            
            <Link href="/cart" className="text-gray-700 hover:text-[#D32F2F] transition relative" title="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D32F2F] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden text-gray-700 hover:text-[#D32F2F] transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Search Bar (Desktop & Mobile) */}
        {isSearchOpen && (
          <div className="pb-3 border-t border-gray-100 pt-3" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-[#D32F2F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D32F2F] focus:border-transparent text-sm"
                  autoFocus
                />
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#D32F2F]"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            {/* Search Results */}
            {searchQuery.trim().length > 1 && (
              <div className="mt-3 max-w-xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-600 font-semibold">
                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={handleProductClick}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-0.5 text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#D32F2F] text-base">${product.price}</p>
                          {product.originalPrice && (
                            <p className="text-xs text-gray-500 line-through">${product.originalPrice}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                      onClick={handleProductClick}
                      className="block p-2.5 text-center text-[#D32F2F] font-semibold hover:bg-gray-50 transition border-t-2 border-[#D32F2F]/10 text-sm"
                    >
                      View all results →
                    </Link>
                  </>
                ) : (
                  <div className="p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-3 space-y-1 border-t border-gray-200 pt-3">
            <Link href="/" className="block py-2 text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              Home
            </Link>
            <Link href="/shop" className="block py-2 text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              Shop
            </Link>
            <Link href="/categories" className="block py-2 text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              Categories
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm">
              About
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link href="/profile" className="block py-2 text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm sm:hidden">
                  Account ({user.firstName})
                </Link>
                <button 
                  onClick={async () => {
                    await logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm sm:hidden"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" className="block py-2 text-gray-700 hover:text-[#D32F2F] transition font-medium text-sm sm:hidden">
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
