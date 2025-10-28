'use client';

import Link from "next/link";

export default function AboutPage() {
  const values = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Quality First",
      description: "We source only the finest materials and work with trusted manufacturers to ensure every piece meets our high standards.",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      title: "Sustainability",
      description: "We're committed to ethical fashion practices and reducing our environmental impact through sustainable sourcing and production.",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Customer Care",
      description: "Your satisfaction is our priority. We offer exceptional customer service, hassle-free returns, and a seamless shopping experience.",
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Innovation",
      description: "We stay ahead of fashion trends while creating timeless pieces that transcend seasons and remain stylish for years to come.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    },
    {
      name: "Emily Chen",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    },
    {
      name: "Jessica Williams",
      role: "Sustainability Lead",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
    },
    {
      name: "Maria Garcia",
      role: "Customer Experience Manager",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[350px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 font-playfair">
              Our Story
            </h1>
            <p className="text-base text-gray-200 leading-relaxed">
              Empowering women through fashion since 2015. We believe every woman deserves to feel confident and beautiful in what she wears.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-playfair">
              Our Mission
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              At Surkh-E-Punjab, we're passionate about creating clothing that combines elegance, comfort, and sustainability. 
              Our mission is to provide modern women with high-quality, stylish pieces that make them feel empowered and confident 
              in every aspect of their lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-5 mt-10">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-playfair">
                Founded in 2015
              </h3>
              <p className="text-gray-600 text-sm">
                What started as a small boutique in New York has grown into a beloved brand serving customers worldwide. 
                We've stayed true to our core values while expanding our reach and impact.
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-playfair">
                10,000+ Happy Customers
              </h3>
              <p className="text-gray-600 text-sm">
                Our community has grown to over 10,000 satisfied customers who trust us for their fashion needs. 
                Their feedback and loyalty drive us to continuously improve and innovate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
              Our Values
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              These principles guide everything we do, from design to delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="text-[#D32F2F] mb-3">
                  {value.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 font-playfair">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
            Meet Our Team
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            The passionate people behind Surkh-E-Punjab
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative overflow-hidden rounded-lg mb-3 aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#D32F2F]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1 font-playfair">
                {member.name}
              </h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-[#D32F2F] to-[#d10303] py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold mb-3 font-playfair">
            Join Our Fashion Community
          </h2>
          <p className="text-base mb-6 text-gray-100 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and fashion tips
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-white text-[#D32F2F] px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition shadow-lg text-sm"
            >
              Start Shopping
            </Link>
            <Link
              href="/contact"
              className="inline-block bg-transparent border-2 border-white text-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-[#D32F2F] transition text-sm"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
