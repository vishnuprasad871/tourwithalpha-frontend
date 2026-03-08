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
    default: "Alpha Travel & Tours | Small-Group Nova Scotia Tours from Halifax",
    template: "%s | Alpha Travel & Tours",
  },
  description:
    "Locally owned small-group tours in Nova Scotia departing from Halifax. Visit Peggy's Cove, Lunenburg (UNESCO), and the Titanic Fairview Cemetery. Cruise-friendly scheduling — $150/person. Book direct for the best rate.",
  keywords: [
    "Nova Scotia tours",
    "Halifax tours",
    "Peggy's Cove tour",
    "Lunenburg tour",
    "Titanic Cemetery Halifax",
    "Fairview Lawn Cemetery",
    "cruise excursions Halifax",
    "small group tours Nova Scotia",
    "day tours Nova Scotia",
    "cruise ship tours Halifax",
    "group charter Nova Scotia",
    "airport transfers Halifax",
    "golf tours Nova Scotia",
    "wedding transportation Nova Scotia",
    "tourwithalpha",
    "Alpha Travel Tours",
  ],
  authors: [{ name: "Alpha Travel & Tours" }],
  creator: "Alpha Travel & Tours",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.tourwithalpha.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.tourwithalpha.com",
    siteName: "Alpha Travel & Tours",
    title: "Alpha Travel & Tours | Small-Group Nova Scotia Tours from Halifax",
    description:
      "Explore Nova Scotia on a premium small-group tour. Peggy's Cove, Lunenburg & Titanic Cemetery — $150/person. Cruise-friendly, port pickup, free cancellation.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Alpha Travel & Tours — Nova Scotia Small-Group Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alpha Travel & Tours | Nova Scotia Small-Group Tours",
    description:
      "Peggy's Cove, Lunenburg & Titanic Cemetery — $150/person. Cruise-friendly scheduling from Halifax. Book direct for the best rate.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
