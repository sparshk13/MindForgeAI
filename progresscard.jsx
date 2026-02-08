import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";

export default function ProgressCard() {
  const [progressData, setProgressData] = useState(null);
  const userId = "61e8c92a-bf4d-42e4-88c5-3a78465d1db3";

  useEffect(() => {
    fetch(`http://localhost:8000/progress-card/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setProgressData(data))
      .catch((err) => console.error(err));
  }, []);

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
          Progress Card
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl mb-6">
          See your personal learning milestones and achievements in one place.
        </p>

        <div className="w-full max-w-3xl bg-white p-6 rounded-xl shadow-lg text-left">
          <h3 className="text-xl font-semibold text-primary mb-4">
            Your Current Stats
          </h3>

          {progressData ? (
            <div className="space-y-4 text-gray-800">
              <p>📆 Learning Streak: <strong>{progressData.learning_streak || 0} days</strong></p>
              <p>🔥 Current Streak: <strong>{progressData.current_streak || 0} days</strong></p>
              <p>🏆 Longest Streak: <strong>{progressData.longest_streak || 0} days</strong></p>
              <p>📚 Topics Mastered: <strong>{progressData.topics_mastered || 0}</strong></p>
              <p>🧠 Confused Areas: <strong>{(progressData.confused_topics || []).join(", ") || "None"}</strong></p>
              <p>🚀 Next Best Action: <strong>{progressData.next_best_action || "Keep up the great work!"}</strong></p>
              <p>📅 Last Active: <strong>{progressData.last_active || "N/A"}</strong></p>
            </div>
          ) : (
            <div className="h-60 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              📉 No progress data yet. Start learning to see insights here.
            </div>
          )}
        </div>
      </motion.section>
      <Footer />
    </div>
  );
}
