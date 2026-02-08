import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";
import { api } from "../services/api";
import score from "../components/QuizPage"

export default function ConfusionDetector() {
  const location = useLocation();
  const weakTopicsFromQuiz = location.state?.weakTopics || [];
  const scoreFromQuiz = location.state?.score ?? null;

  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = "b7032f09-3851-488e-a6ce-1cb0230f1454"; // test user

  useEffect(() => {
    setLoading(true);
    api
      .getConfusionSignals(userId)
      .then((data) => setSignals(data))
      .catch((err) => console.error("Error fetching confusion signals:", err))
      .finally(() => setLoading(false));
  }, []);

  const uniqueTopics = [...new Set(weakTopicsFromQuiz)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white text-dark flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Confusion Detector
        </h2>

        {/* Feedback from quiz weakTopics (formatted) */}
        {uniqueTopics.length > 0 && (
          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800 mb-6">
            <p className="font-semibold mb-2">You're struggling with:</p>
            <ul className="list-disc list-inside">
              {uniqueTopics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
            <p className="mt-2">Your Score: {scoreFromQuiz}</p>
            <p className="mt-2">Let’s work on them.</p>
          </div>
        )}

        {/* API Signals */}
        {loading ? (
          <p className="text-center text-gray-600">Loading confusion signals...</p>
        ) : signals.length > 0 ? (
          <ul className="bg-white p-6 rounded-xl shadow-lg space-y-2">
            {signals.map((sig) => (
              <li
                key={sig.id}
                className="border-b last:border-none py-2 text-gray-800"
              >
                {sig.message || "Confusion signal detected"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 text-center">
            {uniqueTopics.length === 0
              ? "No confusion signals found."
              : "Focus on these weak points."}
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
