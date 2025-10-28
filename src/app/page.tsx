'use client';

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useEffect } from "react";

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Compact */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-lg text-white">
            <p className="text-xs font-semibold tracking-widest uppercase mb-2 text-[#FFD700]">
              New Collection 2025
            </p>
            {/* <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight font-playfair">
              Celebrating Punjab
              <span className="block text-[#FFD700]">Through Fashion</span>
            </h1>
            <p className="text-base md:text-lg mb-5 text-gray-200">
              Discover vibrant colors and rich heritage in every piece
            </p> */}
            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight font-playfair">
              Authentic Punjabi
              <span className="block text-[#FFD700]">Traditional Wear</span>
            </h1>
            <p className="text-base md:text-lg mb-5 text-gray-200">
              Salwar Kameez, Patiala Suits, Phulkari Dupattas & More
            </p>
            <div className="flex gap-3">
              <Link
                href="/shop"
                className="bg-[#D32F2F] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#B71C1C] transition-all shadow-lg"
              >
                Shop Collection
              </Link>
              <Link
                href="/categories"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-[#FFD700] px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-[#FFD700] hover:text-[#8B4513] transition-all"
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar - Compact */}
      <section className="bg-[#8B4513] text-white py-3 border-y-2 border-[#D32F2F]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
            {[
              { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", title: "Free Shipping", desc: "Orders $100+" },
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Quality", desc: "Premium" },
              { icon: "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6", title: "Easy Returns", desc: "30-day" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Fast Delivery", desc: "2-5 days" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <div className="text-left">
                  <p className="font-semibold text-xs">{item.title}</p>
                  <p className="text-xs text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - Compact */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8 scroll-animate">
          <p className="text-[#D32F2F] font-semibold tracking-widest uppercase text-xs mb-1">
            Shop by Category
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-playfair">
            Find Your Perfect Style
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { url: "/category/dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80", title: "Dresses", desc: "Elegant & Timeless" },
            { url: "/category/tops", img: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80", title: "Tops & Blouses", desc: "Chic & Versatile" },
            { url: "/category/bottoms", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80", title: "Bottoms", desc: "Comfortable & Stylish" }
          ].map((cat, i) => (
            <Link key={i} href={cat.url} className={`group relative h-72 overflow-hidden rounded-lg shadow-md scroll-animate delay-${i * 100}`}>
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl font-bold mb-1 font-playfair">{cat.title}</h3>
                <p className="text-gray-200 mb-2 text-sm">{cat.desc}</p>
                <span className="inline-flex items-center text-xs font-semibold">
                  Shop Now 
                  <svg className="w-3 h-3 ml-1 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section - Compact */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 scroll-animate">
            <div>
              <p className="text-[#D32F2F] font-semibold tracking-widest uppercase text-xs mb-1">
                Trending Now
              </p>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">Featured Products</h2>
            </div>
            <Link href="/shop" className="text-[#D32F2F] font-semi`bold hover:underline flex items-center gap-1 mt-2 md:mt-0 text-sm">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className={`scroll-animate delay-${(index + 1) * 100}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Compact */}
      <section className="bg-linear-to-r from-[#D32F2F] to-[#B71C1C] py-12">
        <div className="container mx-auto px-4 text-center text-white scroll-animate">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 font-playfair">Subscribe to Our Newsletter</h2>
          <p className="text-sm md:text-base mb-5 text-gray-100">
            Get exclusive offers and updates
          </p>
          <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-gray-800 transition text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
