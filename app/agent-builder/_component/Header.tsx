import { Button } from '@/components/ui/button'
import { ChevronLeft, Code2, Play, Share } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface HeaderProps {
    agentName?: string;
    agentId?: string;
}

function Header({ agentName, agentId }: HeaderProps) {
    return (
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-2'>
                <Link href={'/dashboard'} className='hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-full transition-colors'>
                    <ChevronLeft className='h-8 w-8' />
                </Link>
                <h1 className='text-xl font-bold'>{agentName || 'Agent Name'}</h1>
            </div>
            <div>
                <Button variant={'ghost'}> <Code2 /> Code </Button>
                <Link href={`/agent-builder/${agentId}/preview`}>
                    <Button variant={'ghost'}> <Play /> Preview </Button>
                </Link>
                <Button variant={'ghost'}> <Share /> Publish </Button>
            </div>
        </div>
    )
}

export default Header
