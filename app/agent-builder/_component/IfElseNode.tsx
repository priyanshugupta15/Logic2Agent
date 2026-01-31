"use client";
import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Split } from 'lucide-react'

interface IfElseNodeProps {
    selected?: boolean;
}

function IfElseNode({ selected }: IfElseNodeProps) {
    return (
        <div className={`flex flex-col gap-2 bg-white dark:bg-gray-900 border-2 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md ${selected ? 'border-yellow-500 shadow-yellow-500/20' : 'border-yellow-500'}`}>
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
                    <h2 className='text-lg font-bold'>If/Else</h2>
                </div>
            </div>

            <div className='mt-2 space-y-2'>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-semibold text-green-600">IF</span>
                    <input
                        className='w-full bg-transparent text-sm focus:outline-none nodrag'
                        placeholder='Condition...'
                    />
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-semibold text-red-500">ELSE</span>
                    <input
                        className='w-full bg-transparent text-sm focus:outline-none nodrag'
                        placeholder='Condition...'
                    />
                </div>
            </div>

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
