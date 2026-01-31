import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logic2Agent",
  description: "Logic2Agent - Autonomous AI Solutions",
  icons: {
    icon: "/icon.png",
  },
};


import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "sonner";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Provider from "./provider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-blue-500/30 min-h-screen flex flex-col`}
      >
        <ClerkProvider>
          <ConvexClientProvider>
            <Provider>
              {children}
              <Toaster richColors />
            </Provider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>


  );
}

