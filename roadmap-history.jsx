import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";

export default function RoadmapHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/roadmap/history/user@gmail.com")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error("History fetch error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white flex flex-col text-dark">
      <Navbar />

      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Your Roadmap History</h2>

        {history.map((entry, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow mb-4">
            <h4 className="text-lg font-semibold text-primary mb-1">{entry.topic}</h4>
            <p className="text-sm text-gray-500 mb-2">{new Date(entry.createdAt).toLocaleString()}</p>
            <pre className="text-gray-800 whitespace-pre-wrap">{entry.roadmap}</pre>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
