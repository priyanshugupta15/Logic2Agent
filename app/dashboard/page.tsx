import React from 'react'
import CreateAgentSection from './_components/CreateAgentSection'
import MyAgents from './_components/MyAgents'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function Dashboard() {
    return (
        <div className="flex flex-col items-center justify-center w-full mt-0 p-4">
            <CreateAgentSection />
            <div className="w-full relative overflow-hidden px-4 md:px-12 lg:px-24 mt-12 mb-20 scroll-mt-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-400">Favorite AI Agents</h2>
                    <Link href="/dashboard/ai-agents" className="text-sm font-medium text-primary hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                <MyAgents miniView={true} />

                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/5 rounded-full blur-[140px] animate-pulse pointer-events-none" />
            </div>
        </div>
    )
}

export default Dashboard