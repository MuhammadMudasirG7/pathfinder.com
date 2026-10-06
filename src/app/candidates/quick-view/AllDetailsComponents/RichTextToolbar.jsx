import React, { useState, useRef, useEffect } from 'react';

const RichTextToolbar = ({
    onContentChange,
    placeholder,
    height = 'h-[160px]',
    initialContent = ''
}) => {
    const [active, setActive] = useState("");
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = initialContent;
        }
    }, [initialContent]);

    const tools = [
        { cmd: 'bold', label: 'B' },
        { cmd: 'italic', label: 'I' },
        { cmd: 'underline', label: 'U' },
        { cmd: 'insertUnorderedList', label: '☷ Number Bullets' },
        { cmd: 'insertOrderedList', label: '☷ Bullets' }
    ];

    const formatText = (command) => {
        if (!editorRef.current) return;

        editorRef.current.focus();

        document.execCommand(command, false, null);

        setActive(active === command ? "" : command);

        if (onContentChange) {
            onContentChange(editorRef.current.innerHTML);
        }
    };

    const handleInput = () => {
        if (editorRef.current && onContentChange) {
            onContentChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div className="flex flex-col">

            <div
                ref={editorRef}
                onInput={handleInput}
                contentEditable
                suppressContentEditableWarning
                className={`${height} outline-none text-[11px] p-2 overflow-y-auto rounded bg-gray-50 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`}
                data-placeholder={placeholder}
            />

            <div className='flex items-center gap-2 mt-2 pt-2 border-t border-gray-100'>
                {tools.map(({ cmd, label }) => (
                    <button
                        key={cmd}
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => formatText(cmd)}
                        className={`px-1 rounded cursor-pointer text-[11px] font-bold text-gray-800 ${
                            active === cmd
                                ? "bg-violet-800 text-white"
                                : "bg-gray-50 hover:bg-gray-100"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default RichTextToolbar;