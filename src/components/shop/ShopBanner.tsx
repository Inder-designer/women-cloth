interface ShopBannerProps {
  searchQuery: string;
  selectedCategory: string;
  categoryName?: string;
  showFilters: boolean;
  activeFiltersCount: number;
  onToggleFilters: () => void;
}

export default function ShopBanner({
  searchQuery,
  selectedCategory,
  categoryName,
  showFilters,
  activeFiltersCount,
  onToggleFilters,
}: ShopBannerProps) {
  return (
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
              <>{categoryName || 'Shop All'}</>
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
        <div className="absolute bottom-4 right-4 lg:hidden">
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-4 py-2 bg-[#D32F2F] text-white rounded-md font-semibold text-sm shadow-lg hover:bg-[#B71C1C] transition"
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
  );
}
