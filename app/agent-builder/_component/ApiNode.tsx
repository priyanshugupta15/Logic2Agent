"use client";
import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Cloud } from 'lucide-react'

interface ApiNodeProps {
    selected?: boolean;
}

function ApiNode({ selected }: ApiNodeProps) {
    return (
        <div className={`flex items-center gap-3 bg-white dark:bg-gray-900 border-2 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md ${selected ? 'border-cyan-500 shadow-cyan-500/20' : 'border-cyan-500'}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-cyan-500 border-2 border-white dark:border-gray-900"
            />
            <div className='w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center'>
                <Cloud className='h-6 w-6 text-cyan-500' />
            </div>
            <div>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Integration</p>
                <h2 className='text-lg font-bold'>API Call</h2>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-cyan-500 border-2 border-white dark:border-gray-900"
            />
        </div>
    )
}
export default ApiNode
