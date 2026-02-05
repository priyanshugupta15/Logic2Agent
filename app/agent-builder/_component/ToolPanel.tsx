import React from 'react'
import { Bot, Square, StickyNote, FileSearch, ShieldCheck, Blocks, Split, Repeat, ThumbsUp, Shuffle, Database, Cloud, Play } from 'lucide-react'

interface ToolItem {
    name: string;
    type: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    color: string;
    bgColor: string;
    beta?: boolean;
}

interface ToolCategory {
    category: string;
    tools: ToolItem[];
}

const toolCategories: ToolCategory[] = [
    {
        category: 'Core',
        tools: [
            {
                name: 'Start',
                type: 'StartNode',
                icon: Play,
                description: 'Begin the workflow',
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/10'
            },
            {
                name: 'Agent',
                type: 'AgentNode',
                icon: Bot,
                description: 'AI model to process data',
                color: 'text-emerald-400',
                bgColor: 'bg-emerald-500/10'
            },
            {
                name: 'End',
                type: 'EndNode',
                icon: Square,
                description: 'Terminate the workflow',
                color: 'text-rose-400',
                bgColor: 'bg-rose-500/10'
            }
        ]
    },
    {
        category: 'Tools',
        tools: [
            {
                name: 'API',
                type: 'ApiNode',
                icon: Cloud,
                description: 'Call external services',
                color: 'text-cyan-400',
                bgColor: 'bg-cyan-500/10'
            }
        ]
    },
    {
        category: 'Logic',
        tools: [
            {
                name: 'If / Else',
                type: 'IfElseNode',
                icon: Split,
                description: 'Conditional branching',
                color: 'text-amber-400',
                bgColor: 'bg-amber-500/10'
            },
            {
                name: 'While',
                type: 'WhileNode',
                icon: Repeat,
                description: 'Loop through data',
                color: 'text-indigo-400',
                bgColor: 'bg-indigo-500/10'
            },
            {
                name: 'User Approval',
                type: 'UserApprovalNode',
                icon: ThumbsUp,
                description: 'Wait for user input',
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/10'
            }
        ]
    }
]

function ToolPanel() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className='w-80 border-r border-white/5 bg-black/40 backdrop-blur-xl p-5 flex flex-col gap-6 overflow-y-auto'>
            <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                    <div className='bg-primary/10 border border-primary/20 p-1.5 rounded-lg'>
                        <Blocks className='h-4 w-4 text-primary' />
                    </div>
                    <h2 className='text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'>
                        Agent Tools
                    </h2>
                </div>
                <p className='text-sm text-gray-400 pl-1'>Drag and drop nodes to the canvas</p>
            </div>

            {toolCategories.map((category, catIndex) => (
                <div key={catIndex} className='flex flex-col gap-3'>
                    <h3 className='text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1'>
                        {category.category}
                    </h3>
                    <div className='flex flex-col gap-2.5'>
                        {category.tools.map((tool, index) => (
                            <div
                                key={index}
                                className='group flex items-center gap-3 p-3.5 border border-white/5 rounded-xl cursor-grab active:cursor-grabbing hover:border-primary/30 hover:bg-primary/5 transition-all bg-black/20 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                onDragStart={(event) => onDragStart(event, tool.type)}
                                draggable
                            >
                                <div className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-white/5`}>
                                    <tool.icon className={`h-5 w-5 ${tool.color}`} />
                                </div>
                                <div className='flex flex-col flex-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-semibold text-sm text-gray-200'>{tool.name}</span>
                                        {tool.beta && (
                                            <span className='text-[9px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border border-violet-500/30'>Beta</span>
                                        )}
                                    </div>
                                    <p className='text-[11px] text-gray-500 leading-tight mt-0.5'>{tool.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </aside>
    )
}

export default ToolPanel
