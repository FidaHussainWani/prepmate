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

    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [loadingFlashcards, setLoadingFlashcards] =
        useState(false);

    const [error, setError] = useState("");


    // =========================
    // SUMMARY
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

            setSummary(
                response.data.result
            );

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                window.location.href = "/login";

                return;
            }

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

            setAnswer(
                response.data.result
            );

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                window.location.href = "/login";

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to get AI answer"
            );

        } finally {

            setLoadingAnswer(false);
        }
    };


    // =========================
    // QUIZ
    // =========================

    const generateQuiz = async () => {

        setLoadingQuiz(true);
        setError("");
        setQuiz(null);
        setSelectedAnswers({});

        try {

            const response = await api.post(
                "/ai/quiz",
                {
                    noteId: Number(noteId),
                    numberOfQuestions: 5
                }
            );

            const quizData = response.data;

            if (
                !quizData ||
                !Array.isArray(
                    quizData.questions
                )
            ) {

                throw new Error(
                    "Invalid quiz response from backend"
                );
            }

            setQuiz(quizData);

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                window.location.href = "/login";

                return;
            }

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
    // SELECT QUIZ ANSWER
    // =========================

    const selectAnswer = (
        questionIndex,
        selectedAnswer
    ) => {

        setSelectedAnswers(
            (current) => ({
                ...current,
                [questionIndex]:
                    selectedAnswer
            })
        );
    };


    // =========================
    // FLASHCARDS
    // =========================

    const generateFlashcards = async () => {

        setLoadingFlashcards(true);
        setError("");

        setFlashcards([]);
        setCurrentFlashcard(0);
        setShowAnswer(false);

        try {

            const response = await api.post(
                "/ai/flashcards",
                {
                    noteId: Number(noteId),
                    numberOfCards: 10
                }
            );

            const flashcardData =
                response.data;

            if (
                !flashcardData ||
                !Array.isArray(
                    flashcardData.flashcards
                )
            ) {

                throw new Error(
                    "Invalid flashcard response from backend"
                );
            }

            if (
                flashcardData.flashcards.length === 0
            ) {

                throw new Error(
                    "No flashcards were generated"
                );
            }

            setFlashcards(
                flashcardData.flashcards
            );

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                window.location.href = "/login";

                return;
            }

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

        if (
            currentFlashcard <
            flashcards.length - 1
        ) {

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
    // UI
    // =========================

    return (

        <section className="ai-assistant">

        

            {/* ERROR */}

            {error && (

                <div className="ai-error">
                    ⚠️ {error}
                </div>

            )}


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="ai-card">

                <div className="ai-card-header">

                    <div>
                        <h3>
                            📋 AI Summary
                        </h3>

                        <p>
                            Get a quick summary of
                            your note.
                        </p>
                    </div>

                </div>


                <button
                    className="ai-button"
                    onClick={summarizeNote}
                    disabled={loadingSummary}
                >

                    {loadingSummary
                        ? "Generating..."
                        : "Summarize Note"}

                </button>


                {summary && (

                    <div className="ai-response">

                        <h4>
                            Summary
                        </h4>

                        <p>
                            {summary}
                        </p>

                    </div>

                )}

            </div>


            {/* =========================
                ASK AI
            ========================= */}

            <div className="ai-card">

                <div className="ai-card-header">

                    <div>

                        <h3>
                            💬 Ask AI
                        </h3>

                        <p>
                            Ask a question about
                            this note.
                        </p>

                    </div>

                </div>


                <form
                    className="ai-question-form"
                    onSubmit={askQuestion}
                >

                    <input
                        className="ai-question-input"
                        type="text"
                        value={question}
                        onChange={(e) =>
                            setQuestion(
                                e.target.value
                            )
                        }
                        placeholder="Ask something about this note..."
                        disabled={loadingAnswer}
                    />

                    <button
                        className="ai-button"
                        type="submit"
                        disabled={
                            loadingAnswer ||
                            !question.trim()
                        }
                    >

                        {loadingAnswer
                            ? "Thinking..."
                            : "Ask AI"}

                    </button>

                </form>


                {answer && (

                    <div className="ai-response">

                        <h4>
                            AI Answer
                        </h4>

                        <p>
                            {answer}
                        </p>

                    </div>

                )}

            </div>


            {/* =========================
                QUIZ
            ========================= */}

            <div className="ai-card">

                <div className="ai-card-header">

                    <div>

                        <h3>
                            🧠 Practice Quiz
                        </h3>

                        <p>
                            Test your understanding
                            of this note.
                        </p>

                    </div>

                </div>


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

                    <div className="quiz-container">

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


                                    <div className="quiz-options">

                                        {item.options?.map(
                                            (
                                                option,
                                                optionIndex
                                            ) => (

                                                <label
                                                    key={
                                                        optionIndex
                                                    }
                                                    className={
                                                        selectedAnswers[
                                                            index
                                                        ] === option
                                                            ? "quiz-option selected"
                                                            : "quiz-option"
                                                    }
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

                                                    <span>
                                                        {option}
                                                    </span>

                                                </label>

                                            )
                                        )}

                                    </div>


                                    {selectedAnswers[index] && (

                                        <div
                                            className={
                                                selectedAnswers[
                                                    index
                                                ] ===
                                                item.correctAnswer
                                                    ? "quiz-result correct"
                                                    : "quiz-result incorrect"
                                            }
                                        >

                                            <strong>

                                                {selectedAnswers[
                                                    index
                                                ] ===
                                                item.correctAnswer
                                                    ? "✅ Correct!"
                                                    : "❌ Incorrect"}

                                            </strong>


                                            {selectedAnswers[
                                                index
                                            ] !==
                                                item.correctAnswer && (

                                                <p>
                                                    Correct answer:{" "}
                                                    {
                                                        item.correctAnswer
                                                    }
                                                </p>

                                            )}


                                            {item.explanation && (

                                                <p>

                                                    <strong>
                                                        Explanation:
                                                    </strong>{" "}

                                                    {
                                                        item.explanation
                                                    }

                                                </p>

                                            )}

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* =========================
                FLASHCARDS
            ========================= */}

            <div className="ai-card">

                <div className="ai-card-header">

                    <div>

                        <h3>
                            🗂️ Flashcards
                        </h3>

                        <p>
                            Revise important concepts
                            using flashcards.
                        </p>

                    </div>

                </div>


                <button
                    className="ai-button"
                    onClick={generateFlashcards}
                    disabled={loadingFlashcards}
                >

                    {loadingFlashcards
                        ? "Generating..."
                        : "Generate Flashcards"}

                </button>


                {flashcards.length > 0 && (

                    <div className="flashcard-container">

                        <div className="flashcard-progress">

                            Card{" "}
                            {currentFlashcard + 1}
                            {" "}of{" "}
                            {flashcards.length}

                        </div>


                        <button
                            type="button"
                            className="flashcard"
                            onClick={flipFlashcard}
                        >

                            {!showAnswer ? (

                                <div>

                                    <span className="flashcard-label">
                                        Question
                                    </span>

                                    <h4>
                                        {
                                            flashcards[
                                                currentFlashcard
                                            ].question
                                        }
                                    </h4>

                                    <small>
                                        Click to reveal answer
                                    </small>

                                </div>

                            ) : (

                                <div>

                                    <span className="flashcard-label">
                                        Answer
                                    </span>

                                    <h4>
                                        {
                                            flashcards[
                                                currentFlashcard
                                            ].answer
                                        }
                                    </h4>

                                    <small>
                                        Click to see question
                                    </small>

                                </div>

                            )}

                        </button>


                        <div className="flashcard-navigation">

                            <button
                                type="button"
                                onClick={
                                    previousFlashcard
                                }
                                disabled={
                                    currentFlashcard === 0
                                }
                            >
                                ← Previous
                            </button>


                            <button
                                type="button"
                                onClick={
                                    flipFlashcard
                                }
                            >

                                {showAnswer
                                    ? "Show Question"
                                    : "Show Answer"}

                            </button>


                            <button
                                type="button"
                                onClick={
                                    nextFlashcard
                                }
                                disabled={
                                    currentFlashcard ===
                                    flashcards.length - 1
                                }
                            >
                                Next →
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </section>
    );
}

export default AIAssistant;