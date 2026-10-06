import { MessagesSquare, Pencil, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import UseableWriteComment from './UseableWriteComment'
import ReplyItem from './ReplyItem'

function NoteComments({ item, onUpdateNote }) {
  const [showComments, setShowComments] = useState(false)
  const [newCommentText, setNewCommentText] = useState("")
  const [editorKey, setEditorKey] = useState(0)
  const [replyText, setReplyText] = useState("")
  const [replyEditorKey, setReplyEditorKey] = useState(0)
  const [replyToId, setReplyToId] = useState(null)
  const [showReplies, setShowReplies] = useState({})

  if (!item) return null

  const handleCommentChange = (value) => setNewCommentText(value)
  const handleReplyChange = (value) => setReplyText(value)

  const DateTimeAtSave = () => new Date().toLocaleString("en-US", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true
  })

  const handleSaveComment = () => {
    if (newCommentText === "") return
    const newComment = {
      id: Date.now(),
      author: "Baloch Brand",
      avatar: "BB",
      text: newCommentText,
      timeAtSave: DateTimeAtSave(),
      replies: []
    }
    const comments = [newComment, ...(item.comments || [])]
    onUpdateNote({ ...item, comments: comments })
    setNewCommentText("")
    setEditorKey(prev => prev + 1)
  }

  const handleSaveReply = () => {
    if (replyText === "") return
    const newReply = {
      id: Date.now(),
      author: "Baloch Brand",
      avatar: "BB",
      text: replyText,
      timeAtSave: DateTimeAtSave(),
      replies: []
    }
    const updateComments = (item.comments || []).map((comment) => {
      if (comment.id === replyToId) {
        const oldReply = comment.replies || []
        return { ...comment, replies: [newReply, ...oldReply] }
      }
      return comment
    })
    onUpdateNote({ ...item, comments: updateComments })
    setReplyText("")
    setReplyToId(null)
    setEditorKey(prev => prev + 1)
  }

  const handleCancel = () => {
    setNewCommentText("")
    setShowComments(false)
    setEditorKey(prev => prev + 1)
  }

  const handleReplyCancel = () => {
    setReplyText("")
    setReplyToId(null)
    setReplyEditorKey(prev => prev + 1)
  }

  return (
    <div>
      <div className='mt-1.5 ml-3'>
        <button onClick={() => setShowComments(!showComments)} className='text-blue-600 flex items-center gap-3 cursor-pointer'>
          <MessagesSquare size={13} />
          <span className='text-sm'>{showComments ? "hide Comments" : "Add Comments"}</span>
        </button>

        {showComments && (
          <div>
            <div className='mt-4 space-y-2'>
              {(item.comments || []).map((comment) => (
                <div key={comment.id} className='group hover:bg-slate-100 p-3'>
                  <div className='flex items-start justify-between w-full'>
                    <div className='flex gap-3.5 w-full'>
                      <div className='h-7 w-7 flex-shrink-0 flex items-center justify-center border border-gray-50 mt-1 bg-slate-200 rounded-full text-[10px] font-medium text-gray-800'>{comment.avatar}</div>
                      <div className='w-full'>
                        <div className='flex items-center gap-3.5'>
                          <span className='text-[11px] font-bold text-gray-800'>{comment.author}</span>
                          <span className='text-[10px] font-bold text-gray-600'>{comment.timeAtSave}</span>
                        </div>
                        <div>
                          <div dangerouslySetInnerHTML={{ __html: comment.text }} className='text-[12px] ml-1.5 font-medium text-gray-800' />
                          <div className='flex items-center gap-3 ml-1.5 mt-1'>
                            <button onClick={() => setReplyToId(comment.id)} className='cursor-pointer font-bold text-indigo-600 text-[11px]'>Reply</button>
                            {(comment.replies || []).length > 0 && (
                              <button onClick={() => setShowReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))} className='text-[11px] font-semibold text-gray-500 hover:text-indigo-600 cursor-pointer'>
                                {showReplies[comment.id] ? "Hide Replies" : `Show ${comment.replies.length} ${comment.replies.length === 1 ? "Reply" : "Replies"}`}
                              </button>
                            )}
                          </div>

                          {replyToId === comment.id && (
                            <UseableWriteComment editorKey={replyEditorKey} handleCommentChange={handleReplyChange} handleCancel={handleReplyCancel} handleSaveComment={handleSaveReply} />
                          )}

                          {showReplies[comment.id] && (
                            <div>
                              {(comment.replies || []).map((reply) => (
                                <ReplyItem key={reply.id} reply={reply} commentId={comment.id} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-4'>
              <UseableWriteComment handleSaveComment={handleSaveComment} handleCancel={handleCancel} handleCommentChange={handleCommentChange} editorKey={editorKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NoteComments