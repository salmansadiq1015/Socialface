"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./utils/theme-provider";
import Head from "next/head";
import { Tooltip } from "react-tooltip";
import SocketHandler from "./context/socketHandler";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Head>
        {/* Title of the page */}
        <title>Socialface - Connect, Share, and Engage</title>
        {/* Favicon - make sure the path is correct and the image is in /public */}
        <link
          rel="icon"
          href="/Sociallogo3.png"
          sizes="32x32"
          type="image/png"
        />
        <link rel="apple-touch-icon" href="/Sociallogo3.png" />{" "}
        {/* For Apple Devices */}
        {/* Meta description for SEO */}
        <meta
          name="description"
          content="Socialface is a new-age social media platform that lets you connect, share, and engage with friends and communities worldwide. Discover trends, chat with friends, and stay updated with everything that matters to you."
        />
        {/* Mobile-friendly viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Open Graph tags for social media previews */}
        <meta
          property="og:title"
          content="Socialface - Connect, Share, and Engage"
        />
        <meta
          property="og:description"
          content="Join Socialface, the best place to connect with friends, share your moments, and engage with vibrant communities. Get instant updates and join the conversation!"
        />
        <meta property="og:image" content="/Socialface-preview.png" />
        <meta property="og:url" content="https://socialface-eight.vercel.app" />
        <meta property="og:type" content="website" />
        {/* Twitter Card tags for Twitter previews */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Socialface - Connect, Share, and Engage"
        />
        <meta
          name="twitter:description"
          content="Socialface is your go-to social network to connect with friends, share updates, and explore new communities."
        />
        <meta name="twitter:image" content="/Socialface-preview.png" />
        <meta name="twitter:site" content="@Socialface" />
        {/* Keywords for SEO */}
        <meta
          name="keywords"
          content="Socialface, social media, connect with friends, share posts, social networking, chat, social platform, trending topics, communities"
        />
        {/* Author and Site Name */}
        <meta name="author" content="Socialface" />
        <meta property="og:site_name" content="Socialface" />
        {/* Canonical URL for SEO */}
        <link rel="canonical" href="https://socialface-eight.vercel.app" />
        {/* Robots meta tag for search engine crawling */}
        <meta name="robots" content="index, follow" />
        {/* Charset */}
        <meta charSet="UTF-8" />
        {/* Optional theme color for the address bar in mobile browsers */}
        <meta name="theme-color" content="#1DA1F2" />
        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="//socialface-eight.vercel.app" />
      </Head>

      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SocketHandler />
            <main className="dark:bg-gray-950 w-full min-h-screen overflow-x-hidden  dark:text-white text-black">
              {children}
              <Toaster />
              <Tooltip
                id="my-tooltip"
                place="bottom"
                effect="solid"
                className="!bg-gradient-to-r !from-orange-500 !via-orange-500 !to-yellow-500 !text-white !text-[11px] !py-1 !px-2"
              />
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
