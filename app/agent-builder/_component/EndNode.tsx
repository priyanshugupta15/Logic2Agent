"use client";
import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Square } from 'lucide-react'

function EndNode() {
    return (
        <div className='flex items-center gap-3 bg-white dark:bg-gray-900 border-2 border-red-500 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md'>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-red-500 border-2 border-white dark:border-gray-900"
            />
            <div className='w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center'>
                <Square className='h-6 w-6 text-red-500' />
            </div>
            <div>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Flow</p>
                <h2 className='text-lg font-bold'>End</h2>
            </div>
        </div>
    )
}
export default EndNode
