import React from 'react'

export default function HeaderNotification({title}) {
    return (
        <div className='border border-gray-200 bg-gray-100 px-3 py-2.5'>
            <div className='pl-2'>
                <span className='font-medium font-sans text-gray-800 text-[14px]'>{title}</span>
            </div>
        </div>
    )
}
