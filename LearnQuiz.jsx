import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/DashNav.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js"; // ✅ API import

export default function LearnQuiz() {
  const [inputValue, setInputValue] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const navigate = useNavigate();

  // ---------------- Reflection Save ----------------
  const handleSave = async () => {
    if (!inputValue.trim()) {
      alert("Please enter some reflection text.");
      return;
    }

    switch (selectedFormat) {
      case "pdf": {
        try {
          const res = await api.generatePDF(inputValue);
          if (res?.pdf_url) {
            setPreviewUrl(res.pdf_url);
            setShowTextPreview(false);
          } else {
            alert("Failed to generate PDF.");
          }
        } catch (err) {
          console.error("PDF generation error:", err);
          alert("Error generating PDF.");
        }
        break;
      }

      case "video": {
        try {
          const res = await api.fetchYouTubeLinks(inputValue);
          console.log("YouTube API Response:", res);

          const links = Array.isArray(res?.videos) ? res.videos : [];
          setPreviewUrl(links);
        } catch (err) {
          console.error("YouTube fetch error:", err);
          alert("Failed to fetch videos");
        }
        setShowTextPreview(false);
        break;
      }

      default:
        alert("Invalid format.");
    }
  };

  // ---------------- Quiz Generate ----------------
    const handleGenerateQuiz = () => {
    if (!inputValue.trim()) {
      alert("Please enter a topic first.");
      return;
    }

    setLoadingQuiz(true);
    console.log(inputValue)
    api.generateQuiz({topic:inputValue, user_id:123, count:10})
      .then((res) => {
        console.log("Raw quiz data:", res.quiz);

        const formattedQuiz = (res?.quiz || []).map((q, index) => {
          const question = q?.question || `Q${index + 1}. What is ${inputValue}?`;
          const options =
            Array.isArray(q?.options) && q.options.length === 4
              ? q.options
              : ["Option A", "Option B", "Option C", "Option D"];
          const answer =
            q?.answer && options.includes(q.answer)
              ? q.answer
              : options[0];

          const weakConcept = question.replace(/^Q\d+\.\s*/, "").split("?")[0];

          return { question, options, answer, topic: inputValue, concept: weakConcept };
        });

        if (formattedQuiz.length > 0) {
          navigate("/quiz", {
            state: {
              topic: inputValue,
              quizData: formattedQuiz,
            },
          });
        } else {
          alert("No quiz data found for this topic.");
        }
      })
      .catch((err) => {
        console.error("Quiz generation error:", err);
        alert("Quiz generation failed. Please try again.");
      })
      .finally(() => {
        setLoadingQuiz(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-white text-dark flex flex-col">
      <Navbar />

      <motion.section
        className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Learn & Quiz
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-6">
          Reflect on your daily learning, track cognitive style insights, and
          get personalized recommendations based on your thinking patterns.
        </p>

        <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg text-left">
          <h3 className="text-xl font-semibold text-primary mb-2">
            Today’s Topic
          </h3>

          <input
            type="text"
            placeholder="Ask anything"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full py-3 px-4 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Select Content Format :
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="text-right mt-6 space-x-2">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              Generate
            </button>

            {/* <button
              onClick={handleGenerateQuiz}
              disabled={loadingQuiz}
              className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all"
            >
              {loadingQuiz ? "Generating..." : "Take Quiz"}
            </button> */}
          </div>

          {/* Output Previews */}
          {showTextPreview && (
            <div className="mt-6 bg-gray-100 p-4 rounded">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                Reflection Preview:
              </h4>
              <pre className="whitespace-pre-wrap text-gray-800">{inputValue}</pre>
            </div>
          )}

          {previewUrl && selectedFormat === "audio" && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                Audio Preview:
              </h4>
              <audio controls src={previewUrl} className="w-full" />
            </div>
          )}

          {previewUrl && selectedFormat === "pdf" && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                PDF Preview:
              </h4>
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="w-full h-80 border rounded"
              />
              <div className="flex justify-between mt-4">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition "
                >
                  View Fullscreen
                </a>
                
              <button
              onClick={handleGenerateQuiz}
              disabled={loadingQuiz}
              className=" flex justify-left bg-secondary text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all "
            >
              {loadingQuiz ? "Generating..." : "Take Quiz"}
            </button> 

              
              </div>
            </div>
          )}

          {/* Video Links Preview */}
          {Array.isArray(previewUrl) && selectedFormat === "video" && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                Top Videos:
              </h4>
              <ul className="list-disc pl-4 text-blue-600">
                {previewUrl.map((link, idx) => (
                  <li key={idx}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
