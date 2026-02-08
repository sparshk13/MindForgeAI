import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";

export default function ConceptCards() {
  const [concept, setConcept] = useState("");
  const [flashcard, setFlashcard] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchCard = async () => {
    if (!concept.trim()) return alert("Please enter a concept");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/flashcard", {
        concept,
      });
      setFlashcard(res.data);
    } catch (err) {
      console.error("Error fetching flashcard:", err);
      alert("Failed to fetch flashcard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white text-dark flex flex-col">
      <Navbar />

      <motion.section
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Recall Card
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Visual flashcards to help you understand and master core concepts
          quickly. Swipe through concepts and flip to reveal detailed
          explanations.
        </p>

        <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg text-left">
          {/*  Prompt Input Section */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-semibold text-primary">
              Enter Concept
            </label>
            <input
              type="text"
              placeholder="e.g., Neural Networks"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/>
            <button
              onClick={handleFetchCard}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              {loading ? "Generating..." : "Generate Flashcard"}
            </button>
          </div>

          {/* Flashcard Display - Custom Theme */}
          {flashcard ? (
            <div className="relative w-full h-64 perspective">
              <div className="w-full h-full bg-[#F8E5E5] rounded-xl shadow-md p-6 text-center transform transition-transform duration-500 hover:rotate-y-180">
                {/* Front of card */}
                <div className="absolute inset-0 flex items-center justify-center backface-hidden">
                  <h3 className="text-2xl font-bold text-[#000000]">{flashcard.term}</h3>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 bg-[#C39EA0] rounded-xl p-4 text-white text-left rotate-y-180 backface-hidden">
                  <p className="text-base whitespace-pre-line">{flashcard.definition}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-60 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              🃏 Swipeable Flashcard Carousel (Coming Soon)
            </div>
          )}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
