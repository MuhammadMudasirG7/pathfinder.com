import { useState, useEffect, useRef } from 'react';

export const useDraggable = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isMaximized, setIsMaximized] = useState(false);
    const [isdraging, setIsDraging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const modalRef = useRef(null); // Modal element reference ke liye

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isdraging) return;
            
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            
            setPosition((prev) => {
                const newX = prev.x + dx;
                const newY = prev.y + dy;

                if (!modalRef.current) return { x: newX, y: newY };

                // Modal aur Screen ki exact current dimensions
                const modalRect = modalRef.current.getBoundingClientRect();
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;

                // Kyunki modal CSS `flex` ya `center` ki wajah se center mein render hota hai,
                // humein initial center offset calculate karna parta hai.
                const initialLeft = (screenWidth - modalRect.width) / 2;
                const initialTop = (screenHeight - modalRect.height) / 2;

                const currentLeft = initialLeft + newX;
                const currentTop = initialTop + newY;

                // Boundaries check (Left, Right, Top, Bottom)
                let finalX = newX;
                let finalY = newY;

                // Agar left edge se bahar ja raha ho
                if (currentLeft < 0) {
                    finalX = prev.x + (0 - currentLeft);
                }
                // Agar right edge se bahar ja raha ho
                else if (currentLeft + modalRect.width > screenWidth) {
                    finalX = prev.x - ((currentLeft + modalRect.width) - screenWidth);
                }

                // Agar top edge se bahar ja raha ho
                if (currentTop < 0) {
                    finalY = prev.y + (0 - currentTop);
                }
                // Agar bottom edge se bahar ja raha ho
                else if (currentTop + modalRect.height > screenHeight) {
                    finalY = prev.y - ((currentTop + modalRect.height) - screenHeight);
                }

                return { x: finalX, y: finalY };
            });

            dragStart.current = { x: e.clientX, y: e.clientY };
        };

        const handleMoveUp = () => setIsDraging(false);

        if (isdraging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMoveUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMoveUp);
        };
    }, [isdraging]);

    const handleMouseMoveDown = (e) => {
        setIsDraging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
    };

    return {
        position, isMaximized, setIsMaximized, handleMouseMoveDown, modalRef
    };
};