"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import { LogIn } from "lucide-react";

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
            className={`fixed top-0 w-full z-50 transition-all duration-300 h-20 flex items-center border-b ${scrolled
                ? "bg-black/60 backdrop-blur-xl border-primary/20 shadow-[0_5px_40px_-10px_rgba(59,130,246,0.2)]"
                : "bg-black/10 backdrop-blur-sm border-white/5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between h-full">
                <Link href="/" className="flex items-center group p-0 m-0 h-full">
                    <div className="flex items-center tracking-tighter transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <div className="text-3xl font-black flex items-baseline tracking-tighter py-2 relative">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-500 dark:from-blue-400 dark:via-cyan-200 dark:to-blue-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">Logic</span>
                            <div className="relative mx-1 flex items-center justify-center">
                                <span className="text-4xl text-accent drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] transform transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-[360deg] group-hover:drop-shadow-[0_0_30px_rgba(234,179,8,0.8)] z-10 relative">2</span>
                                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-all duration-500 scale-150" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-500 dark:from-blue-400 dark:via-cyan-200 dark:to-blue-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]">Agent</span>
                        </div>
                    </div>
                </Link>




                <div className="flex items-center space-x-4">
                    <SignedOut>
                        <Button size="lg" className="flex items-center gap-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-100 shadow-none transition-all duration-300 backdrop-blur-md hover:bg-blue-600/20 hover:border-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] active:scale-95 group" asChild>
                            <Link href="/sign-in">
                                <span>Sign In</span>
                                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
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
