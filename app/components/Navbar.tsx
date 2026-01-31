"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center border-b border-white/5 ${scrolled
                ? "bg-white/70 dark:bg-black/70 backdrop-blur-md border-gray-200 dark:border-gray-800"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between h-full">
                <Link href="/" className="flex items-center group p-0 m-0 h-full">
                    <div className="flex items-center">
                        <Image
                            src="/hero.png"
                            alt="Logic2Agent Logo"
                            width={80}
                            height={24}
                            className="object-contain transition-transform group-hover:scale-105"
                            priority
                        />
                        <div className="text-xl font-bold flex items-center -ml-1">
                            <span className="text-blue-500 dark:text-blue-400">Logic</span>
                            <span className="text-yellow-500">2</span>
                            <span className="text-blue-500 dark:text-blue-400">Agent</span>
                        </div>
                    </div>
                </Link>




                <div className="flex items-center space-x-4">
                    <SignedOut>
                        <Link href="/sign-in" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                            Sign In
                        </Link>
                    </SignedOut>
                    <SignedIn>

                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10 border border-primary/20 hover:border-accent transition-all shadow-[0_0_15px_rgba(168,162,158,0.1)]"
                                }
                            }}
                        />
                    </SignedIn>
                </div>


            </div>
        </nav>
    );
}
