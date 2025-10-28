import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#8B4513] text-white border-t-4 border-[#D32F2F]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D32F2F] flex items-center justify-center">
                <span className="text-2xl text-white font-bold">ਸ</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-playfair">Surkh-E-Punjab</h3>
                <p className="text-xs text-[#FFD700]">ਸੁਰਖ਼-ਏ-ਪੰਜਾਬ</p>
              </div>
            </div>
            <p className="text-gray-200 text-sm">
              Celebrating the vibrant colors and rich heritage of Punjab through fashion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FFD700]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FFD700]">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-200 hover:text-[#FFD700] transition text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#FFD700]">Newsletter</h4>
            <p className="text-gray-200 text-sm mb-4">
              Subscribe for exclusive Punjabi fashion updates!
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-md text-gray-900 text-sm border-2 border-[#FFD700] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#D32F2F] px-4 py-2 rounded-r-md hover:bg-[#B71C1C] transition text-sm font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#D32F2F]/30 mt-8 pt-8 text-center">
          <p className="text-gray-200 text-sm">
            © {new Date().getFullYear()} Surkh-E-Punjab (ਸੁਰਖ਼-ਏ-ਪੰਜਾਬ). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
