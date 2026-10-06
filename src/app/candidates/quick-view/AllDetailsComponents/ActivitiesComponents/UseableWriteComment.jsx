import React from 'react'
import RichTextToolbar from '../RichTextToolbar'

function UseableWriteComment({
    handleSaveComment,
    handleCancel,
    handleCommentChange,
    editorKey,
    initialContent = ''
}) {
    return (
        <div>
            <div className='flex gap-5 mt-2.5'>

                <div className='h-7 w-7 flex items-center justify-center border border-gray-50 mt-1 bg-slate-200 rounded-[100%] text-[10px] font-medium text-gray-800'>
                    MS
                </div>

                <div className='w-full'>

                    <RichTextToolbar
                        key={editorKey}
                        onContentChange={handleCommentChange}
                        placeholder="Start typing to leave a comment...@ mention to notify users"
                        height='h-[40px]'
                        initialContent={initialContent}
                    />

                    <div className='flex items-center gap-4 mt-3'>

                        <button
                            onClick={handleSaveComment}
                            className='px-3 py-1 font-bold bg-indigo-500 hover:bg-indigo-700 cursor-pointer leading-relaxed rounded text-white text-[11px]'
                        >
                            {initialContent ? "Update" : "Save"}
                        </button>

                        <button
                            onClick={handleCancel}
                            className='text-sm font-medium text-gray-700 cursor-pointer hover:underline'
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default UseableWriteComment