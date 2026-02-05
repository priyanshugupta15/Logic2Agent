"use client";
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import React, { useContext } from 'react'
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';







function CreateAgentSection() {
    const router = useRouter();
    const [openDialog, setOpenDialog] = React.useState(false);
    const createAgentMutation = useMutation(api.agent.createAgent);

    const [agentName, setAgentName] = useState<string>();

    const [loader, setLoader] = useState(false);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const createAgent = async () => {
        const agentId = uuidv4();
        setLoader(true);
        await createAgentMutation({
            name: agentName ?? ' ',
            agentId: agentId,
            userId: userDetail?._id,
        });
        setOpenDialog(false);
        setLoader(false);
        router.push(`/agent-builder/${agentId}`);
    }

    return (
        <div className='flex flex-col items-center justify-center p-8 text-center'>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-md text-secondary text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-6">
                <span>Logic2Agent Workspace</span>
            </div>

            <h2 className='font-black text-4xl sm:text-5xl mb-4 text-white tracking-tight drop-shadow-md'>
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-secondary animate-pulse">AI Agent</span>
            </h2>
            <p className='text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed'>
                Build a new visual agent workflow with custom reasoning logic and tools.
            </p>

            {mounted ? <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button size={'lg'} onClick={() => setOpenDialog(true)} className="h-14 px-8 text-lg rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white gap-3 font-bold shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-1 active:scale-95 border-0">
                        <Plus className="w-6 h-6" /> Create New Agent
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Agent Name</DialogTitle>
                        <DialogDescription>
                            <Input placeholder='Agent Name' onChange={(e) => setAgentName(e.target.value)} />
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={createAgent} disabled={loader}>
                            {loader && <Loader2 className="animate-spin" />}
                            Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> :
                <Button size={'lg'} onClick={() => setOpenDialog(true)} className="h-14 px-8 text-lg rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white gap-3 font-bold shadow-[0_10px_40px_-10px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-1 active:scale-95 border-0">
                    <Plus className="w-6 h-6" /> Create New Agent
                </Button>
            }
        </div>
    )
}

export default CreateAgentSection
