import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Split } from 'lucide-react'

function IfElseNode() {
    return (
        <div className='flex items-center gap-3 bg-white dark:bg-gray-900 border-2 border-yellow-500 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md'>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-yellow-500 border-2 border-white dark:border-gray-900"
            />
            <div className='w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center'>
                <Split className='h-6 w-6 text-yellow-500' />
            </div>
            <div>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Logic</p>
                <h2 className='text-lg font-bold'>If/Else</h2>
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
