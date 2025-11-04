import { colors, sizes } from "@/constants/common";

interface Category {
  id: string;
  name: string;
}

interface Color {
  name: string;
  value: string;
}

interface ShopFiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: string;
  activeFiltersCount: number;
  showFilters: boolean;
  onCategoryChange: (category: string) => void;
  onToggleSize: (size: string) => void;
  onToggleColor: (color: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onInStockChange: (checked: boolean) => void;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
}

export default function ShopFilters({
  categories,
  selectedCategory,
  selectedSizes,
  selectedColors,
  priceRange,
  inStockOnly,
  sortBy,
  activeFiltersCount,
  showFilters,
  onCategoryChange,
  onToggleSize,
  onToggleColor,
  onPriceRangeChange,
  onInStockChange,
  onSortChange,
  onResetFilters,
}: ShopFiltersProps) {
  return (
    <aside className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-24 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 font-playfair">Filters</h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
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
                  onChange={(e) => onCategoryChange(e.target.value)}
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
                onClick={() => onToggleSize(size)}
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
                onClick={() => onToggleColor(color.name)}
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
              onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
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
                  onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
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
                  onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 500])}
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
              onChange={(e) => onInStockChange(e.target.checked)}
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
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D32F2F] bg-white text-gray-700 font-medium text-sm"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
