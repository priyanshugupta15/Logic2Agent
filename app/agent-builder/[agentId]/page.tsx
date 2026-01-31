"use client";
import React from 'react'
import Header from '../_component/Header'
import { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, MiniMap, reconnectEdge, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StartNode from '../_component/StartNode';
import AgentNode from '../_component/AgentNode';
import EndNode from '../_component/EndNode';
import IfElseNode from '../_component/IfElseNode';
import WhileNode from '../_component/WhileNode';
import UserApprovalNode from '../_component/UserApprovalNode';
import ApiNode from '../_component/ApiNode';
import ToolPanel from '../_component/ToolPanel';

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
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [isMounted, setIsMounted] = useState(false);
    const edgeReconnectSuccessful = useRef(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const { screenToFlowPosition } = useReactFlow();

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
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
                data: { label: `${type} node` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    return (
        <div className='h-screen flex flex-col'>
            <Header />
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
                            fitView
                            colorMode='system'
                            nodeTypes={nodeTypes}
                        >
                            <MiniMap />
                            <Background />
                            <Controls />
                        </ReactFlow>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-500 font-medium">Loading workspace...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AgentBuilderPage;
