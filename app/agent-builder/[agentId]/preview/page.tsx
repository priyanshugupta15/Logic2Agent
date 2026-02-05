"use client";
import { Button } from '@/components/ui/button';
import { ChevronLeft, Code2, Loader2, RefreshCw, Send, SquareArrowOutUpRight, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

interface ChatMessage {
    role: 'user' | 'agent' | 'system';
    content: string;
    id: string;
}
import { api } from '@/convex/_generated/api';
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import Custom Nodes
import StartNode from '../../_component/StartNode';
import AgentNode from '../../_component/AgentNode';
import EndNode from '../../_component/EndNode';
import IfElseNode from '../../_component/IfElseNode';
import WhileNode from '../../_component/WhileNode';
import UserApprovalNode from '../../_component/UserApprovalNode';
import ApiNode from '../../_component/ApiNode';
import NoteNode from '../../_component/NoteNode';
import FileSearchNode from '../../_component/FileSearchNode';
import GuardrailsNode from '../../_component/GuardrailsNode';
import MCPNode from '../../_component/MCPNode';
import TransformNode from '../../_component/TransformNode';
import SetStateNode from '../../_component/SetStateNode';
import { PublishModal } from './_components/PublishModal';

const nodeTypes = {
    StartNode,
    AgentNode,
    EndNode,
    IfElseNode,
    WhileNode,
    UserApprovalNode,
    ApiNode,
    NoteNode,
    FileSearchNode,
    GuardrailsNode,
    MCPNode,
    TransformNode,
    SetStateNode
};

function PreviewAgent() {
    const { agentId } = useParams();
    const router = useRouter();
    const agentData = useQuery(api.agent.getAgentById, { agentId: agentId as string });
    // ⚙️ Store generated workflow config
    const [config, setConfig] = React.useState<any>();
    // 🤖 Store AI Generated Tool Config
    const [toolConfig, setToolConfig] = React.useState<any>();

    // 💬 Chat State
    const [messages, setMessages] = React.useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // 🦾 Convex mutation to save config
    const updateAgent = useMutation(api.agent.UpdateAgentDetail);

    // 🔄 Reboot state
    const [isRebooting, setIsRebooting] = React.useState(false);

    // 📝 Publish Modal State
    const [isPublishModalOpen, setIsPublishModalOpen] = React.useState(false);

    // 💾 Chat History State
    const [sessionId, setSessionId] = React.useState<string>('');
    const { user } = useUser();
    const userData = useQuery(api.user.GetUser, user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : 'skip');

    // Chat history mutations and queries
    const saveMessageMutation = useMutation(api.chatHistory.saveMessage);
    const clearSessionMutation = useMutation(api.chatHistory.clearSession);
    const sessionHistory = useQuery(
        api.chatHistory.getSessionHistory,
        sessionId && userData?._id && agentId
            ? { agentId: agentId as string, sessionId, userId: userData._id }
            : 'skip'
    );

    // �📜 Auto-scroll to bottom of chat
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 🧩 Generate workflow once agent data is loaded
    React.useEffect(() => {
        if (agentData) {
            GenerateWorkflow()
        }
    }, [agentData])

    // 🚀 Generate Tool Config once workflow config is ready
    React.useEffect(() => {
        if (config && !toolConfig) {
            GenerateToolConfig(config)
        }
    }, [config])

    // 🆔 Initialize session ID on mount
    React.useEffect(() => {
        const storedSessionId = sessionStorage.getItem(`chat-session-${agentId}`);
        if (storedSessionId) {
            setSessionId(storedSessionId);
        } else {
            const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem(`chat-session-${agentId}`, newSessionId);
            setSessionId(newSessionId);
        }
    }, [agentId]);

    // 📚 Load chat history when session is ready
    React.useEffect(() => {
        if (sessionHistory && sessionHistory.length > 0 && messages.length === 0) {
            const loadedMessages: ChatMessage[] = sessionHistory.map((msg: any) => ({
                id: msg.id,
                role: msg.role as 'user' | 'agent' | 'system',
                content: msg.content
            }));
            setMessages(loadedMessages);
        }
    }, [sessionHistory]);

    // 📡 Call API to generate tool config
    const GenerateToolConfig = async (inputConfig: any, silent = true) => {
        if (!silent) setIsRebooting(true);
        try {
            const result = await fetch('/api/generate-agent-tool-config', {
                method: 'POST',
                body: JSON.stringify({ jsonConfig: inputConfig }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const text = await result.text();

            if (!result.ok) {
                // Check if response is JSON before parsing
                let errData: any = { error: 'Unknown Error' };
                try {
                    const contentType = result.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        errData = JSON.parse(text);
                    } else {
                        // HTML or other non-JSON response
                        errData = { error: `Server Error (${result.status}): ${result.statusText}` };
                        console.error('Non-JSON error response:', text.substring(0, 200));
                    }
                } catch (parseErr) {
                    console.error('Failed to parse error response:', parseErr);
                }
                toast.error(`Reboot Failed: ${errData.error || result.statusText}`);
                setIsRebooting(false);
                return null;
            }

            if (!text) {
                console.error(`API Error (${result.status}): Empty response body`);
                return null;
            }

            try {
                const data = JSON.parse(text);
                console.log("🤖 AI Tool Config:", data);

                if (data._fallback) {
                    toast.info("Groq limit reached. Using OpenAI safety net for configuration.");
                }

                setToolConfig(data);

                // 💾 Save to DB if manually triggered
                if (!silent && agentData?._id) {
                    await updateAgent({
                        id: agentData._id,
                        agentToolConfig: data
                    });
                }
                return data;
            } catch (err) {
                console.error("Failed to parse JSON. Raw Text:", text);
                return null;
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            return null;
        } finally {
            if (!silent) setIsRebooting(false);
        }
    }

    // 🔄 Manual Reboot Handler
    const handleReboot = async () => {
        if (config) {
            await GenerateToolConfig(config, false);
        }
    }

    // 📩 Send Message Logic
    const handleSendMessage = async () => {
        if (!userInput.trim() || !toolConfig) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: userInput
        };

        setMessages(prev => [...prev, userMsg]);
        setUserInput('');
        setIsTyping(true);

        // 💾 Save user message to database if chat history is enabled
        const chatHistoryEnabled = toolConfig?.agents?.some((agent: any) => agent.includeChatHistory);
        if (chatHistoryEnabled && userData?._id && sessionId) {
            try {
                await saveMessageMutation({
                    agentId: agentId as string,
                    sessionId,
                    userId: userData._id,
                    message: {
                        id: userMsg.id,
                        role: userMsg.role,
                        content: userMsg.content,
                        timestamp: Date.now()
                    }
                });
            } catch (error) {
                console.error("Failed to save user message:", error);
            }
        }

        try {
            const response = await fetch('/api/chat-with-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    toolConfig: toolConfig
                })
            });

            const data = await response.json();

            if (data._fallback) {
                toast.info("Groq limit reached. Switched to OpenAI for this response.");
            }

            // Handle both successful replies and error responses
            const agentContent = data.reply || data.error || "I apologize, but I couldn't generate a response. Please try again.";

            const agentMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: data.error ? 'system' : 'agent',
                content: agentContent
            };

            setMessages(prev => [...prev, agentMsg]);

            // 💾 Save agent message to database if chat history is enabled
            if (chatHistoryEnabled && userData?._id && sessionId && !data.error) {
                try {
                    await saveMessageMutation({
                        agentId: agentId as string,
                        sessionId,
                        userId: userData._id,
                        message: {
                            id: agentMsg.id,
                            role: agentMsg.role,
                            content: agentMsg.content,
                            timestamp: Date.now()
                        }
                    });
                } catch (error) {
                    console.error("Failed to save agent message:", error);
                }
            }

            // Show error toast if there was an error
            if (data.error) {
                toast.error("Agent Error: " + data.error);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'system',
                content: "Error: Failed to get response from agent."
            }]);
        } finally {
            setIsTyping(false);
        }
    }

    // 🗑️ Clear Chat History
    const handleClearHistory = async () => {
        if (!userData?._id || !sessionId) return;

        try {
            await clearSessionMutation({
                agentId: agentId as string,
                sessionId,
                userId: userData._id
            });
            setMessages([]);
            toast.success("Chat history cleared!");
        } catch (error) {
            console.error("Failed to clear history:", error);
            toast.error("Failed to clear history");
        }
    }

    // ⚙️ Generate workflow config (node/edge relationship)
    const GenerateWorkflow = () => {
        if (!agentData) return;

        // 🧩 Build Edge Map for quick source → target lookup
        const edgeMap = (agentData?.edges || [])?.reduce((acc: any, edge: any) => {
            if (!acc[edge.source]) acc[edge.source] = [];
            acc[edge.source].push(edge);
            return acc;
        }, {});

        // 🔄 Build flow array by mapping each node
        const flow = (agentData?.nodes || [])?.map((node: any) => {
            const connectedEdges = edgeMap[node.id] || [];
            let next: any = null;

            switch (node.type) {
                // Compass Conditional branching node with "if" and "else"
                case "IfElseNode": {
                    const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
                    const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");

                    next = {
                        if: ifEdge?.target || null,
                        else: elseEdge?.target || null,
                    };
                    break;
                }

                // Brain Agent or AI Node
                case "AgentNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    } else if (connectedEdges.length > 1) {
                        next = connectedEdges.map((e: any) => e.target);
                    }
                    break;
                }

                // Link API Call Node
                case "ApiNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    }
                    break;
                }

                // Check User Approval Node (manual checkpoint)
                case "UserApprovalNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    }
                    break;
                }

                // Rocket Start Node
                case "StartNode": {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    }
                    break;
                }

                // Flag End Node
                case "EndNode": {
                    next = null; // No next node
                    break;
                }

                // Wrench Default handling for any unknown node type
                default: {
                    if (connectedEdges.length === 1) {
                        next = connectedEdges[0].target;
                    } else if (connectedEdges.length > 1) {
                        next = connectedEdges.map((e: any) => e.target);
                    }
                    break;
                }
            }

            // Brick Return a simplified node configuration
            return {
                id: node.id,
                type: node.type,
                label: node.data?.label || node.type,
                settings: node.data || {},
                next,
            };
        });

        // Target Find the Start Node
        const startNode = agentData?.nodes?.find((n: any) => n.type === "StartNode");

        // Brick Final Config structure
        const config = {
            startNode: startNode?.id || null,
            flow,
        };

        console.log("✅ Generated Workflow Config:", config);
        setConfig(config);
    }

    return (
        <div className='h-screen w-full flex flex-col bg-[#0a0a0f]'>
            {/* Header */}
            <div className='h-16 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl'>
                {/* Left: Back Navigation */}
                <div className='flex items-center gap-4'>
                    <Link
                        href={`/agent-builder/${agentId}`}
                        className='group flex items-center justify-center w-10 h-10 hover:bg-primary/10 border border-white/5 hover:border-primary/30 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    >
                        <ChevronLeft className='h-5 w-5 text-gray-400 group-hover:text-primary transition-colors' />
                    </Link>
                    <h1 className='text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500'>
                        {agentData?.name || 'Loading...'}
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className='flex items-center gap-3'>
                    <Button
                        variant='outline'
                        onClick={handleReboot}
                        disabled={isRebooting || !config}
                        className='gap-2 bg-primary/10 hover:bg-primary/15 text-primary hover:text-cyan-300 border border-primary/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all font-semibold rounded-xl px-4'
                    >
                        <RefreshCw className={`w-4 h-4 ${isRebooting ? 'animate-spin' : ''}`} />
                        {isRebooting ? 'Rebooting...' : 'Reboot Agent'}
                    </Button>

                    <Button
                        variant='ghost'
                        onClick={() => setIsPublishModalOpen(true)}
                        className='gap-2 text-gray-300 font-medium hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl active:scale-95 transition-all'
                    >
                        <Code2 className='w-4 h-4' />
                        Code
                    </Button>

                    <Link href={`/agent-builder/${agentId}`}>
                        <Button className='gap-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 hover:border-white/20 rounded-xl font-medium shadow-sm transition-all'>
                            <X className='w-4 h-4' />
                            Close preview
                        </Button>
                    </Link>

                    <Button
                        onClick={() => setIsPublishModalOpen(true)}
                        className='gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 transition-all px-5'
                    >
                        Publish
                    </Button>
                </div>
            </div>

            {/* Publish Modal */}
            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                toolConfig={toolConfig}
                agentName={agentData?.name || "AI Agent"}
            />

            {/* Preview Content Area - 3:2 Split */}
            <div className='flex-1 flex overflow-hidden'>
                {/* Left Side: Graph (60%) */}
                <div className='flex-[3] relative border-r border-white/5 bg-black/20 backdrop-blur-sm'>
                    {agentData ? (
                        <ReactFlowProvider>
                            <ReactFlow
                                nodes={agentData.nodes || []}
                                edges={agentData.edges || []}
                                nodeTypes={nodeTypes}
                                nodesDraggable={true}
                                nodesConnectable={false}
                                elementsSelectable={false}
                                fitView
                                proOptions={{ hideAttribution: true }}
                            >
                                <Background color='#06b6d4' variant={'dots' as any} gap={20} size={1} />
                                <Controls className='bg-black/40 backdrop-blur-xl border-white/10 [&_button]:bg-white/5 [&_button]:border-white/10 [&_button]:text-gray-300 [&_button:hover]:bg-primary/20 [&_button:hover]:text-primary' />
                                <MiniMap
                                    style={{
                                        backgroundColor: '#0a0a0f',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    maskColor="rgba(0, 0, 0, 0.2)"
                                    nodeColor={(n) => {
                                        if (n.type === 'StartNode') return '#06b6d4';
                                        if (n.type === 'AgentNode') return '#3b82f6';
                                        if (n.type === 'ApiNode') return '#eab308';
                                        return '#6b7280';
                                    }}
                                />
                            </ReactFlow>
                        </ReactFlowProvider>
                    ) : (
                        <div className='flex items-center justify-center h-full'>
                            <div className='animate-pulse flex flex-col items-center gap-2'>
                                <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
                                <p className='text-gray-400 font-medium'>Loading Agent...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Chat UI (40%) */}
                <div className='flex-[2] bg-[#0a0a0f] flex flex-col relative overflow-hidden'>
                    {/* Chat Header */}
                    <div className='p-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl'>
                        <div className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]'></div>
                            <span className='text-sm font-semibold text-gray-300'>Agent Active</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            {toolConfig?.agents?.some((agent: any) => agent.includeChatHistory) && messages.length > 0 && (
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={handleClearHistory}
                                    className='text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors'
                                >
                                    Clear History
                                </Button>
                            )}
                            {toolConfig && (
                                <span className='text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium border border-primary/20'>
                                    Groq Powered
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Message Area */}
                    <div
                        ref={scrollRef}
                        className='flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth'
                    >
                        {messages.length === 0 && (
                            <div className='h-full flex flex-col items-center justify-center text-center p-8'>
                                <div className='w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]'>
                                    <Send className='w-8 h-8 text-primary' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-200 mb-1'>Ready to assist</h3>
                                <p className='text-sm text-gray-500 max-w-[200px]'>
                                    Send a message to start interacting with your AI agent.
                                </p>
                            </div>
                        )}

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-lg transition-all whitespace-pre-line ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                        : msg.role === 'system'
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 italic backdrop-blur-sm'
                                            : 'bg-white/5 backdrop-blur-sm text-gray-200 rounded-tl-none border border-white/10'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className='flex justify-start'>
                                <div className='bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-lg'>
                                    <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                    <div className='w-1.5 h-1.5 bg-primary rounded-full animate-bounce'></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className='p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl'>
                        <div className='relative flex items-center gap-2'>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={!toolConfig ? "Analyzing workflow..." : "Ask your agent anything..."}
                                disabled={!toolConfig || isTyping}
                                className='flex-1 h-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-4 pr-12 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all'
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!toolConfig || isTyping || !userInput.trim()}
                                className='absolute right-2 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all disabled:opacity-30 disabled:hover:from-blue-600 disabled:hover:to-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            >
                                {isTyping ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
                            </button>
                        </div>
                        <p className='text-[10px] text-gray-500 mt-2 text-center uppercase tracking-widest font-bold opacity-60'>
                            Agent Preview Instance
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreviewAgent