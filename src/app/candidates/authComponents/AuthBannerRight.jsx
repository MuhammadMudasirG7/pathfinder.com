'use client';
import React, { useState, useEffect } from 'react';

const slides = [
    {
        title: "Introducing new features",
        description: "Customise your search! Define keywords and our system will intelligently parse resumes to find the perfect matches, faster."
    },
    {
        title: "Smart Resume Parsing",
        description: "Our AI automatically extracts key information from resumes, making candidate evaluation faster and more accurate."
    },
    {
        title: "Advanced Analytics",
        description: "Get insights into your hiring process with detailed analytics and reporting features."
    },
    {
        title: "Seamless Integration",
        description: "Connect with your existing tools and workflows for a streamlined hiring experience."
    }
];

export default function AuthBannerRight() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    return (
        /* items-stretch ensure karega ke left aur right dono ki height barabar rahe */
        <div className="hidden lg:flex lg:w-1/2 p-6 items-stretch bg-white">
            {/* h-full lagane se yeh left wale form ki mukammal height ko cover kar le ga */}
            <div className="w-full h-full bg-[#6332c5] rounded-3xl flex flex-col justify-between p-12 text-white relative overflow-hidden shadow-xl">
                
                <div></div>

                {/* Center Slider Content - my-auto text ko hamesha vertically center rakhe ga */}
                <div className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto my-auto transition-all duration-500 ease-in-out">
                    <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                        <span className="text-3xl">⚙️</span>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tight">{slides[currentIndex].title}</h2>
                        <p className="text-purple-100 text-sm leading-relaxed">
                            {slides[currentIndex].description}
                        </p>
                    </div>
                </div>

                {/* Bottom Navigation Controls */}
                <div className="w-full flex items-center justify-between px-4 pt-6">
                    <button onClick={prevSlide} className="text-white/60 hover:text-white text-xl cursor-pointer p-2">‹</button>
                    
                    <div className="flex space-x-2 items-center">
                        {slides.map((_, index) => (
                            <span 
                                key={index} 
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                            ></span>
                        ))}
                    </div>

                    <button onClick={nextSlide} className="text-white/60 hover:text-white text-xl cursor-pointer p-2">›</button>
                </div>

            </div>
        </div>
    );
}