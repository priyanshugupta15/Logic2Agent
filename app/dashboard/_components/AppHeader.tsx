"use client";
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton, SignedIn } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

function AppHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const mainContainer = document.getElementById("dashboard-main");
        if (!mainContainer) return;

        const handleScroll = () => {
            setScrolled(mainContainer.scrollTop > 20);
        };
        mainContainer.addEventListener("scroll", handleScroll);
        return () => mainContainer.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`flex justify-between items-center w-full px-6 h-20 transition-all duration-300 border-b ${scrolled
            ? "bg-black/60 backdrop-blur-xl border-primary/20 shadow-[0_5px_40px_-10px_rgba(59,130,246,0.2)]"
            : "bg-transparent border-white/5"
            }`}>
            <div className="flex items-center gap-4 h-full">
                <SidebarTrigger className="h-8 w-8 text-gray-400 hover:text-primary transition-colors md:hidden" />

                <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block md:hidden" />
                <Link href="/" className="flex items-center group h-full">
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

            </div>
            <div className="flex items-center gap-4">
                {/* Desktop Sidebar Toggle - visible on md and above */}

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
        </header>
    )
}

export default AppHeader