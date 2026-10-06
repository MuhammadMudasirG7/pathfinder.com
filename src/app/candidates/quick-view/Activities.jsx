import React, { useState } from 'react';
import ActivityFilter from './AllDetailsComponents/ActivitiesComponents/ActivityFilter';
import ActionHeader from './AllDetailsComponents/ActivitiesComponents/ActionHeader';
import { FilePlus2, Phone, Calendar, Mail, PlusCircleIcon } from 'lucide-react';
import AddNote from './AllDetailsComponents/AddNote';
import NotesList from './AllDetailsComponents/ActivitiesComponents/NotesList';

function Activities() {
  const tabs = ["All Activities", "Notes", "Tasks", "Calls", "Meetings", "Emails"];
  const [activeTab, setActiveTab] = useState("All Activities");
  const [searchQuery, setSearchQuery] = useState("");
  const [addNote, setAddNote] = useState([]);
  const [isAddNoteOpen, setIsNoteAddOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const getCurrentYearandMonthName = () => {
    return new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  const handleActionButton = () => {
    if (activeTab === "Notes") {
      setIsNoteAddOpen(true);
    } else {
      console.log(`Action active tab clicked: ${activeTab}`);
    }
  };

  const handleCreateNote = (noteData) => {
    const newNoteItem = {
      id: Date.now(),
      text: noteData.note || "",
      addedBy: "Sarah Jenkins",
      dateAdded: Date.now(),
      task: noteData.task,
      candidate: noteData.candidate,
      isPinned: false,
      comments: []
    };
    setAddNote([newNoteItem, ...addNote]);
    setIsNoteAddOpen(false);
  };

  const togglePinNote = (id) => {
    setAddNote(prevNotes => {
      const updatedNotes = prevNotes.map((note) => {
         if (note.id === id) {
           return {...note, isPinned: !note.isPinned}
         }
         return note;
      });
      return updatedNotes.sort((a, b) => (b.isPinned === true) - (a.isPinned === true));
    });
    setOpenMenu(null);
  };

  const handleDeleteNote = (id) => {
    setAddNote(addNote.filter(note => note.id !== id));
    setOpenMenu(null);
  };

  const handleUpdateSingleNote = (updatedNote) => {
    setAddNote(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  const getHeaderConfig = () => {
    switch (activeTab) {
      case "Notes":
        return { btnText: "Add Note", placeholder: "Search Notes", icon: FilePlus2 };
      case "Tasks":
        return { btnText: "Add Task", placeholder: "Search Tasks", icon: PlusCircleIcon };
      case "Calls":
        return { btnText: "Log Call", placeholder: "Search Calls", icon: Phone };
      case "Meetings":
        return { btnText: "Add Meeting", placeholder: "Search Meetings", icon: Calendar };
      case "Emails":
        return { btnText: "Send Email", placeholder: "Search Emails", icon: Mail };
      default:
        return { btnText: "Add Activity", placeholder: "Search Activities", icon: PlusCircleIcon };
    }
  };

  const config = getHeaderConfig();

  return (
    <div className='flex h-full bg-gray-50 overflow-hidden w-full'>
      <ActivityFilter />

      <div className='flex-1 flex flex-col h-full overflow-hidden'>
        <div className='w-full bg-white border-b border-gray-200 shrink-0'>
          <div className='flex items-center justify-center pt-3.5 space-x-12 overflow-x-auto'>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
                className={`pb-1.5 text-[13px] font-medium transition-colors relative cursor-pointer whitespace-nowrap ${activeTab === tab ? 'text-blue-800 font-semibold' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab}
                {activeTab === tab && (
                  <div className='absolute bottom-0 left-0 right-0 h-[1.5px] bg-blue-700 rounded-t' />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className='flex-1 p-6 overflow-y-auto flex flex-col'>
          <ActionHeader
            buttonText={config.btnText}
            onButtonClick={handleActionButton}
            searchPlaceholder={config.placeholder}
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            icon={config.icon}
          />

          <div className='mt-4 flex-1'>
            {activeTab === "Notes" ? (
              <NotesList 
                addNote={addNote}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                togglePinNote={togglePinNote}
                handleDeleteNote={handleDeleteNote}
                handleUpdateSingleNote={handleUpdateSingleNote}
                getCurrentYearandMonthName={getCurrentYearandMonthName}
              />
            ) : ""}
          </div>
        </div>
      </div>

      {isAddNoteOpen && (
        <AddNote onClose={() => setIsNoteAddOpen(false)} onCreateNote={handleCreateNote} />
      )}
    </div>
  );
}

export default Activities;