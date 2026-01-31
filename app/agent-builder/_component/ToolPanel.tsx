import React from 'react'
import { Play, Bot, MousePointer2, Square, Split, Repeat, ThumbsUp, Cloud } from 'lucide-react'

const tools = [
    {
        name: 'Agent',
        type: 'AgentNode',
        icon: MousePointer2,
        description: 'AI model to process data',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10'
    },
    {
        name: 'End',
        type: 'EndNode',
        icon: Square,
        description: 'Terminate the workflow',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10'
    },
    {
        name: 'If/Else',
        type: 'IfElseNode',
        icon: Split,
        description: 'Logical branching',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10'
    },
    {
        name: 'While',
        type: 'WhileNode',
        icon: Repeat,
        description: 'Loop through data',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        name: 'User Approval',
        type: 'UserApprovalNode',
        icon: ThumbsUp,
        description: 'Wait for user input',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10'
    },
    {
        name: 'API',
        type: 'ApiNode',
        icon: Cloud,
        description: 'Call external services',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10'
    }
]

function ToolPanel() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className='w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 flex flex-col gap-4 overflow-y-auto'>
            <div>
                <h2 className='text-lg font-bold mb-1 flex items-center gap-2'>Agent Tools</h2>
                <p className='text-sm text-gray-500 mb-4'>Drag and drop nodes to the canvas</p>
            </div>

            <div className='flex flex-col gap-3'>
                {tools.map((tool, index) => (
                    <div
                        key={index}
                        className='group flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-900 rounded-xl cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm transition-all bg-gray-50/50 dark:bg-gray-900/30'
                        onDragStart={(event) => onDragStart(event, tool.type)}
                        draggable
                    >
                        <div className={`w-10 h-10 ${tool.bgColor} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <tool.icon className={`h-6 w-6 ${tool.color}`} />
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-semibold text-sm'>{tool.name}</span>
                            <p className='text-[10px] text-gray-500 leading-tight'>{tool.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}

export default ToolPanel
