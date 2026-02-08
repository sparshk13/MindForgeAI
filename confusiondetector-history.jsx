import React, { useEffect, useState } from "react";
import Navbar from "../components/DashNav";
import Footer from "../components/Footer";
import { api } from "../services/api";


export default function ConfusionDetectorHistory() {
  const [confusions, setConfusions] = useState([]);
  const userId = "b7032f09-3851-488e-a6ce-1cb0230f1454"; // test user

  useEffect(() => {
    api.getConfusionSignals(userId)
      .then((data) => setConfusions(data))
      .catch((err) => console.error("Confusion history error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Confusion Detector History
        </h2>
        {confusions.length > 0 ? (
          confusions.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                Topic: {item.topic || "N/A"}
              </h4>
              <p className="text-gray-800">{item.message || "Confusion signal detected"}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No confusion history found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
