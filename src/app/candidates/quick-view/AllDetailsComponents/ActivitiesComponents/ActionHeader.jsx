import React from 'react'

function ActionHeader({ buttonText, onButtonClick, searchPlaceholder, searchTerm, onSearchChange, icon: Icon }) {
  return (
    <div className='flex items-center justify-end gap-3 w-full py-2'>
      
      {/* Dynamic Button */}
      <button
        onClick={onButtonClick}
        type="button"
        className='flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-medium text-[13px] rounded transition-colors cursor-pointer shadow-sm'
      >
        {/* Icon jo aap bhejenge woh yahan show ho ga */}
        {Icon && <Icon size={16} />}
        <span className='leading-relaxed'>{buttonText}</span>
      </button>

      {/* Simple Search Input (Bina SVG ke text/placeholder ke sath) */}
      <div className='w-64 leading-relaxed'>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className='w-full px-3 py-1.5 text-[13px] bg-white border border-gray-200 rounded-lg outline-none focus:border-purple-600 transition-colors text-gray-700 placeholder-gray-400'
        />
      </div>

    </div>
  )
}

export default ActionHeader;