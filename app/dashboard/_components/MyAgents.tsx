"use client";
import React, { useContext, useEffect, useState } from 'react'
import { GitBranch, Trash2, Star } from 'lucide-react'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import moment from 'moment';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner';

type MyAgentsProps = {
    miniView?: boolean;
}

function MyAgents({ miniView = false }: MyAgentsProps) {
    const { userDetail } = useContext(UserDetailContext);
    const convex = useConvex();
    const deleteAgentMutation = useMutation(api.agent.deleteAgent);
    const toggleStarMutation = useMutation(api.agent.ToggleStar);
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (userDetail) {
            GetUserAgents();
        }
    }, [userDetail]);

    const GetUserAgents = async () => {
        if (!userDetail?._id) return;
        const result = await convex.query(api.agent.getAgentList, { userId: userDetail?._id });
        setAgentList(result);
    }

    const handleDeleteAgent = async () => {
        if (!deleteId) return;

        try {
            // @ts-ignore
            await deleteAgentMutation({ agentId: deleteId });
            toast.success("Agent deleted successfully");
            GetUserAgents(); // Refresh list
        } catch (error) {
            toast.error("Failed to delete agent");
            console.error(error);
        } finally {
            setDeleteId(null);
        }
    }

    const handleToggleStar = async (e: React.MouseEvent, agent: Agent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            // @ts-ignore
            await toggleStarMutation({ id: agent._id, starred: !agent.starred });
            // Optimistic update or refresh
            GetUserAgents();
        } catch (error) {
            toast.error("Failed to update star status");
        }
    };

    const displayList = miniView
        ? agentList.filter(agent => agent.starred).slice(0, 3)
        : agentList;

    return (
        <div className={miniView ? "" : "mt-5"}>
            {displayList && displayList.length > 0 ? (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${miniView ? 'lg:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6 animate-fade-in`}>
                    {displayList.map((agent: Agent, index: number) => (
                        <div key={index} className="group relative border border-white/5 rounded-2xl bg-black/40 backdrop-blur-md hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1">
                            <Link href={'/agent-builder/' + agent.agentId} className='block p-6 h-full'>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-linear-to-tr from-primary/20 to-secondary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-primary/20">
                                        <GitBranch className="w-6 h-6 text-primary group-hover:text-cyan-300 transition-colors" />
                                    </div>
                                    <button
                                        onClick={(e) => handleToggleStar(e, agent)}
                                        className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-full transition-all"
                                    >
                                        <Star className={`w-5 h-5 ${agent.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                                    </button>
                                </div>

                                <h3 className="font-bold text-xl mb-2 text-gray-100 group-hover:text-primary transition-colors line-clamp-1">{agent.name}</h3>
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-xs font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full">{moment(agent._creationTime).fromNow()}</p>
                                </div>
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // @ts-ignore
                                    setDeleteId(agent._id);
                                }}
                                className="absolute bottom-4 right-4 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {miniView && agentList.length > 3 && (
                        <Link href="/dashboard/ai-agents" className="group border border-dashed border-white/10 rounded-2xl bg-black/20 hover:bg-primary/5 flex flex-col items-center justify-center gap-4 transition-all hover:border-primary/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <span className="text-2xl font-thin text-gray-400 group-hover:text-primary">+</span>
                            </div>
                            <span className="font-medium text-gray-400 group-hover:text-primary">View All Agents</span>
                        </Link>
                    )}
                </div>
            ) : (
                <div className={`flex flex-col items-center justify-center ${miniView ? 'p-10' : 'p-20'} border border-white/5 border-dashed rounded-3xl bg-black/20 backdrop-blur-xl ${miniView ? 'mt-0' : 'mt-8'}`}>
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{miniView ? "No favorite agents" : "No agents yet"}</h3>
                    <p className="text-gray-400 text-center max-w-sm">{miniView ? "Star your most used agents to see them here." : "Create your first AI agent above to start building powerful workflows."}</p>
                </div>
            )}

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your agent and remove its data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button
                            onClick={() => setDeleteId(null)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAgent}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                        >
                            Delete
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MyAgents
