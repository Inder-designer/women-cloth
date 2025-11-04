import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ShopProductsGridProps {
  products: Product[];
  pagination?: Pagination;
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  error: any;
  currentPage: number;
  activeFiltersCount: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function ShopProductsGrid({
  products,
  pagination,
  viewMode,
  isLoading,
  error,
  currentPage,
  activeFiltersCount,
  onPageChange,
  onResetFilters,
  onViewModeChange,
}: ShopProductsGridProps) {
  return (
    <main className="flex-1">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-md p-3 mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <p className="text-gray-600 text-sm">
            {isLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">{pagination?.total || 0}</span> products found
              </>
            )}
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
              onClick={() => onViewModeChange('grid')}
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
              onClick={() => onViewModeChange('list')}
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

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-24 h-24 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-playfair">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6 text-sm">
              We're having trouble loading the products. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#D32F2F] text-white rounded-md hover:bg-[#B71C1C] transition font-semibold shadow-md hover:shadow-lg text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Products */}
      {!isLoading && !error && products.length > 0 && (
        <>
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
              : "space-y-3"
          }>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {[...Array(pagination.pages)].map((_, i) => {
                  const page = i + 1;
                  // Show first, last, current, and pages around current
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                          page === currentPage
                            ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 py-2 text-gray-500">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => onPageChange(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!isLoading && !error && products.length === 0 && (
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
              onClick={onResetFilters}
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
  );
}
