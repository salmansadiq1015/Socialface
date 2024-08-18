"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./utils/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="dark:bg-gray-950 w-full min-h-screen overflow-x-hidden  dark:text-white text-black">
              {children}
              <Toaster />
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
