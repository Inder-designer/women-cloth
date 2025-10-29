import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { AuthProvider } from "@/contexts/AuthContext";
import ConditionalAdminLayout from "@/components/ConditionalAdminLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Surkh-E-Punjab Admin",
  description: "Admin panel for Surkh-E-Punjab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <ConditionalAdminLayout>
              {children}
            </ConditionalAdminLayout>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
