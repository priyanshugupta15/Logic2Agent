"use client";
import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { MousePointer2 } from 'lucide-react'

interface AgentNodeProps {
    selected?: boolean;
}

function AgentNode({ selected }: AgentNodeProps) {
    return (
        <div className={`flex items-center gap-3 bg-white dark:bg-gray-900 border-2 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md ${selected ? 'border-green-500 shadow-green-500/20' : 'border-green-500'}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-green-500 border-2 border-white dark:border-gray-900"
            />
            <div className='w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500'>
                <MousePointer2 className='h-6 w-6' />
            </div>
            <div>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Action</p>
                <h2 className='text-lg font-bold'>Agent</h2>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-green-500 border-2 border-white dark:border-gray-900"
            />
        </div>
    )
}
export default AgentNode
