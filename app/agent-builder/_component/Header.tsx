import { Button } from '@/components/ui/button'
import { ChevronLeft, Play, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface HeaderProps {
    agentName?: string;
    agentId?: string;
}

function Header({ agentName, agentId }: HeaderProps) {
    return (
        <div className='flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl'>
            <div className='flex items-center gap-4'>
                <Link
                    href={'/dashboard'}
                    className='group flex items-center justify-center w-10 h-10 hover:bg-primary/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                >
                    <ChevronLeft className='h-5 w-5 text-gray-400 group-hover:text-primary transition-colors' />
                </Link>
                <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 border border-primary/20 p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)]'>
                        <Sparkles className='h-5 w-5 text-primary' />
                    </div>
                    <h1 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500'>
                        {agentName || 'Agent Builder'}
                    </h1>
                </div>
            </div>
            <div>
                <Link href={`/agent-builder/${agentId}/preview`}>
                    <Button
                        className='bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all font-semibold rounded-xl px-5 gap-2'
                    >
                        <Play className='h-4 w-4' />
                        Preview Agent
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Header
