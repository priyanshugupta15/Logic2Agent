import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { ThumbsUp } from 'lucide-react'

function UserApprovalNode() {
    return (
        <div className='flex items-center gap-3 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-xl p-4 shadow-sm min-w-[150px] relative transition-all hover:shadow-md'>
            <Handle
                type="target"
                position={Position.Left}
                className="w-3 h-3 !bg-purple-500 border-2 border-white dark:border-gray-900"
            />
            <div className='w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center'>
                <ThumbsUp className='h-6 w-6 text-purple-500' />
            </div>
            <div>
                <p className='text-xs text-gray-500 font-medium uppercase tracking-wider'>Human</p>
                <h2 className='text-lg font-bold'>Approval</h2>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 !bg-purple-500 border-2 border-white dark:border-gray-900"
            />
        </div>
    )
}
export default UserApprovalNode
