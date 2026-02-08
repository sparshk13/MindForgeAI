import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function QuizPage() {
    const { topic } = useParams();
    const navigate = useNavigate();

    const [quizData, setQuizData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState(false);
    const [scoreData, setScoreData] = useState(null);
    const [isInitial, setIsInitial] = useState(true)

    useEffect(() => {
        const fetchQuiz = async () => {
        try {
            const response = await api.generateQuiz({ topic, num_questions: 5 });
            setQuizData(response.quiz || []);
        } catch (error) {
            console.error("Error fetching quiz:", error);
        } finally {
            setLoading(false);
            setIsInitial(false)
        }
        };
        if (isInitial) {
            fetchQuiz();
        }
    }, []);

    const handleOptionSelect = (idx, option) => {
        setSelectedAnswers((prev) => ({
        ...prev,
        [idx]: option,
        }));
    };

    const handleSubmit = async () => {
        try {

            const formattedAnswers = quizData.map((q, idx) => ({
            question_id: q.question_id,
            selected_answer: selectedAnswers[idx] || null,
            }));
        const submitRes = await api.submitQuiz({
            topic,
            answers: formattedAnswers,
        });

        const attemptId = submitRes.attempt_id;
        const scoreRes = await api.getScore(attemptId);

        setScoreData(scoreRes);
        setShowAnswers(true);

        if (scoreRes.percentage < 75) {
            navigate("/confusion-detector", {
            state: {
                weakTopics: scoreRes.weak_topics,
                score: scoreRes.score,
            },
            });
        }
        } catch (error) {
        console.error("Quiz submission or scoring failed:", error);
        }
    };

    if (loading) return <p className="p-4">Loading quiz...</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
        <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
        >
            ← Back
        </button>

        <h2 className="text-2xl font-bold mb-4">Quiz for "{topic}"</h2>

        {quizData.map((q, idx) => (
            <div key={idx} className="mb-4 p-3 border rounded bg-white shadow">
            <p className="font-medium">{idx + 1}. {q.question}</p>
            {q.options.map((opt, i) => {
                const isCorrect = showAnswers && scoreData?.status === "success" && opt === q.answer;
                const isSelected = selectedAnswers[idx] === opt;

                return (
                <label
                    key={i}
                    className={`block mb-1 p-1 rounded cursor-pointer ${
                    isCorrect
                        ? "bg-green-200"
                        : isSelected
                        ? "bg-blue-100"
                        : "bg-white"
                    }`}
                >
                    <input
                    type="radio"
                    name={`q-${idx}`}
                    value={opt}
                    className="mr-2"
                    onChange={() => handleOptionSelect(idx, opt)}
                    checked={isSelected}
                    />
                    {opt}
                </label>
                );
            })}
            </div>
        ))}

        <div className="mt-4 flex gap-3">
            <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
            Submit & View Score
            </button>
        </div>

        {scoreData && (
            <p className="mt-4 text-lg font-bold text-purple-700">
            Your Score: {scoreData.score} / {scoreData.total} (
            {Math.round(scoreData.percentage)}%)
            </p>
        )}
        </div>
    );
}
