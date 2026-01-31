import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AppHeader() {
    return (
        <header className="sticky top-0 z-40 flex justify-between items-center w-full px-6 h-20 border-b border-white/5 bg-black/70 backdrop-blur-md">
            <div className="flex items-center gap-4 h-full">
                <SidebarTrigger className="h-8 w-8 text-gray-400 hover:text-primary transition-colors" />

                <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
                <Link href="/" className="flex items-center group h-full">
                    <div className="flex items-center gap-0">
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

            </div>
            <div className="flex items-center gap-4">
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "w-10 h-10 border border-primary/20 hover:border-accent transition-all shadow-[0_0_15px_rgba(168,162,158,0.1)]"
                        }
                    }}
                />
            </div>
        </header>
    )
}

export default AppHeader
