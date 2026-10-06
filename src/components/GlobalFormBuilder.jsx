import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import React from 'react'
import DurationPicker from './DurationPicker'

function GlobalFormBuilder({ fields, formData, onChange, onDelete }) {

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-5`}>
            {fields.map((field) => (
                <div key={field.name} className={`flex flex-col gap-2 ${field.fullWidth ? "md:col-span-2" : ""}`}>
                    {field.type !== "toggle" && (
                        <label className='text-[12px] text-gray-600 font-bold' htmlFor={field.name}>{field.label}
                            {field.required && (
                                <span className='text-gray-700 ml-1'>*</span>
                            )}
                        </label>
                    )}
                    {field.type == "input" && (
                        <input className="px-2.5 py-2 border border-gray-300 outline-none w-full rounded placeholder:text-[12px] hover:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-shadow duration-200 placeholder:text-gray-400 tracking-wider text-[13px] text-gray-500"
                            id={field.name} name={field.name} value={formData?.[field.name] || ""} placeholder={field.placeholder} onChange={(e) => onChange(field.name, e.target.value)} />
                    )}
                    {field.type === "dropdown" && (
                        <Dropdown
                            panelClassName="custom-dropdown-panel"
                            className="custom-dropdown border border-gray-300 outline-none w-full rounded hover:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-shadow duration-200"
                            options={field.options}
                            id={field.name}
                            name={field.name}
                            value={formData?.[field.name] || null}
                            placeholder={field.placeholder}
                            onChange={(e) => onChange(field.name, e.value)}
                        />
                    )}
                    {field.type === "date" && (
                        <Calendar

                            id={field.name}
                            name={field.name}
                            value={formData?.[field.name] || null}
                            onChange={(e) => onChange(field.name, e.value)}
                            placeholder={field.placeholder}
                            dateFormat="dd-mm-yy"
                            showIcon
                            className="custom-calendar border border-gray-300 outline-none w-full rounded hover:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-shadow duration-200"
                            panelClassName="custom-calendar-panel"
                        />
                    )}
                    {field.type === "duration" && (
                        <DurationPicker
                            value={formData?.[field.name] || {}}
                            onChange={(value) => onChange(field.name, value)}
                        />
                    )}
                    {field.type === "toggle" && (
                        <div className="flex items-center gap-3 mt-10 ml-6">
                            <span className="text-[12px] font-bold text-gray-500">{field.label}</span>

                            <button type="button" onClick={() => onChange(field.name, !formData?.[field.name])}
                                className={`relative w-7.5 h-4.5 rounded-full transition-colors duration-200 ${formData?.[field.name]
                                    ? "bg-indigo-600"
                                    : "bg-gray-300"
                                    }`}>
                                <span className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ${formData?.[field.name]
                                    ? "translate-x-3"
                                    : "translate-x-0"
                                    }`} />
                            </button>
                        </div>
                    )}
                    {field.type === "textarea" && (
                        <textarea
                            id={field.name}
                            name={field.name}
                            value={formData?.[field.name] || ""}
                            placeholder={field.placeholder}
                            onChange={(e) =>
                                onChange(field.name, e.target.value)
                            }
                            rows={5}
                            className="px-3 py-3 border border-gray-300 outline-none w-full rounded resize-none placeholder:text-[12px] placeholder:text-gray-400 tracking-wider text-[13px] text-gray-500 hover:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-shadow duration-200"
                        />
                    )}
                    {field.type === "textarea" && onDelete && (
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={onDelete}
                                className="px-4 py-1.5 bg-red-500 text-white text-[13px] rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    )}

                </div>
            ))}
        </div>
    )
}

export default GlobalFormBuilder