import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function Quiz() {
  const location = useLocation();
  const { topic, quizData } = location.state || { topic: "", quizData: [] };

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const isCorrect = selectedOption === quizData[currentQ].answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: quizData[currentQ].question,
        selected: selectedOption,
        correct: quizData[currentQ].answer,
        isCorrect,
      },
    ]);
    console.log("Selected option:", selectedOption);
    console.log("Correct answer:", quizData[currentQ].answer);
    console.log("Is Correct:", isCorrect);

    if (currentQ + 1 < quizData.length) {
      setCurrentQ((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  if (!quizData || quizData.length === 0) {
    return <p className="p-6">No questions available for this quiz.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">Quiz on: {topic}</h1>

      {showResult ? (
        <div className="text-center w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-4">
            Your Score: {score} / {quizData.length}
          </p>

          {/* Answer Review */}
          <h3 className="text-lg font-semibold mt-6 mb-3">Review Answers:</h3>
          <ul className="text-left space-y-4">
            {userAnswers.map((item, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded-md">
                <p className="font-semibold mb-1">
                  Q{index + 1}. {item.question}
                </p>
                <p>
                  <span className="font-medium">Your Answer:</span>{" "}
                  <span
                    className={
                      item.isCorrect ? "text-green-600" : "text-red-600"
                    }
                  >
                    {item.selected}
                  </span>
                </p>
                {!item.isCorrect && (
                  <p>
                    <span className="font-medium">Correct Answer:</span>{" "}
                    <span className="text-green-600">{item.correct}</span>
                  </p>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={handleRestart}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 mt-6"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Q{currentQ + 1}. {quizData[currentQ].question}
          </h2>

          <div className="space-y-3">
            {quizData[currentQ].options.map((option, idx) => (
              <label
                key={idx}
                className={`block border p-3 rounded cursor-pointer ${
                  selectedOption === option
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {String.fromCharCode(65 + idx)}. {option}
              </label>
            ))}
          </div>

          

          <div className="flex justify-end mt-6">
            <button
              onClick={handleNext}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={!selectedOption}
            >
              {currentQ + 1 === quizData.length ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
