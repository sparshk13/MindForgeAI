import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/DashNav';
import Footer from '../components/Footer';
import { api } from '../services/api';
import RoadmapFlowchart from '../components/RoadmapInfographic';
import RoadmapInfographic from '../components/RoadmapInfographic';



export default function Roadmap() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateRoadmap = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const payload = {
        prompt: topic,
        user_id: "00000000-0000-0000-0000-000000000001", // TEMP user_id (users table me hona chahiye)
        level: level.toLowerCase(),
      };

      const data = await api.generateRoadmap(payload);
      if (data?.data) {
        setRoadmap(data.data);
      } else {
        alert('No roadmap data received from server.');
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white flex flex-col text-dark">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-12">
        <motion.h1
          className="text-4xl font-bold text-primary mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Roadmap
        </motion.h1>
        <p className="text-lg text-gray-700 max-w-2xl text-center mb-8">
          Enter your career goal or a topic you'd like to master — MindForgeAI will generate personalized questions to test and guide your learning path.
        </p>

        {/* Input & Dropdown */}
        <div className="w-full max-w-md mb-10 space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Data Structures, Cybersecurity"
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Level Dropdown */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Generate Button */}
          <button
            onClick={handleGenerateRoadmap}
            className="w-full bg-primary text-white font-semibold py-3 rounded-md shadow hover:bg-[#0f3c8c] transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {/* Roadmap Output */}
        {roadmap && (
          <div className="w-full max-w-7xl bg-white p-10 rounded-xl shadow-lg text-left">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Personalized Roadmap ({level}):
            </h3>
            <RoadmapFlowchart roadmap={roadmap} />
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
