import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Cashierlite POS | Smart Premium Point-of-Sale System',
  description: 'Cashierlite is a premium POS management system for retail and restaurants. Manage sales, inventory, staff, and reports in one smart, cloud-powered platform.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Cashierlite POS | Smart Premium Point-of-Sale System',
    description: 'Cloud-powered restaurant and retail POS with real-time analytics.',
    url: 'https://cashier-lite-pos.vercel.app',
    siteName: 'Cashierlite',
    images: [
      {
        url: '/images/cashierlite_pos.webp',
        width: 1200,
        height: 630,
        alt: 'Cashierlite POS Smart Interface Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cashierlite POS | Smart Premium Point-of-Sale System',
    description: 'The smart way to manage your business operations.',
    images: ['/images/cashierlite_pos.webp'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  themeColor: '#10b981', // emerald-500 from the brand
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-white">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
