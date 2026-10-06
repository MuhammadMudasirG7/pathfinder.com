import React, { useEffect, useRef, useState } from 'react'

function practice() {
    const [position,setPosition] = useState({x:0,y:0})
    const [isDraging,setIsDraging] = useState(false)
    const [isMaximized,setIsMaximized] = useState(false)
    const dragStart = useRef({x:0,y:0})
    useEffect(() => {
       const handleMouseMove = (e) => {
         const dx = e.clientX - dragStart.current.x
         const dy = e.clientY - dragStart.current.y
         setPosition((prev) => ({
            x:prev.x + dx,
            y:prev.y + dy
         }))
         dragStart.current = {x:e.clientX , y:e.clientY}
       }
       const handleMouseUp = () => setIsDraging(false);

       if (isDraging) {
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
       }
       
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }, [isDraging,isMaximized])
    const handleMouseMoveDown = (e) => {
       if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return
        setIsDraging(true)
        dragStart.current = { x: e.clientX, y: e.clientY }
    }
    
  return (
    <div style={{transform:`translate (${position.x}px,${position.y}px)`}} className=''>
    </div>
  )
}

export default practice