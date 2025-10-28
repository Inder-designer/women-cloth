'use client';

import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    {
      id: "dresses",
      name: "Dresses",
      description: "Elegant dresses for every occasion",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      count: 45,
    },
    {
      id: "tops",
      name: "Tops & Blouses",
      description: "Stylish tops and blouses",
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
      count: 52,
    },
    {
      id: "bottoms",
      name: "Bottoms",
      description: "Comfortable pants, skirts & shorts",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
      count: 38,
    },
    {
      id: "outerwear",
      name: "Outerwear",
      description: "Jackets, coats & cardigans",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      count: 28,
    },
    {
      id: "activewear",
      name: "Activewear",
      description: "Sporty and comfortable workout wear",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
      count: 34,
    },
    {
      id: "accessories",
      name: "Accessories",
      description: "Bags, jewelry & more",
      image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80",
      count: 67,
    },
    {
      id: "shoes",
      name: "Shoes",
      description: "Heels, flats, sneakers & boots",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      count: 42,
    },
    {
      id: "sleepwear",
      name: "Sleepwear",
      description: "Comfortable nightwear & loungewear",
      image: "https://images.unsplash.com/photo-1616150840595-2592424c405e?w=800&q=80",
      count: 25,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-linear-to-r from-[#D32F2F] to-[#d10303] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 font-playfair">
            Shop by Category
          </h1>
          <p className="text-base text-gray-100 max-w-2xl mx-auto">
            Explore our curated collections and find exactly what you're looking for
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.id}`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-3/4 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-lg font-bold font-playfair">
                    {category.name}
                  </h3>
                  <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold">
                    {category.count}
                  </span>
                </div>
                <p className="text-gray-200 mb-3 text-sm">{category.description}</p>
                <div className="flex items-center text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>Explore</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 border-4 border-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Browse our complete collection or contact our customer service team for personalized assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-[#D32F2F] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#B71C1C] transition shadow-lg hover:shadow-xl"
            >
              View All Products
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-white text-[#D32F2F] border-2 border-[#D32F2F] px-8 py-3 rounded-md font-semibold hover:bg-[#D32F2F] hover:text-white transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
