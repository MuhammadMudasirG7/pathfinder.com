import { Check, ChevronLeft, ChevronRight, GripVertical, Lock, Pencil, Plus, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

export default function HiringPipeline() {
    const [stages, setStages] = useState([
        { id: 1, name: "Applied", isLock: true, isCheck: false },
        { id: 2, name: "Assigned", isLock: true, isCheck: false },
        { id: 3, name: "Phone Screening", isLock: false, isCheck: true },
        { id: 4, name: "Interview Scheduled", isLock: false, isCheck: true },
        { id: 5, name: "1st Interview", isLock: false, isCheck: true },
        { id: 6, name: "2nd Interview", isLock: false, isCheck: true },
        { id: 7, name: "3rd Interview", isLock: false, isCheck: true },
        { id: 8, name: "Skills Assessment", isLock: false, isCheck: true },
        { id: 9, name: "On Hold", isLock: false, isCheck: true },
        { id: 10, name: "Rejected", isLock: false, isCheck: true },
        { id: 11, name: "Reference Check", isLock: false, isCheck: true },
        { id: 12, name: "Offer Extended", isLock: false, isCheck: true },
        { id: 13, name: "Placed", isLock: false, isCheck: true },
    ])
    
    const [pipelineName, setPipeLineName] = useState("")
    
    // Default Pipeline ko bhi state mein rakh liya hai taake yeh bhi edit ho sakay
    const [defaultPipeline, setDefaultPipeline] = useState({
        id: 'default',
        pipelineName: "Hiring Pipeline (Default)",
        stages: [
            { id: 1, name: "Applied", isLock: true },
            { id: 2, name: "Assigned", isLock: true },
            { id: 3, name: "Phone Screening", isLock: false },
            { id: 4, name: "Interview Scheduled", isLock: false },
            { id: 5, name: "1st Interview", isLock: false },
            { id: 6, name: "2nd Interview", isLock: false },
            { id: 7, name: "3rd Interview", isLock: false },
            { id: 8, name: "Skills Assessment", isLock: false },
            { id: 9, name: "On Hold", isLock: false },
            { id: 10, name: "Rejected", isLock: false },
            { id: 11, name: "Reference Check", isLock: false },
            { id: 12, name: "Offer Extended", isLock: false },
            { id: 13, name: "Placed", isLock: false },
        ],
        scrollRef: useRef(null)
    })

    const [pipelines, setPipelines] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [editingPipelineId, setEditingPipelineId] = useState(null) // 'default' ya naye pipeline ki ID track karega

    const defaultScrollRef = useRef(null)

    const scroll = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: "smooth" })
        }
    }

    // New Pipeline kholne ke liye
    const handleOpenNewModal = () => {
        setEditingPipelineId(null)
        setPipeLineName("")
        setStages(stages.map(item => ({
            ...item,
            isCheck: item.isLock ? true : true
        })))
        setIsEdit(true)
    }

    // Edit Modal kholne ke liye (Chahe default ho ya custom pipeline)
    const handleOpenEditModal = (pipeline) => {
        setEditingPipelineId(pipeline.id)
        setPipeLineName(pipeline.pipelineName)
        
        setStages(stages.map(item => {
            const isSelected = pipeline.stages.some(s => s.name === item.name)
            return {
                ...item,
                isCheck: isSelected
            }
        }))
        setIsEdit(true)
    }

    const handleSavePipeline = () => {
        if (!pipelineName.trim()) return;
        
        const selectedStages = stages.filter(item => item.isLock || item.isCheck)

        if (editingPipelineId === 'default') {
            // Default pipeline update karna
            setDefaultPipeline(prev => ({
                ...prev,
                pipelineName,
                stages: selectedStages
            }))
        } else if (editingPipelineId !== null) {
            // Custom existing pipeline update karna
            setPipelines(pipelines.map(p => 
                p.id === editingPipelineId 
                    ? { ...p, pipelineName, stages: selectedStages }
                    : p
            ))
        } else {
            // Naya pipeline create karna
            const newPipeline = {
                id: Date.now(), 
                pipelineName, 
                stages: selectedStages,
                scrollRef: React.createRef()
            }
            setPipelines([...pipelines, newPipeline])
        }

        setPipeLineName("")
        setEditingPipelineId(null)
        setIsEdit(false)
    }

    const toggleCheck = (id) => {
        setStages(stages.map(item => {
            if (item.id === id) {
                return { ...item, isCheck: !item.isCheck }
            }
            return item
        }))
    }

    const labelClass = "text-[12px] font-sans font-medium text-gray-600 ml-0.5"
    const inputClass = "px-2 mt-0.5 py-1 text-[12px] font-sans font-medium text-gray-700 rounded-xs w-full outline-none border border-gray-200 hover:shadow-[0_0_3px_rgb(99,102,239,0.52)] placeholder:text-[12px]"

    return (
        <div className='p-3 relative'>
            <div className='p-4 flex items-center justify-end'>
                <button onClick={handleOpenNewModal} className='bg-[#6E41E2] flex items-center gap-2 font-sans font-medium rounded px-2 py-2 cursor-pointer'>
                    <Plus size={14} className='text-white' />
                    <span className='text-[10px] text-white'>Add New Pipeline</span>
                </button>
            </div>

            {/* Default Pipeline (Ab yeh bhi editable hai) */}
            <div className='border border-gray-200 rounded mb-4'>
                <div className='flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-gray-200'>
                    <h2 className='text-[12px] text-gray-800 font-medium font-sans'>{defaultPipeline.pipelineName}</h2>
                    <div onClick={() => handleOpenEditModal(defaultPipeline)} className='bg-white cursor-pointer rounded border border-gray-200 p-1 hover:bg-gray-100'>
                        <Pencil size={12} />
                    </div>
                </div>
                <div className='relative flex items-center'>
                    <div className='absolute left-0 h-full bg-white px-2 flex items-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] z-10'>
                        <button onClick={() => scroll(defaultScrollRef, 'left')} className='bg-black rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-800'>
                            <ChevronLeft size={18} className='text-white' />
                        </button>
                    </div>
                    <div ref={defaultScrollRef} className='flex items-center gap-3 overflow-x-auto w-full px-12 py-5 text-nowrap scrollbar-none'>
                        {defaultPipeline.stages.map((item, index) => (
                            <div key={index} className='flex items-center gap-2'>
                                <div className='flex px-3 py-1 rounded border border-gray-200 w-fit'>
                                    <span className='text-[11px] text-gray-700'>{item.name}</span>
                                </div>
                                <ChevronRight size={15} className='text-gray-700' />
                            </div>
                        ))}
                    </div>
                    <div className='absolute right-0 h-full bg-white px-2 flex items-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] z-10'>
                        <button onClick={() => scroll(defaultScrollRef, 'right')} className='bg-black rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-800'>
                            <ChevronRight size={18} className='text-white' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Dynamically Created Pipelines */}
            {pipelines.map((pipeline) => (
                <div key={pipeline.id} className='border border-gray-200 rounded mb-4'>
                    <div className='flex items-center justify-between px-3 py-2.5 bg-gray-50 border-b border-gray-200'>
                        <h2 className='text-[12px] text-gray-800 font-medium font-sans'>{pipeline.pipelineName}</h2>
                        <div onClick={() => handleOpenEditModal(pipeline)} className='bg-white cursor-pointer rounded border border-gray-200 p-1 hover:bg-gray-100'>
                            <Pencil size={12} />
                        </div>
                    </div>
                    <div className='relative flex items-center'>
                        <div className='absolute left-0 h-full bg-white px-2 flex items-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] z-10'>
                            <button onClick={() => scroll(pipeline.scrollRef, 'left')} className='bg-black rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-800'>
                                <ChevronLeft size={18} className='text-white' />
                            </button>
                        </div>
                        <div ref={pipeline.scrollRef} className='flex items-center gap-3 overflow-x-auto w-full px-12 py-5 text-nowrap scrollbar-none'>
                            {pipeline.stages.map((stage, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <div className='flex px-3 py-1 rounded border border-gray-200 w-fit'>
                                        <span className='text-[11px] text-gray-700'>{stage.name}</span>
                                    </div>
                                    <ChevronRight size={15} className='text-gray-700' />
                                </div>
                            ))}
                        </div>
                        <div className='absolute right-0 h-full bg-white px-2 flex items-center shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)] z-10'>
                            <button onClick={() => scroll(pipeline.scrollRef, 'right')} className='bg-black rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-800'>
                                <ChevronRight size={18} className='text-white' />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Sidebar Modal */}
            {isEdit && (
                <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
                    <div className='bg-white w-[47%] h-screen overflow-y-auto flex flex-col'>
                        <div className='p-2 flex-1 flex flex-col'>
                            <div className='flex items-center justify-between p-5 border-b border-gray-200'>
                                <h2 className='text-[16px] text-gray-700 font-medium font-sans'>
                                    {editingPipelineId ? "Edit Hiring Pipeline" : "New Hiring Pipeline"}
                                </h2>
                                <X onClick={() => setIsEdit(false)} className='w-4 h-4 hover:bg-gray-200 rounded cursor-pointer' size={18} />
                            </div>
                            <div className='flex flex-col p-4 gap-0.5'>
                                <label className={labelClass}>Pipeline Name*</label>
                                <input value={pipelineName} onChange={(e) => setPipeLineName(e.target.value)} className={inputClass} type="text" placeholder='eg.., Executive Search' />
                                <h2 className='text-[13px] text-gray-600 p-1 mt-3'>Add Custom Stages</h2>
                            </div>

                            <div className='p-2 space-y-2.5 overflow-y-auto border-b border-gray-200 mb-2.5 flex-1'>
                                {stages.map((item) => (
                                    <div key={item.id} className='px-4 py-1.5 flex items-center justify-between border border-gray-200 rounded'>
                                        <div className='flex items-center gap-2'>
                                            <GripVertical size={14} />
                                            <span className={labelClass}>{item.name}</span>
                                        </div>
                                        {item.isLock ? (
                                            <Lock size={14} />
                                        ) : (
                                            <div onClick={() => toggleCheck(item.id)} className={`w-4.5 h-4.5 rounded flex items-center p-0.5 border border-gray-300 cursor-pointer ${item.isCheck ? "bg-violet-700" : "bg-white"}`}>
                                                <Check size={12} className={`text-white ${item.isCheck ? "opacity-100" : "opacity-0"}`} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className='p-4'>
                                <div className='flex justify-end gap-4 border-t border-gray-200 pt-2 mb-1.5'>
                                    <button onClick={() => setIsEdit(false)} className='px-3 py-1 border border-gray-200 rounded font-sans text-[12px] cursor-pointer'>Cancel</button>
                                    <button onClick={handleSavePipeline} className='px-4 py-1 border border-gray-200 text-white rounded bg-[#6E41E2] font-sans cursor-pointer text-[12px]'>
                                        {editingPipelineId ? "Update Pipeline" : "Create Pipeline"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}