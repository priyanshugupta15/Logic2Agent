"use client";
import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Split } from 'lucide-react'

interface IfElseNodeProps {
    selected?: boolean;
}

function IfElseNode({ selected }: IfElseNodeProps) {
    return (
        <div className={`flex flex-col gap-2 bg-white dark:bg-gray-900 border-2 rounded-xl p-4 shadow-sm min-w-[200px] relative transition-all hover:shadow-md ${selected ? 'border-yellow-500 shadow-yellow-500/20' : 'border-yellow-500'}`}>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-yellow-500 border-2 border-white dark:border-gray-900"
            />

            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center shrink-0'>
                    <Split className='h-6 w-6 text-yellow-500' />
                </div>
                <div>
                    <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Logic</p>
                    <h2 className='text-lg font-bold'>If/Else</h2>
                </div>
            </div>

            {selected && (
                <div className='mt-2 space-y-2 animate-in fade-in zoom-in-95 duration-200'>
                    <input
                        className='w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 nodrag'
                        placeholder='If Condition'
                    />
                    <input
                        className='w-full px-3 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 nodrag'
                        placeholder='Else Condition'
                    />
                </div>
            )}

            {/* True Path */}
            <Handle
                type="source"
                position={Position.Right}
                id="true"
                style={{ top: '30%' }}
                className="w-3 h-3 !bg-green-500 border-2 border-white dark:border-gray-900"
            />
            {/* False Path */}
            <Handle
                type="source"
                position={Position.Right}
                id="false"
                style={{ top: '70%' }}
                className="w-3 h-3 !bg-red-500 border-2 border-white dark:border-gray-900"
            />
        </div>
    )
}
export default IfElseNode
