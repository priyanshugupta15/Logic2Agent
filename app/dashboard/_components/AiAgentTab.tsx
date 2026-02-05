"use client";

import React, { useContext, useEffect, useState } from 'react'
import MyAgents from './MyAgents'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function AiAgentTab() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div id="ai-agents" className='px-4 md:px-12 lg:px-24 mt-12 mb-20 scroll-mt-24'>
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-400">My Agents</h2>
                </div>
                <MyAgents />
            </div>
        </div>
    )
}

export default AiAgentTab
