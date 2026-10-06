import UseableWriteComment from './UseableWriteComment'

function ReplyItem({
  reply,
  commentId,
  replyToId,
  setReplyToId,
  editorKey,
  handleCommentChange,
  handleCancel,
  handleSaveReply
}) {
  return (
    <div className='group ml-6 mt-3'>
      <div className='flex items-start justify-between'>
        <div className='flex gap-3.5 w-full'>
          <div className='h-7 w-7 flex-shrink-0 flex items-center justify-center bg-slate-200 rounded-full text-[10px] font-medium text-gray-800'>
            {reply.avatar}
          </div>

          <div className='w-full'>
            <div className='flex items-center gap-3.5'>
              <span className='text-[11px] font-bold text-gray-800'>
                {reply.author}
              </span>
              <span className='text-[10px] font-bold text-gray-600'>
                {reply.timeAtSave}
              </span>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: reply.text
              }}
              className='text-[12px] ml-1.5 font-medium text-gray-800'
            />

            <button
              onClick={() => setReplyToId(reply.id)}
              className='cursor-pointer font-bold ml-1.5 text-indigo-600 text-[11px]'
            >
              Reply
            </button>

            {replyToId === reply.id && (
              <UseableWriteComment
                editorKey={editorKey}
                handleCommentChange={handleCommentChange}
                handleCancel={handleCancel}
                handleSaveComment={handleSaveReply}
              />
            )}

            {(reply.replies || []).map((nestedReply) => (
              <ReplyItem
                key={nestedReply.id}
                reply={nestedReply}
                commentId={commentId}
                replyToId={replyToId}
                setReplyToId={setReplyToId}
                editorKey={editorKey}
                handleCommentChange={handleCommentChange}
                handleCancel={handleCancel}
                handleSaveReply={handleSaveReply}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReplyItem