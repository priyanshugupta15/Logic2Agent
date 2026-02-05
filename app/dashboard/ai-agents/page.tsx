"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAgents from '../_components/MyAgents'
import AiAgentTab from '../_components/AiAgentTab'
import { useEffect, useState } from 'react'

function AiAgentsPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className='w-full'>
            <AiAgentTab />
        </div>
    )
}

export default AiAgentsPage
