'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllProductsQuery } from "@/store/api/productsApi";
import { useGetAllCategoriesQuery } from "@/store/api/categoriesApi";
import { transformProducts } from "@/lib/productHelpers";
import ShopBanner from "@/components/shop/ShopBanner";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopProductsGrid from "@/components/shop/ShopProductsGrid";

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
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch categories from API
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesQuery({ isActive: true });
  
  // Fetch products from API
  const { data, isLoading, error } = useGetAllProductsQuery({
    page: currentPage,
    limit: 4,
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
    sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
    colors: selectedColors.length > 0 ? selectedColors : undefined,
    inStock: inStockOnly ? true : undefined,
    sort: sortBy === 'price-low' ? 'price-asc' 
        : sortBy === 'price-high' ? 'price-desc'
        : sortBy === 'newest' ? 'newest'
        : sortBy === 'popular' ? 'popular'
        : undefined,
  });

  // Transform products to frontend format
  
  const products = data?.products ? transformProducts(data.products) : [];
  console.log(products);
  const pagination = data?.pagination;

  // Update category from URL on mount
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, priceRange, selectedSizes, selectedColors, inStockOnly, searchQuery]);

  // Build dynamic categories list
  const apiCategories = categoriesData || [];
  const categories = [
    { id: "all", name: "All Products", slug: "all" },
    ...apiCategories.map((cat: any) => ({
      id: cat._id,
      name: cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name,
      slug: cat.slug,
      parent: cat.parent
    }))
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
    setCurrentPage(1);
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 500) count++;
    if (selectedSizes.length > 0) count++;
    if (selectedColors.length > 0) count++;
    if (inStockOnly) count++;
    return count;
  };

  const categoryName = categories.find(c => c.id === selectedCategory)?.name;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <ShopBanner 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categoryName={categoryName}
        showFilters={showFilters}
        activeFiltersCount={activeFiltersCount()}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <ShopFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            priceRange={priceRange}
            inStockOnly={inStockOnly}
            sortBy={sortBy}
            activeFiltersCount={activeFiltersCount()}
            showFilters={showFilters}
            onCategoryChange={setSelectedCategory}
            onToggleSize={toggleSize}
            onToggleColor={toggleColor}
            onPriceRangeChange={setPriceRange}
            onInStockChange={setInStockOnly}
            onSortChange={setSortBy}
            onResetFilters={resetFilters}
          />

          {/* Products Grid */}
          <ShopProductsGrid 
            products={products}
            pagination={pagination}
            viewMode={viewMode}
            isLoading={isLoading}
            error={error}
            currentPage={currentPage}
            activeFiltersCount={activeFiltersCount()}
            onPageChange={setCurrentPage}
            onResetFilters={resetFilters}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>
    </div>
  );
}
