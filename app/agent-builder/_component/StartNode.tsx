"use client";
import React from 'react'
import { Play } from 'lucide-react'
import { Handle, Position } from '@xyflow/react'

interface StartNodeProps {
    selected?: boolean;
}

function StartNode({ selected }: StartNodeProps) {
    return (
        <div className={`flex items-center gap-3 bg-white dark:bg-gray-900 border-2 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md ${selected ? 'border-primary shadow-primary/20' : 'border-primary'}`}>
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
                <Play className='h-6 w-6 text-primary' />
            </div>
            <div>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Trigger</p>
                <h2 className='text-lg font-bold'>Start</h2>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-primary border-2 border-white dark:border-gray-900"
            />
        </div>
    )
}

export default StartNode