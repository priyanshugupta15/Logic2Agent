"use client";
import React, { useContext, useEffect, useState } from 'react'
import { GitBranch, Scissors } from 'lucide-react'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import moment from 'moment';
import Link from 'next/link';


function MyAgents() {
    const { userDetail } = useContext(UserDetailContext);
    const convex = useConvex();
    const [agentList, setAgentList] = useState<Agent[]>([]);

    useEffect(() => {
        GetUserAgents();
    }, [userDetail]);

    const GetUserAgents = async () => {
        if (!userDetail?._id) return;
        const result = await convex.query(api.agent.getAgentList, { userId: userDetail?._id });
        setAgentList(result);
    }
    return (
        <div className="mt-5">
            {agentList && agentList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {agentList.map((agent: Agent, index: number) => (
                        <Link href={'/agent-builder/' + agent.agentId} key={index}>
                            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                                    <GitBranch className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{agent.name}</h3>
                                <p className="text-xs text-gray-500">{moment(agent._creationTime).fromNow()}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50 mt-5">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <GitBranch className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No agents found</h3>
                    <p className="text-gray-500 mt-1">Create your first AI agent to get started</p>
                </div>
            )}
        </div>
    )
}

export default MyAgents
