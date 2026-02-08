import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";

export default function RecallCardHistory() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/flashcard/history/user@gmail.com")
      .then((res) => setCards(res.data))
      .catch((err) => console.error("Flashcard history error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">Recall Card History</h2>
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow mb-4">
            <h4 className="font-semibold text-primary">{card.term}</h4>
            <p className="text-gray-800 whitespace-pre-line">{card.definition}</p>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
