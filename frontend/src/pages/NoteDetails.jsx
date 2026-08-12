import AIAssistant from "../components/AIAssistant";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
                Loading note...
            </div>
        );
    }


    if (error) {

        return (
            <div className="note-error">
                {error}
            </div>
        );
    }


    if (!note) {

        return (
            <div className="note-error">
                Note not found.
            </div>
        );
    }


    return (

        <div className="note-details-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="note-details-header">

                <button
                    className="note-back-button"
                    onClick={() =>
                        navigate("/notes")
                    }
                >
                    ← Back to Notes
                </button>


                <div className="note-actions">

                    <button
                        className="note-action-button"
                        onClick={() =>
                            navigate(`/notes/${id}/edit`)
                        }
                    >
                        ✏️ Edit
                    </button>

                </div>

            </div>


            {/* =========================
                NOTE CONTENT
            ========================= */}

            <div className="note-details-card">

                <h1 className="note-details-title">
                    {note.title}
                </h1>


                {/* Category + Tags */}

                <div className="note-details-meta">

                    {note.categoryName && (

                        <span className="note-meta-item">
                            📁 {note.categoryName}
                        </span>

                    )}


                    {note.tagNames?.length > 0 && (

                        note.tagNames.map((tag) => (

                            <span
                                key={tag}
                                className="note-meta-item"
                            >
                                🏷️ {tag}
                            </span>

                        ))

                    )}


                    {note.favorite && (

                        <span className="note-meta-item">
                            ⭐ Favorite
                        </span>

                    )}

                </div>


                {/* Note Content */}

                <div className="note-details-content">
                    {note.content}
                </div>


                {/* Dates */}

                <div className="note-dates">

                    <div>

                        <strong>
                            Created
                        </strong>

                        <span>
                            {new Date(
                                note.createdAt
                            ).toLocaleString()}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Last Updated
                        </strong>

                        <span>
                            {new Date(
                                note.updatedAt
                            ).toLocaleString()}
                        </span>

                    </div>

                </div>

            </div>


            {/* =========================
                AI ASSISTANT
            ========================= */}

            <div className="ai-section">

                <div className="ai-section-header">

                    <h2>
                        🤖 PrepMate AI
                    </h2>

                    <p>
                        Study smarter with AI-powered
                        tools for this note.
                    </p>

                </div>


                <AIAssistant
                    noteId={id}
                />

            </div>

        </div>
    );
}

export default NoteDetails;