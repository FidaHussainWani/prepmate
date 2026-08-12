import { useState } from "react";
import api from "../services/api";
import "./AIAssistant.css";

function AIAssistant({ noteId }) {

    const [summary, setSummary] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [quiz, setQuiz] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [flashcards, setFlashcards] = useState([]);
    const [currentFlashcard, setCurrentFlashcard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loadingFlashcards, setLoadingFlashcards] = useState(false);

    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(false);

    const [error, setError] = useState("");

    // =========================
    // SUMMARIZE
    // =========================

    const summarizeNote = async () => {

        setLoadingSummary(true);
        setError("");
        setSummary("");

        try {

            const response = await api.post(
                "/ai/summarize",
                {
                    noteId: Number(noteId)
                }
            );

            setSummary(response.data.result);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to summarize note"
            );

        } finally {

            setLoadingSummary(false);
        }
    };


    // =========================
    // ASK AI
    // =========================

    const askQuestion = async (e) => {

        e.preventDefault();

        if (!question.trim()) {
            return;
        }

        setLoadingAnswer(true);
        setError("");
        setAnswer("");

        try {

            const response = await api.post(
                "/ai/ask",
                {
                    noteId: Number(noteId),
                    question: question.trim()
                }
            );

            setAnswer(response.data.result);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to get AI answer"
            );

        } finally {

            setLoadingAnswer(false);
        }
    };

     // =========================
    // GENERATE QUIZ
    // =========================

   const generateQuiz = async () => {

    setLoadingQuiz(true);
    setError("");
    setQuiz(null);
    setSelectedAnswers({});

    try {

        console.log("========== QUIZ REQUEST ==========");

        console.log("Note ID:", noteId);

        const response = await api.post(
            "/ai/quiz",
            {
                noteId: Number(noteId),
                numberOfQuestions: 5
            }
        );

        console.log("FULL BACKEND RESPONSE:");
        console.log(response.data);

        // Backend is already returning:
        // { questions: [...] }

        const quizData = response.data;

        if (
            !quizData ||
            !quizData.questions ||
            !Array.isArray(quizData.questions)
        ) {

            throw new Error(
                "Invalid quiz response from backend"
            );
        }

        console.log("QUIZ DATA:");
        console.log(quizData);

        console.log(
            "NUMBER OF QUESTIONS:",
            quizData.questions.length
        );

        setQuiz(quizData);

    } catch (error) {

        console.error(
            "========== QUIZ ERROR =========="
        );

        console.error(error);

        console.error(
            "Backend response:",
            error.response?.data
        );

        setError(
            error.response?.data?.message ||
            error.message ||
            "Failed to generate quiz"
        );
  } finally {

        setLoadingQuiz(false);
    }
};
    // =========================
    // GENERATE FLASHCARDS
    // =========================

    const generateFlashcards = async () => {

        setLoadingFlashcards(true);
        setError("");
        setFlashcards([]);
        setCurrentFlashcard(0);
        setShowAnswer(false);

        try {

            console.log("========== FLASHCARD REQUEST ==========");
            console.log("Note ID:", noteId);

            const response = await api.post(
                "/ai/flashcards",
                {
                    noteId: Number(noteId),
                    numberOfCards: 10
                }
            );

            console.log("FLASHCARD RESPONSE:");
            console.log(response.data);

            const flashcardData = response.data;

            if (
                !flashcardData ||
                !flashcardData.flashcards ||
                !Array.isArray(flashcardData.flashcards)
            ) {
                throw new Error(
                    "Invalid flashcard response from backend"
                );
            }

            if (flashcardData.flashcards.length === 0) {
                throw new Error(
                    "No flashcards were generated"
                );
            }

            setFlashcards(
                flashcardData.flashcards
            );

        } catch (error) {

            console.error(
                "========== FLASHCARD ERROR =========="
            );

            console.error(error);

            console.error(
                "Backend response:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Failed to generate flashcards"
            );

        } finally {

            setLoadingFlashcards(false);
        }
    };

         // =========================
    // FLASHCARD NAVIGATION
    // =========================

    const nextFlashcard = () => {

        if (currentFlashcard < flashcards.length - 1) {

            setCurrentFlashcard(
                currentFlashcard + 1
            );

            setShowAnswer(false);
        }
    };


    const previousFlashcard = () => {

        if (currentFlashcard > 0) {

            setCurrentFlashcard(
                currentFlashcard - 1
            );

            setShowAnswer(false);
        }
    };


    const flipFlashcard = () => {

        setShowAnswer(
            (current) => !current
        );
    };
    // =========================
    // SELECT ANSWER
    // =========================

    const selectAnswer = (
        questionIndex,
        answer
    ) => {

        setSelectedAnswers(
            (current) => ({
                ...current,
                [questionIndex]: answer
            })
        );
    };


    return (
        <section className="ai-assistant">

            <h2>🤖 PrepMate AI</h2>

            {error && (
                <p>{error}</p>
            )}


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="ai-card">

                <h3>AI Summary</h3>

                <button
                    onClick={summarizeNote}
                    disabled={loadingSummary}
                >
                    {loadingSummary
                        ? "Generating..."
                        : "Summarize Note"}
                </button>

                {summary && (
                    <div>

                        <h4>Summary</h4>

                        <p>
                            {summary}
                        </p>

                    </div>
                )}

            </div>


            <hr />
 {/* =========================
                ASK AI
            ========================= */}

            <div>

                <h3>Ask AI</h3>

                <form onSubmit={askQuestion}>

                    <input
                        className="ai-question-input"
                        type="text"
                        value={question}
                        onChange={(e) =>
                            setQuestion(e.target.value)
                        }
                        placeholder="Ask something about this note..."
                    />

                    <button
                        className="ai-button"
                        type="submit"
                        disabled={loadingAnswer}
                    >
                        {loadingAnswer
                            ? "Thinking..."
                            : "Ask AI"}
                    </button>

                </form>

                {answer && (
                    
                    <div className="ai-response">

                        <h4>AI Answer</h4>

                        <p>
                            {answer}
                        </p>

                    </div>
                )}

            </div>


            <hr />


            {/* =========================
                QUIZ
            ========================= */}

            <div className="ai-card">

                 <h3>🧠 Practice Quiz</h3>

                <button
                    className="ai-button"
                    onClick={generateQuiz}
                    disabled={loadingQuiz}
                >
                    {loadingQuiz
                        ? "Generating Quiz..."
                        : "Generate Quiz"}
                </button>


                {quiz?.questions && (

                    <div className="quiz-question">

                        <h4>
                            Test Your Knowledge
                        </h4>

                        {quiz.questions.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className="quiz-question"
                                >

                                    <h4>
                                        {index + 1}.{" "}
                                        {item.question}
                                    </h4>


                                    {item.options?.map(
                                        (option, optionIndex) => (

                                            <label
                                                key={optionIndex}
                                               className="quiz-option"
                                            >

                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={option}
                                                    checked={
                                                        selectedAnswers[
                                                            index
                                                        ] === option
                                                    }
                                                    onChange={() =>
                                                        selectAnswer(
                                                            index,
                                                            option
                                                        )
                                                    }
                                                />

                                                {" "}

                                                {option}

                                            </label>

                                        )
                                    )}


                                    {selectedAnswers[index] && (

                                        <p>

                                            {selectedAnswers[index] ===
                                            item.correctAnswer
                                                ? "✅ Correct!"
                                                : `❌ Incorrect. Correct answer: ${item.correctAnswer}`}
                                                
                                        </p>

                                    )}


                                    {selectedAnswers[index] && (

                                        <p>
                                            <strong>
                                                Explanation:
                                            </strong>{" "}
                                            {item.explanation}
                                        </p>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            <hr />

            {/* =========================
                FLASHCARDS
            ========================= */}

           <div className="ai-card">

                <h3>🗂️ Flashcards</h3>

                <button
                    onClick={generateFlashcards}
                    disabled={loadingFlashcards}
                >
                    {loadingFlashcards
                        ? "Generating..."
                        : "Generate Flashcards"}
                </button>

                {flashcards.length > 0 && (

                    <div>

                        <p>
                            Card {currentFlashcard + 1} of {flashcards.length}
                        </p>

                        <div
                           className="flashcard"
                            onClick={flipFlashcard}
                        >

                            {!showAnswer ? (

                                <div>

                                    <h4>Question</h4>

                                    <p>
                                        {flashcards[currentFlashcard].question}
                                    </p>

                                    <small>
                                        Click to reveal answer
                                    </small>

                                </div>

                            ) : (

                                <div>

                                    <h4>Answer</h4>

                                    <p>
                                        {flashcards[currentFlashcard].answer}
                                    </p>

                                    <small>
                                        Click to see question
                                    </small>

                                </div>

                            )}

                        </div>

                        <div className="flashcard-navigation">

                            <button
                                onClick={previousFlashcard}
                                disabled={currentFlashcard === 0}
                            >
                                Previous
                            </button>

                            <button
                                onClick={flipFlashcard}
                            >
                                {showAnswer
                                    ? "Show Question"
                                    : "Show Answer"}
                            </button>

                            <button
                                onClick={nextFlashcard}
                                disabled={
                                    currentFlashcard ===
                                    flashcards.length - 1
                                }
                            >
                                Next
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}

export default AIAssistant;