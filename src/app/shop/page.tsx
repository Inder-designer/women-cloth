'use client';

import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(true);

  // Update category from URL on mount
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const categories = [
    { id: "all", name: "All Products" },
    { id: "dresses", name: "Dresses" },
    { id: "tops", name: "Tops & Blouses" },
    { id: "bottoms", name: "Bottoms" },
    { id: "outerwear", name: "Outerwear" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#D32F2F" },
    { name: "Blue", value: "#1e40af" },
    { name: "Pink", value: "#ec4899" },
    { name: "Green", value: "#16a34a" },
    { name: "Beige", value: "#d4a574" },
    { name: "Gray", value: "#6b7280" },
  ];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("featured");
    setPriceRange([0, 500]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 500) count++;
    if (selectedSizes.length > 0) count++;
    if (selectedColors.length > 0) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, priceRange, selectedSizes, selectedColors, inStockOnly]);

  const filteredProducts = products
    .filter(product => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      // Category filter
      if (selectedCategory === "all") return true;
      return product.category === selectedCategory;
    })
    .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
    .filter(product => {
      if (selectedSizes.length === 0) return true;
      return selectedSizes.some(size => product.sizes?.includes(size));
    })
    .filter(product => {
      if (selectedColors.length === 0) return true;
      return selectedColors.some(color => product.colors?.includes(color));
    })
    .filter(product => {
      if (!inStockOnly) return true;
      return product.inStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return parseInt(b.id) - parseInt(a.id);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <section className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
            alt="Shop Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-12 bg-[#D32F2F]"></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-200">
                Premium Collection
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 font-playfair">
              {searchQuery ? (
                <>Discover Your Style</>
              ) : selectedCategory !== 'all' ? (
                <>{categories.find(c => c.id === selectedCategory)?.name || 'Shop All'}</>
              ) : (
                <>Shop All Collections</>
              )}
            </h1>
            <p className="text-base text-gray-200 mb-6 leading-relaxed">
              {searchQuery ? (
                <>
                  Search results for <span className="font-semibold text-white">"{searchQuery}"</span>
                </>
              ) : (
                <>Explore our curated selection of premium Surkh-E-Punjab. From elegant dresses to everyday essentials.</>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold">Premium Quality</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <span className="text-xs font-semibold">Free Shipping $100+</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs font-semibold">30-Day Returns</span>
              </div>
            </div>
          </div>
          {/* Mobile Filter Button - Positioned in Banner */}
          <div className="absolute bottom-4 right-4 md:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-[#D32F2F] text-white rounded-md font-semibold text-sm shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showFilters ? 'Hide' : 'Show'} Filters
              {activeFiltersCount > 0 && (
                <span className="bg-white text-[#D32F2F] px-1.5 py-0.5 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 font-playfair">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-[#D32F2F] hover:underline font-semibold"
                  >
                    Clear All ({activeFiltersCount})
                  </button>
                )}
              </div>
              
              {/* Category Filter */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-3.5 h-3.5 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 group-hover:text-[#D32F2F] transition font-medium">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Size
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-2 py-1.5 border rounded-md text-xs font-semibold transition ${
                        selectedSizes.includes(size)
                          ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#D32F2F] hover:text-[#D32F2F]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Color
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`group relative w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColors.includes(color.name)
                          ? 'border-[#D32F2F] scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {selectedColors.includes(color.name) && (
                        <svg 
                          className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price Range
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D32F2F]"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Min</label>
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                      />
                    </div>
                    <span className="text-gray-400 mt-5 text-xs">-</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Max</label>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500])}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-[#D32F2F]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Filter */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Availability
                </h3>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#D32F2F] focus:ring-[#D32F2F] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-[#D32F2F] transition font-medium">
                    In Stock Only
                  </span>
                </label>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-700 font-medium text-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-md p-3 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products found
                </p>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#D32F2F] text-white text-xs font-semibold rounded-full">
                    {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 hidden sm:block">View:</span>
                <div className="flex items-center gap-0.5 border border-gray-300 rounded-md p-0.5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition ${
                      viewMode === 'grid' 
                        ? 'bg-[#D32F2F] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition ${
                      viewMode === 'list' 
                        ? 'bg-[#D32F2F] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    title="List View"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                  : "space-y-3"
              }>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="max-w-md mx-auto">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-playfair">No products found</h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    We couldn't find any products matching your criteria. Try adjusting your filters to see more results.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] transition font-semibold shadow-md hover:shadow-lg text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
