import AIAssistant from "../components/AIAssistant";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "./NoteDetails.css";

function NoteDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadNote();
    }, [id]);


    const loadNote = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/notes/${id}`
            );

            setNote(response.data);

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load note"
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (

            <div className="note-loading">

                <div className="note-spinner"></div>

                <p>
                    Loading note...
                </p>

            </div>
        );
    }


    if (error) {

        return (

            <div className="note-error-page">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/notes")
                    }
                >
                    ← Back to Notes
                </button>

            </div>
        );
    }


    if (!note) {

        return (

            <div className="note-error-page">

                <h2>
                    Note not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/notes")
                    }
                >
                    ← Back to Notes
                </button>

            </div>
        );
    }


    return (

        <div className="note-details-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <Sidebar />


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="note-details-main">

                {/* =========================
                    HEADER
                ========================= */}

                <header className="note-details-header">

                    <button
                        className="note-back-button"
                        onClick={() =>
                            navigate("/notes")
                        }
                    >
                        ← Back to Notes
                    </button>


                    <button
                        className="note-edit-button"
                        onClick={() =>
                            navigate(
                                `/notes/${id}/edit`
                            )
                        }
                    >
                        ✏️ Edit Note
                    </button>

                </header>


                {/* =========================
                    NOTE CARD
                ========================= */}

                <article className="note-details-card">

                    {/* TITLE */}

                    <div className="note-title-section">

                        <h1 className="note-details-title">
                            {note.title}
                        </h1>

                    </div>


                    {/* =========================
                        META
                    ========================= */}

                    <div className="note-details-meta">

                        {note.categoryName && (

                            <span className="note-meta-item category">
                                📁 {note.categoryName}
                            </span>

                        )}


                        {note.tagNames?.map((tag) => (

                            <span
                                key={tag}
                                className="note-meta-item tag"
                            >
                                🏷️ {tag}
                            </span>

                        ))}


                        {note.favorite && (

                            <span className="note-meta-item favorite">
                                ⭐ Favorite
                            </span>

                        )}

                    </div>


                    {/* =========================
                        CONTENT
                    ========================= */}

                    <div className="note-content-section">

                        <h3>
                            Note Content
                        </h3>

                        <div className="note-details-content">

                            {note.content}

                        </div>

                    </div>


                    {/* =========================
                        DATES
                    ========================= */}

                    <div className="note-dates">

                        <div className="note-date-item">

                            <span>
                                Created
                            </span>

                            <strong>
                                {note.createdAt
                                    ? new Date(
                                        note.createdAt
                                    ).toLocaleString()
                                    : "—"}
                            </strong>

                        </div>


                        <div className="note-date-item">

                            <span>
                                Last Updated
                            </span>

                            <strong>
                                {note.updatedAt
                                    ? new Date(
                                        note.updatedAt
                                    ).toLocaleString()
                                    : "—"}
                            </strong>

                        </div>

                    </div>

                </article>


                {/* =========================
                    AI ASSISTANT
                ========================= */}

                <section className="ai-section">

                    <div className="ai-section-header">

                        <div className="ai-section-icon">
                            🤖
                        </div>

                        <div>

                            <h2>
                                PrepMate AI
                            </h2>

                            <p>
                                Study smarter with
                                AI-powered tools for
                                this note.
                            </p>

                        </div>

                    </div>


                    <div className="ai-assistant-container">

                        <AIAssistant
                            noteId={id}
                        />

                    </div>

                </section>

            </main>

        </div>
    );
}

export default NoteDetails;