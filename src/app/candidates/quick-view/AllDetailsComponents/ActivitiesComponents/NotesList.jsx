import React from 'react';
import { MoreVertical, Pin, Trash2 } from 'lucide-react';
import RecordSearchPopup from '../RecordSearchPopup';
import NoteComments from './NoteComments';

function NotesList({  addNote,  openMenu,  setOpenMenu,  togglePinNote,  handleDeleteNote,  handleUpdateSingleNote,  getCurrentYearandMonthName }) {
  return (
    <div className='max-w-5xl mx-auto space-y-4'>
      <h2 className='font-semibold text-sm text-gray-700'>{getCurrentYearandMonthName()}</h2>
      {addNote.length === 0 ? (
        <div className='text-sm text-gray-500 py-8 text-center'>No notes yet. Click "Add Note" to create one.</div>
      ) : (
        addNote.map((item) => (
          <div key={item.id} className={`rounded p-2 bg-white ${item.isPinned ? "border border-blue-500 shadow-sm" : "border border-gray-200"}`}>
            <div className='cursor-pointer flex items-center justify-between p-1'>
              <div className='w-fit rounded px-2 bg-blue-200 text-blue-700 text-sm tracking-wide'>Note</div>
              <div className='flex items-center gap-5'>
                {item.isPinned && (
                  <Pin size={13} className='fill-blue-600 text-blue-600 rotate-45' />
                )}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                    className="p-1 border border-gray-100 hover:bg-gray-100 bg-gray-50 cursor-pointer"
                  >
                    <MoreVertical size={12} />
                  </button>

                  {openMenu === item.id && (
                    <div className="absolute right-0 top-7 z-50 w-40 bg-white rounded shadow-lg border border-gray-100 py-2">
                      <button
                        type="button"
                        onClick={() => togglePinNote(item.id)}
                        className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-indigo-500 hover:bg-gray-50 cursor-pointer"
                      >
                        <Pin size={15} className={`${item.isPinned ? "fill-indigo-500" : ""}`} />
                        <span>{item.isPinned ? "Unpin" : "Pin to Top"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(item.id)}
                        className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 cursor-pointer"
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className=''>
              <span className='text-[13px] pl-1.5 text-gray-700'>{item.text}</span>
            </div>

            <div className='flex items-center justify-between text-[11px] pl-1 mt-2 text-gray-700 border-t border-b border-gray-100 py-1'>
              <span>Note Added By: {item.addedBy}</span>
              <div className='flex items-center gap-7'>
                <span>
                  Date Added: {new Date(item.dateAdded).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                  })}
                </span>
                <span className='mb-1.5'><RecordSearchPopup /></span>
              </div>
            </div>

            {/* Comments Component */}
            <NoteComments item={item} onUpdateNote={handleUpdateSingleNote} />

          </div>
        ))
      )}
    </div>
  );
}

export default NotesList;