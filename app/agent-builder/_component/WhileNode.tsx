import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Repeat } from 'lucide-react'

function WhileNode() {
    return (
        <div className='flex items-center gap-3 bg-white dark:bg-gray-900 border-2 border-blue-500 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md'>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-blue-500 border-2 border-white dark:border-gray-900"
            />
            <div className='w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center'>
                <Repeat className='h-6 w-6 text-blue-500' />
            </div>
            <div>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Loop</p>
                <h2 className='text-lg font-bold'>While</h2>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-blue-500 border-2 border-white dark:border-gray-900"
            />
        </div>
    )
}
export default WhileNode
