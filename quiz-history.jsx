import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";

export default function QuizHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/quiz/history/user@gmail.com")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("Quiz history error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Learn & Quiz History</h2>
        {history.map((q, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow mb-4">
            <h4 className="font-semibold mb-2">{q.topic}</h4>
            <p className="text-gray-800">Q: {q.question}</p>
            <p className="text-sm text-gray-500 mt-1">Correct: {q.correct_answer}</p>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
