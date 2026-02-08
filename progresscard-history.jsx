import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";

export default function ProgressCardHistory() {
  const [cards, setCards] = useState([]);

  const fetchHistory = () => {
    axios
      .get("http://localhost:8000/api/progress/history/user@gmail.com")
      .then((res) => setCards(res.data));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const markReviewed = async (id) => {
    await axios.put(`http://localhost:8000/api/progress/review/${id}`);
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white flex flex-col text-dark">
      <Navbar />

      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Progress Card History</h2>

        {cards.map((card) => (
          <div key={card._id} className="bg-white p-4 rounded-xl shadow mb-4">
            <h4 className="text-lg font-semibold">{card.topic}</h4>
            <p className="text-gray-600 text-sm">Last Reviewed: {new Date(card.lastReviewedAt).toLocaleString()}</p>
            <p className="text-gray-600 text-sm">Next Review: {new Date(card.nextReviewAt).toLocaleString()}</p>
            <p className="text-gray-800 text-sm mt-1">Retention Score: {card.retentionScore}%</p>

            {card.notes && <p className="mt-2 text-gray-500 text-sm">📝 {card.notes}</p>}

            <button
              onClick={() => markReviewed(card._id)}
              className="mt-3 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Mark as Reviewed
            </button>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
