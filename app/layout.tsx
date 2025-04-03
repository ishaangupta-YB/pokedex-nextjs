import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; // Define your production URL here or in .env

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), // Important for resolving relative Open Graph image paths
  title: {
    default: "Pokédex - Explore the World of Pokémon",
    template: "%s | Pokédex", // For titles in child pages
  },
  description: "An interactive Pokédex built with Next.js, Tailwind CSS, and the PokéAPI. Search, filter, and discover detailed information about your favorite Pokémon.",
  keywords: ["Pokémon", "Pokédex", "Next.js", "React", "Tailwind CSS", "PokeAPI"],
  authors: [{ name: "Your Name / Team Name" }], // Replace with your name/team
  creator: "Your Name / Team Name", // Replace with your name/team
  // Open Graph Metadata
  openGraph: {
    title: "Pokédex - Explore the World of Pokémon",
    description: "An interactive Pokédex to discover Pokémon.",
    url: siteUrl,
    siteName: "Pokédex",
    // images: [
    //   {
    //     url: `/og-image.png`, // Replace with your actual OG image path (e.g., in /public)
    //     width: 1200,
    //     height: 630,
    //     alt: "Pokédex Application Screenshot",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  // Twitter Card Metadata
  twitter: {
    card: "summary_large_image", // Use "summary" if you don't have a large image
    title: "Pokédex - Explore the World of Pokémon",
    description: "An interactive Pokédex to discover Pokémon.",
    // images: [`${siteUrl}/og-image.png`], // Replace with your actual OG image path
    // creator: "@yourTwitterHandle", // Replace with your Twitter handle
  },
  // Icons (Favicon etc.)
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  // Optional: Robots meta tag
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     'max-video-preview': -1,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased flex flex-col min-h-screen",
          "bg-background dark:bg-grid-small-white/[0.05] bg-grid-small-black/[0.05] relative"
        )}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-5 dark:opacity-10"></div>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
