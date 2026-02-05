"use client";

import { Separator } from '@radix-ui/react-separator';
import { MousePointer2, Settings2, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface SettingPannelProps {
    selectedNode: any;
    setNodes: any;
    onSave: () => void;
    agentName?: string;
}

function SettingPannel({ selectedNode, setNodes, onSave, agentName }: SettingPannelProps) {
    const [inputs, setInputs] = useState<any>({});

    useEffect(() => {
        console.log("SettingPannel Received Node:", selectedNode);
        if (selectedNode) {
            const initialData = { ...selectedNode.data };
            // Default name to agentName if not present
            if (!initialData.name && agentName) {
                initialData.name = agentName;
            }
            setInputs(initialData);
        }
    }, [selectedNode, agentName]);

    const handleInputChange = (key: string, value: any) => {
        const newInputs = { ...inputs, [key]: value };
        setInputs(newInputs);
        setNodes((nodes: any) =>
            nodes.map((node: any) =>
                node.id === selectedNode.id
                    ? { ...node, data: newInputs }
                    : node
            )
        );
    };

    if (!selectedNode || selectedNode.type === 'StartNode') {
        return null;
    }

    return (
        <div className='absolute top-0 right-0 bottom-0 z-20 w-[380px] bg-black/60 backdrop-blur-xl border-l border-white/5 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl'>
            {/* Header */}
            <div className='p-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-sm'>
                <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 border border-primary/20 p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)]'>
                        <Settings2 className='w-5 h-5 text-primary' />
                    </div>
                    <div>
                        <h2 className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'>{selectedNode.type}</h2>
                        <p className='text-xs text-gray-500'>ID: {selectedNode.id}</p>
                    </div>
                </div>
            </div>

            {/* Content - Generic Settings for All Nodes */}
            <div className='flex-1 overflow-y-auto p-5'>
                <div className='space-y-6'>

                    {/* Common Settings: Name & Instructions (Available for all or specific ones? Let's keep for all as base) */}
                    {/* EndNode Specific Settings */}
                    {selectedNode.type === 'EndNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Choose the workflow output</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Output</label>
                                <textarea
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm min-h-[100px] font-mono text-gray-200 placeholder:text-gray-600'
                                    value={inputs.output || ''}
                                    onChange={(e) => handleInputChange('output', e.target.value)}
                                    placeholder='{name:string}'
                                />
                            </div>
                        </div>
                    )}

                    {/* IfElseNode Specific Settings */}
                    {selectedNode.type === 'IfElseNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Create conditions to branch your workflow</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>If</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm text-gray-200 placeholder:text-gray-600'
                                    value={inputs.condition || ''}
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    placeholder="Enter condition e.g output=='any condition'"
                                />
                            </div>
                        </div>
                    )}

                    {/* WhileNode Specific Settings */}
                    {selectedNode.type === 'WhileNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Loop your logic</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>while</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm text-gray-200 placeholder:text-gray-600'
                                    value={inputs.condition || ''}
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    placeholder="Enter condition e.g output=='any condition'"
                                />
                            </div>
                        </div>
                    )}

                    {/* UserApprovalNode Specific Settings */}
                    {selectedNode.type === 'UserApprovalNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Pause for a human to approve or reject a step</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Name</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm text-gray-200 placeholder:text-gray-600'
                                    value={inputs.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Name"
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Message</label>
                                <textarea
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm min-h-[100px] resize-none text-gray-200 placeholder:text-gray-600'
                                    value={inputs.message || ''}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    placeholder="Describe the message to show to the user"
                                />
                            </div>
                        </div>
                    )}

                    {/* ApiNode Specific Settings */}
                    {selectedNode.type === 'ApiNode' && (
                        <div className='space-y-4'>
                            <p className='text-sm text-gray-500'>Call an external API endpoint with your chosen method</p>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Name</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm text-gray-200 placeholder:text-gray-600'
                                    value={inputs.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder='API Agent Name'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Request Method</label>
                                <select
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm text-gray-200'
                                    value={inputs.method || 'GET'}
                                    onChange={(e) => handleInputChange('method', e.target.value)}
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </select>
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>API URL</label>
                                <input
                                    type="url"
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm font-mono text-gray-200 placeholder:text-gray-600'
                                    value={inputs.url || ''}
                                    onChange={(e) => handleInputChange('url', e.target.value)}
                                    placeholder='https://api.example.com/data'
                                />
                            </div>

                            <div className='flex items-center justify-between'>
                                <label className='text-sm font-semibold text-gray-300'>Include API Key</label>
                                <div
                                    className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${inputs.includeApiKey ? 'bg-primary' : 'bg-gray-700'}`}
                                    onClick={() => handleInputChange('includeApiKey', !inputs.includeApiKey)}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${inputs.includeApiKey ? 'translate-x-4' : ''}`}></div>
                                </div>
                            </div>

                            {inputs.includeApiKey && (
                                <div className='space-y-4 animate-in fade-in slide-in-from-top-2 duration-200'>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-semibold text-gray-300'>API Key Parameter Name</label>
                                        <input
                                            type="text"
                                            className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm font-mono text-gray-200 placeholder:text-gray-600'
                                            value={inputs.apiKeyParamName || 'key'}
                                            onChange={(e) => handleInputChange('apiKeyParamName', e.target.value)}
                                            placeholder='e.g., key, appid, token'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label className='text-sm font-semibold text-gray-300'>API Key Value</label>
                                        <input
                                            type="password"
                                            className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm font-mono text-gray-200 placeholder:text-gray-600'
                                            value={inputs.apiKey || ''}
                                            onChange={(e) => handleInputChange('apiKey', e.target.value)}
                                            placeholder='Enter API Key'
                                        />
                                    </div>
                                </div>
                            )}

                            {inputs.method === 'POST' && (
                                <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                                    <label className='text-sm font-semibold text-gray-300'>Body Parameters (JSON)</label>
                                    <textarea
                                        className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm min-h-[100px] font-mono text-gray-200 placeholder:text-gray-600'
                                        value={inputs.bodyParams || ''}
                                        onChange={(e) => handleInputChange('bodyParams', e.target.value)}
                                        placeholder='{ "param1": "value1", "param2": "value2" }'
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Common Settings: Name & Instructions - HIDE for EndNode, IfElseNode, WhileNode, UserApprovalNode AND ApiNode */}
                    {selectedNode.type !== 'EndNode' && selectedNode.type !== 'IfElseNode' && selectedNode.type !== 'WhileNode' && selectedNode.type !== 'UserApprovalNode' && selectedNode.type !== 'ApiNode' && (
                        <>
                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Name</label>
                                <input
                                    type="text"
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm text-gray-200 placeholder:text-gray-600'
                                    value={inputs.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder={`e.g., AI Trip Planner`}
                                />
                            </div>


                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Instructions</label>
                                <textarea
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm min-h-[100px] resize-none text-gray-200 placeholder:text-gray-600'
                                    value={inputs.instructions || ''}
                                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                                    placeholder='Instructions or Description'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-semibold text-gray-300'>Model</label>
                                <select
                                    className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm appearance-none text-gray-200'
                                    value={inputs.model || 'llama-3.3-70b-versatile'}
                                    onChange={(e) => handleInputChange('model', e.target.value)}>
                                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Restored)</option>
                                    <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
                                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                                </select>
                            </div>

                            <div className='space-y-4'>
                                <label className='text-sm font-semibold text-gray-300 block'>Output Format</label>

                                <div className='flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-lg w-fit'>
                                    <button
                                        onClick={() => handleInputChange('outputFormat', 'text')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${inputs.outputFormat === 'text' || !inputs.outputFormat
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                    >
                                        Text
                                    </button>

                                    <button
                                        onClick={() => handleInputChange('outputFormat', 'json')}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${inputs.outputFormat === 'json'
                                            ? 'bg-primary/20 text-primary border border-primary/30'
                                            : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                    >
                                        Json
                                    </button>
                                </div>

                                {inputs.outputFormat === 'json' && (
                                    <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                                        <label className='text-sm font-semibold text-gray-300'>Enter Json Schema</label>
                                        <textarea
                                            className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm min-h-[50px] font-mono text-gray-200 placeholder:text-gray-600'
                                            value={inputs.jsonSchema || ''}
                                            onChange={(e) => handleInputChange('jsonSchema', e.target.value)}
                                            placeholder='{ title: "string" }'
                                        />
                                    </div>
                                )}

                                {inputs.outputFormat === 'text' && (
                                    <div className='space-y-2 animate-in fade-in slide-in-from-top-2 duration-200'>
                                        <label className='text-sm font-semibold text-gray-300'>Output</label>
                                        <textarea
                                            className='w-full p-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none transition-all text-sm min-h-[50px] font-mono text-gray-200 placeholder:text-gray-600'
                                            value={inputs.jsonSchema || ''}
                                            onChange={(e) => handleInputChange('jsonSchema', e.target.value)}
                                            placeholder='Output will be texted here'
                                        />
                                    </div>
                                )}


                            </div>
                        </>
                    )}

                    <button
                        onClick={() => {
                            const saveData = {
                                name: inputs.name,
                                instructions: inputs.instructions,
                                includeChatHistory: inputs.includeChatHistory,
                                model: inputs.model || 'llama-3.3-70b-versatile',
                                outputFormat: inputs.outputFormat || 'text',
                                jsonSchema: inputs.jsonSchema,
                                ...inputs // include any other dynamic keys
                            };

                            console.log("--- Saving Node Settings ---");
                            console.log("Node ID:", selectedNode.id);
                            console.log("Model Selected:", saveData.model);
                            console.log("Output Format:", saveData.outputFormat);
                            console.log("Schema:", saveData.jsonSchema);
                            console.log("Full Saved Data:", saveData);

                            toast.success("Settings saved ");
                            // Trigger Database Save
                            onSave();
                        }}
                        className='w-full bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 p-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                    >
                        Save Settings
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className='p-5 border-t border-white/5 bg-black/40 backdrop-blur-sm'>
                <button
                    onClick={() => {
                        setNodes((nds: any) => nds.filter((n: any) => n.id !== selectedNode.id));
                        toast.success("Node deleted");
                    }}
                    className='w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl transition-all text-sm font-semibold shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                >
                    <Trash2 className='w-4 h-4' />
                    Delete Node
                </button>
            </div>
        </div>
    )
}

export default SettingPannel