"use client";
import React from 'react'
import Header from '../_component/Header'
import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap, reconnectEdge, useReactFlow, ReactFlowProvider, Panel, useOnSelectionChange } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import StartNode from '../_component/StartNode';
import AgentNode from '../_component/AgentNode';
import EndNode from '../_component/EndNode';
import IfElseNode from '../_component/IfElseNode';
import WhileNode from '../_component/WhileNode';
import UserApprovalNode from '../_component/UserApprovalNode';
import ApiNode from '../_component/ApiNode';
import ToolPanel from '../_component/ToolPanel';
import SettingPannel from '../_component/SettingPannel';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { UpdateAgentDetail } from '@/convex/agent';

const initialNodes = [
    { id: 'n1', position: { x: 100, y: 100 }, data: { label: 'Node 1' }, type: 'StartNode' },
    { id: 'n2', position: { x: 400, y: 100 }, data: { label: 'Node 2' }, type: 'AgentNode' },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const nodeTypes = {
    StartNode: StartNode,
    AgentNode: AgentNode,
    EndNode: EndNode,
    IfElseNode: IfElseNode,
    WhileNode: WhileNode,
    UserApprovalNode: UserApprovalNode,
    ApiNode: ApiNode
};

function AgentBuilderPage() {
    return (
        <ReactFlowProvider>
            <AgentBuilderContent />
        </ReactFlowProvider>
    );
}

function AgentBuilderContent() {
    const { agentId } = useParams();
    const agentData = useQuery(api.agent.getAgentById, { agentId: agentId as string });
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [isMounted, setIsMounted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const UpdateAgentDetail = useMutation(api.agent.UpdateAgentDetail);
    const edgeReconnectSuccessful = useRef(true);

    const [selectedNode, setSelectedNode] = useState<any>(null);

    useOnSelectionChange({
        onChange: ({ nodes }) => {
            const node = nodes[0];
            if (node) {
                // Ensure selected is true for verification
                const nodeWithSelection = { ...node, selected: true };
                console.log("Selected Node:", nodeWithSelection);
                setSelectedNode(nodeWithSelection);
            } else {
                setSelectedNode(null);
            }
        },
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const { screenToFlowPosition, setViewport, fitView } = useReactFlow();

    useEffect(() => {
        if (agentData) {
            console.log("Hydrating Flow Data from DB:", agentData);
            if (agentData.nodes) {
                const hydratedNodes = agentData.nodes.map((node: any) => ({
                    ...node,
                    data: {
                        ...node.data,
                        name: node.data.name || agentData.name // Default to agent name if missing
                    }
                }));
                setNodes(hydratedNodes);
            }
            // Specifically check if edges exist in DB (even if empty array) to avoid overwriting with initialEdges if DB has saved data
            if (agentData.edges !== undefined) setEdges(agentData.edges);

            // Set centered and appropriately zoomed view when agent is opened
            setTimeout(() => {
                fitView({ duration: 800, maxZoom: 0.6 });
            }, 50);
        }
    }, [agentData, fitView]);

    const SaveNodesAndEdges = async () => {
        if (!agentData?._id) return;
        setIsSaving(true);
        try {
            const result = await UpdateAgentDetail({
                id: agentData._id,
                nodes,
                edges,
            });
            toast.success("Flow saved successfully!");
            console.log("Saved Nodes:", nodes.length, "Edges:", edges.length);
            console.log(result);
        } catch (error) {
            toast.error("Failed to save flow");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => {
            const updatedEdges = addEdge(params, eds);
            console.log(updatedEdges);
            return updatedEdges;
        }),
        [setEdges]
    );

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge: any, newConnection: any) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_: any, edge: any) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeReconnectSuccessful.current = true;
    }, []);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: {
                    label: `${type} node`,
                    name: agentData?.name // Default new node name to agent name
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes, agentData] // Added agentData dependency
    );

    return (
        <div className='h-screen flex flex-col bg-gradient-to-br from-[oklch(0.08_0.02_240)] via-[oklch(0.1_0.03_240)] to-[oklch(0.08_0.02_240)]'>
            <Header agentName={agentData?.name} agentId={agentId as string} />
            <div className='flex-1 flex w-full overflow-hidden'>
                <ToolPanel />
                <div className='flex-1 h-full relative'>
                    {isMounted ? (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            deleteKeyCode={['Backspace', 'Delete']}
                            defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
                            minZoom={0.1}
                            maxZoom={2}
                            colorMode='dark'
                            nodeTypes={nodeTypes}
                        >
                            <MiniMap
                                className='!bg-black/40 !border !border-white/10 !rounded-xl'
                                maskColor='rgba(0, 0, 0, 0.6)'
                                nodeColor={(node) => {
                                    switch (node.type) {
                                        case 'StartNode': return '#60a5fa';
                                        case 'AgentNode': return '#34d399';
                                        case 'EndNode': return '#fb7185';
                                        case 'IfElseNode': return '#fbbf24';
                                        case 'WhileNode': return '#818cf8';
                                        case 'UserApprovalNode': return '#c084fc';
                                        case 'ApiNode': return '#22d3ee';
                                        default: return '#6b7280';
                                    }
                                }}
                            />
                            <Background className='!bg-transparent' gap={16} size={1} color='rgba(255, 255, 255, 0.05)' />
                            <Controls className='!bg-black/40 !border !border-white/10 !rounded-xl [&>button]:!bg-black/20 [&>button]:!border-white/5 [&>button:hover]:!bg-primary/20 [&>button]:!text-gray-300' />
                            <Panel position="top-right">
                                <button
                                    onClick={SaveNodesAndEdges}
                                    disabled={isSaving}
                                    className="bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 px-6 py-3 rounded-xl font-semibold shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Flow"}
                                </button>
                            </Panel>
                        </ReactFlow>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className='flex flex-col items-center gap-3'>
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-gray-400 font-medium">Loading workspace...</p>
                            </div>
                        </div>
                    )}
                    <SettingPannel selectedNode={selectedNode} setNodes={setNodes} onSave={SaveNodesAndEdges} agentName={agentData?.name} />
                </div>
            </div>
        </div >
    )
}

export default AgentBuilderPage;
