import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surkh-E-Punjab - Your Style, Your Way",
  description: "Discover the latest trends in Surkh-E-Punjab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased font-poppins`}
      >
        <CartProvider>
          <WishlistProvider>
            <Header />
            {children}
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
