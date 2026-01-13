import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Alpha Travel & Tours - Nova Scotia Tours & Transportation",
    template: "%s | Alpha Travel & Tours",
  },
  description: "Explore Nova Scotia with Alpha Travel & Tours. We offer customized group tours, airport transfers, golf tours, wedding transportation and group charters.",
  keywords: ["Nova Scotia tours", "group charter", "airport transfers", "golf tours", "wedding transportation", "Dartmouth", "Halifax"],
  authors: [{ name: "Alpha Travel & Tours" }],
  creator: "Alpha Travel & Tours",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Alpha Travel & Tours",
    title: "Alpha Travel & Tours - Nova Scotia Tours & Transportation",
    description: "Explore Nova Scotia with Alpha Travel & Tours. Customized group tours, airport transfers, golf tours, and wedding transportation.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alpha Travel & Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Travel & Tours - Nova Scotia Tours",
    description: "Explore Nova Scotia with Alpha Travel & Tours.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
