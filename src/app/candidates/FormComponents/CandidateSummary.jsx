import GlobalDoubleIcon from '@/components/GlobalDoubleIcon';
import React, { useRef, useState } from 'react'

function CandidateSummary({ handleChange }) {
    const [active, setActive] = useState("");
    const [isCandidateSammary, setIsCandidateSummary] = useState(true)
    const editorRef = useRef(null)

    const formatText = (command) => {
        editorRef.current.focus()
        // is se editorRef usi div pr focused kry ga us ref main enter ho jye ga 
        document.execCommand(command)
        // ye browser ka built in formating hai jis main ager user bold select kry ga to text bold etc
        setActive(active == command ? "" : command)
        handleChange(
            "CandidateSummary", editorRef.current.innerHTML
        )
    };
    const handleInput = () => {
        handleChange(
            "CandidateSummary", editorRef.current.innerHTML
        )
    }
    const handleDelete = () => {
        editorRef.current.innerHTML = "";

        handleChange("CandidateSummary", "");

        setIsCandidateSummary(false);
    }
    return (
        <>

            <GlobalDoubleIcon title={"Candidate Summary"} onToggle={() => setIsCandidateSummary(!isCandidateSammary)} isOpen={isCandidateSammary} />

            {isCandidateSammary && (
                <div className='p-4 border border-gray-300 rounded mt-3.5'>
                    <div className='flex gap-4 border border-gray-300 p-2 bg-gray-100'>
                        <button className={` font-bold px-2 border border-blue-200 rounded  ${active == "bold" ? "bg-blue-700 text-white" : "bg-gray-100 text-blue-800"}`}
                            onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("bold")}>
                            B
                        </button>
                        <button className={` font-bold px-2 border border-blue-200 rounded ${active == "italic" ? "bg-blue-700 text-white" : "bg-white text-blue-800"}`}
                            onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("italic")}>
                            I
                        </button>
                        <button className={` font-bold px-2 border border-blue-200 rounded ${active == "underline" ? "bg-blue-700 text-white" : "bg-white text-blue-800"}`}
                            onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("underline")}>
                            U
                        </button>
                        <button className={` font-bold px-2 border border-blue-200 rounded text-sm ${active == "insertUnorderedList" ? "bg-blue-700 text-white" : "bg-white text-blue-800"}`}
                            onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("insertUnorderedList")}>
                            • Bullets
                        </button>
                        <button className={` font-bold px-2 border border-blue-200 rounded text-sm ${active == "insertOrderedList" ? "bg-blue-700 text-white" : "bg-white text-blue-800"}`}
                            onMouseDown={(e) => e.preventDefault()} onClick={() => formatText("insertOrderedList")}>
                            1. Number Bullets
                        </button>
                    </div>
                    <div className='editor min-h-36.5 border border-gray-300 outline-none rounded-t px-3 py-2 text-[12px]' ref={editorRef}
                        contentEditable suppressContentEditableWarning onInput={handleInput} data-placeholder="Add candidate summary">

                    </div>
                    <div className='flex items-center justify-end font-medium'>
                        <button type='button' onClick={handleDelete} className=' px-4 rounded py-1.5 text-white text-[13px] cursor-pointer border border-gray-300 bg-red-500 mt-2.5 hover:bg-red-400'>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </>

    )
}

export default CandidateSummary