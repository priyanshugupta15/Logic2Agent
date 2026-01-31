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
            <h2 className='font-bold text-3xl mb-2 text-white'>Create AI Agent</h2>
            <p className='text-md text-gray-400 mb-8'>Build a AI Agent workflow with custom logic and tools</p>

            {mounted ? <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                    <Button size={'lg'} onClick={() => setOpenDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        <Plus /> Create Agent
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
                <Button size={'lg'} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-medium px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                    <Plus /> Create Agent
                </Button>
            }
        </div>
    )
}

export default CreateAgentSection
