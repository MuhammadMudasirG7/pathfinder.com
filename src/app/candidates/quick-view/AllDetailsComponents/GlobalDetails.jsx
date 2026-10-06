import React, { useState } from 'react';
import { Pencil, ChevronDown, ChevronUp } from 'lucide-react';

export default function GlobalDetails({
  title,
  fields = [],
  onEdit,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full  bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs transition-all">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/70 border-b border-gray-200/80">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>

        <div className="flex items-center gap-3.5 text-slate-400">
          {onEdit && (
            <button type="button" onClick={onEdit} className="p-1 hover:text-slate-700 transition-colors cursor-pointer"  title="Edit Section">
              <Pencil size={14} />
            </button>
          )}

          <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1 hover:text-slate-700 transition-colors cursor-pointer" title={isOpen ? "Collapse" : "Expand"}>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Grid Content Body */}
      {isOpen && (
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 text-xs">
            {fields.map((field, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-50 pb-2.5"
              >
                <span className="text-gray-500 font-medium">
                  {field.label}
                </span>
                <span className="font-semibold text-slate-800 text-right">
                  {field.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}