
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PT_Sans } from 'next/font/google'; // Import the font

// Configure PT Sans font
const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans', // Define a CSS variable
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Uprock Getaways',
  description: 'Find personalized travel deals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable}`} suppressHydrationWarning={true}>
      <head>
        {/* Google Font <link> tags are removed and handled by next/font */}
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
