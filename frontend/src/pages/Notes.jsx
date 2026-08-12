import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Notes.css";

function Notes() {

    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadNotes();
    }, [page, keyword]);


    const loadNotes = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/notes",
                {
                    params: {
                        page,
                        size: 10,
                        ...(keyword.trim()
                            ? {
                                keyword: keyword.trim()
                            }
                            : {})
                    }
                }
            );

            setNotes(
                response.data.content
            );

            setTotalPages(
                response.data.totalPages
            );

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load notes"
            );

        } finally {

            setLoading(false);
        }
    };


    const toggleFavorite = async (id) => {

        try {

            await api.patch(
                `/notes/${id}/favorite`
            );

            loadNotes();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update favorite"
            );
        }
    };


    const deleteNote = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this note?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/notes/${id}`
            );

            loadNotes();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete note"
            );
        }
    };


    const getPreview = (content) => {

        if (!content) {
            return "No content available.";
        }

        if (content.length <= 180) {
            return content;
        }

        return content.substring(0, 180) + "...";
    };


    return (
        <div className="notes-page">

            {/* =========================
                HEADER
            ========================= */}

            <header className="notes-header">

                <div className="notes-header-left">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>

                    <div>
                        <h1>My Notes</h1>

                        <p>
                            Organize and manage your study notes
                        </p>
                    </div>

                </div>


                <button
                    className="create-note-button"
                    onClick={() =>
                        navigate("/notes/create")
                    }
                >
                    + New Note
                </button>

            </header>


            {/* =========================
                SEARCH
            ========================= */}

            <section className="notes-toolbar">

                <div className="search-container">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={keyword}
                        onChange={(e) => {

                            setPage(0);

                            setKeyword(
                                e.target.value
                            );
                        }}
                    />

                </div>

            </section>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="notes-error">

                    {error}

                </div>
            )}


            {/* =========================
                LOADING
            ========================= */}

            {loading ? (

                <div className="notes-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading notes...
                    </p>

                </div>

            ) : notes.length === 0 ? (

                /* =========================
                   EMPTY STATE
                ========================= */

                <div className="notes-empty">

                    <div className="empty-icon">
                        📝
                    </div>

                    <h2>
                        No notes found
                    </h2>

                    <p>
                        {keyword
                            ? "Try searching with a different keyword."
                            : "Create your first note to get started."
                        }
                    </p>

                    {!keyword && (

                        <button
                            className="create-note-button"
                            onClick={() =>
                                navigate("/notes/create")
                            }
                        >
                            + Create Note
                        </button>

                    )}

                </div>

            ) : (

                /* =========================
                   NOTES GRID
                ========================= */

                <section className="notes-grid">

                    {notes.map((note) => (

                        <article
                            key={note.id}
                            className="note-card"
                        >

                            {/* CARD HEADER */}

                            <div className="note-card-header">

                                <h2>
                                    {note.title}
                                </h2>

                                <button
                                    className={
                                        note.favorite
                                            ? "favorite-button active"
                                            : "favorite-button"
                                    }
                                    onClick={() =>
                                        toggleFavorite(
                                            note.id
                                        )
                                    }
                                    title={
                                        note.favorite
                                            ? "Remove from favorites"
                                            : "Add to favorites"
                                    }
                                >
                                    {note.favorite
                                        ? "★"
                                        : "☆"}
                                </button>

                            </div>


                            {/* CONTENT */}

                            <p className="note-preview">

                                {getPreview(
                                    note.content
                                )}

                            </p>


                            {/* CATEGORY */}

                            {note.categoryName && (

                                <div className="note-category">

                                    📁{" "}
                                    {note.categoryName}

                                </div>
                            )}


                            {/* TAGS */}

                            {note.tagNames?.length > 0 && (

                                <div className="note-tags">

                                    {note.tagNames.map(
                                        (tag, index) => (

                                            <span
                                                key={index}
                                                className="note-tag"
                                            >
                                                #{tag}
                                            </span>

                                        )
                                    )}

                                </div>
                            )}


                            {/* ACTIONS */}

                            <div className="note-actions">

                                <button
                                    className="view-button"
                                    onClick={() =>
                                        navigate(
                                            `/notes/${note.id}`
                                        )
                                    }
                                >
                                    View
                                </button>


                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        navigate(
                                            `/notes/${note.id}/edit`
                                        )
                                    }
                                >
                                    Edit
                                </button>


                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deleteNote(
                                            note.id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </article>

                    ))}

                </section>
            )}


            {/* =========================
                PAGINATION
            ========================= */}

            {!loading &&
                totalPages > 1 && (

                    <div className="pagination">

                        <button
                            disabled={
                                page === 0
                            }
                            onClick={() =>
                                setPage(
                                    page - 1
                                )
                            }
                        >
                            ← Previous
                        </button>


                        <span>
                            Page{" "}
                            <strong>
                                {page + 1}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {totalPages}
                            </strong>
                        </span>


                        <button
                            disabled={
                                page >=
                                totalPages - 1
                            }
                            onClick={() =>
                                setPage(
                                    page + 1
                                )
                            }
                        >
                            Next →
                        </button>

                    </div>
                )}

        </div>
    );
}

export default Notes;