"use client";
import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Repeat } from 'lucide-react'

interface WhileNodeProps {
    selected?: boolean;
}

function WhileNode({ selected }: WhileNodeProps) {
    return (
        <div className={`flex flex-col gap-2 bg-white dark:bg-gray-900 border-2 rounded-xl p-4 shadow-sm min-w-[200px] relative transition-all hover:shadow-md ${selected ? 'border-blue-500 shadow-blue-500/20' : 'border-blue-500'}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-blue-500 border-2 border-white dark:border-gray-900"
            />

            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0'>
                    <Repeat className='h-6 w-6 text-blue-500' />
                </div>
                <div>
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Loop</p>
                    <h2 className='text-lg font-bold'>While</h2>
                </div>
            </div>

            {selected && (
                <div className='mt-2 animate-in fade-in zoom-in-95 duration-200'>
                    <input
                        className='w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 nodrag'
                        placeholder='While Condition'
                    />
                </div>
            )}

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-blue-500 border-2 border-white dark:border-gray-900"
            />
        </div>
    )
}
export default WhileNode
