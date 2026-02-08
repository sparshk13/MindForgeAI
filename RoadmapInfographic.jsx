import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const colors = ["#e74c3c", "#f39c12", "#27ae60", "#2980b9", "#8e44ad"];

export default function RoadmapInfographic({ roadmap }) {
    const navigate = useNavigate();

    if (!roadmap || !roadmap.subtopics) return null;

    const handleGenerateQuiz = (topic) => {
        navigate(`/quiz/${encodeURIComponent(topic)}`);
    };

    return (
        <div className="relative w-full overflow-y-auto h-[700px]">
            <div
                className="relative w-full bg-gradient-to-b from-gray-200 to-gray-100 rounded-lg"
                style={{ height: `${roadmap.subtopics.length * 200 + 100}px` }}
            >
                {/* Vertical Line */}
                <div className="absolute left-1/2 top-0 h-full w-12 bg-gray-700 rounded-full transform -translate-x-1/2">
                    <div className="h-full w-2 border-dashed border-white border-l-2 ml-5"></div>
                </div>

                {/* Subtopic Cards */}
                {roadmap.subtopics.map((s, index) => {
                    const isEven = index % 2 === 0;
                    const cardWidth = 280;
                    const dotSize = 14;
                    const verticalSpacing = 200;
                    
                    // --- MODIFIED LINES ---
                    // This value is half the road width (24px) + a small gap (8px)
                    const gapFromCenter = 32; 

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="absolute w-full"
                            style={{ top: `${index * verticalSpacing + 40}px` }}
                        >
                            <div className="relative flex items-center justify-center w-full">
                                {/* Dot */}
                                <div
                                    className="absolute"
                                    style={{
                                        width: `${dotSize}px`,
                                        height: `${dotSize}px`,
                                        backgroundColor: colors[index % colors.length],
                                        borderRadius: "9999px",
                                        top: `0`,
                                        left: `calc(${isEven ? '50% - 12px' : '50% + 12px'} - ${dotSize / 2}px)`,
                                        zIndex: 10,
                                    }}
                                ></div>

                                {/* Card */}
                                <div
                                    className="p-4 bg-white rounded-lg shadow-md text-center"
                                    style={{
                                        width: `${cardWidth}px`,
                                        position: "absolute",
                                        top: `-20px`,
                                        // --- MODIFIED LOGIC ---
                                        left: isEven
                                            ? `calc(50% - ${gapFromCenter + cardWidth}px)`
                                            : `calc(50% + ${gapFromCenter}px)`,
                                    }}
                                >
                                    <h3 className="text-md font-bold text-gray-800">{s.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {s.description?.slice(0, 100) || ""}
                                    </p>

                                    {s.link ? (
                                        <a
                                            href={s.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-2 text-blue-500 text-sm underline hover:text-blue-700"
                                        >
                                            View Resource
                                        </a>
                                    ) : (
                                        <p className="text-gray-400 text-sm mt-2">No Resource</p>
                                    )}

                                    <div className="mt-2">
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-700"
                                            onClick={() => handleGenerateQuiz(s.title)}
                                        >
                                            Generate Quiz
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}