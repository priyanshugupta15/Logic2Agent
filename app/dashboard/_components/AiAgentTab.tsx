"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useContext, useEffect, useState } from 'react'
import MyAgents from './MyAgents'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function AiAgentTab() {
    const { userDetail } = useContext(UserDetailContext);
    const [agentList, setAgentList] = useState([]);
    const convex = useConvex();

    const [mounted, setMounted] = useState(false);

    const GetUserAgents = async () => {
        if (!userDetail?._id) return;
        const result = await convex.query(api.agent.getAgentList, { userId: userDetail?._id });
        console.log(result);
    }

    useEffect(() => {
        setMounted(true);
        GetUserAgents();
    }, [userDetail]);

    if (!mounted) return null;

    return (
        <div id="ai-agents" className='px-10 md:px-24 lg:px-32 mt-10 scroll-mt-24'>
            <Tabs defaultValue="myagent" className="w-full">
                <TabsList>
                    <TabsTrigger value="myagent">My Agents</TabsTrigger>
                    <TabsTrigger value="template">Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="myagent"><MyAgents /></TabsContent>
                <TabsContent value="template">Templates</TabsContent>
            </Tabs>
        </div>
    )
}

export default AiAgentTab
