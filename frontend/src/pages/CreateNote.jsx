import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CreateNote.css";

function CreateNote() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tagIds, setTagIds] = useState([]);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCategoriesAndTags();
    }, []);

    const loadCategoriesAndTags = async () => {

        try {

            const [
                categoriesResponse,
                tagsResponse
            ] = await Promise.all([
                api.get("/categories"),
                api.get("/tags")
            ]);

            setCategories(
                categoriesResponse.data
            );

            setTags(
                tagsResponse.data
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load categories and tags"
            );

        } finally {

            setLoadingOptions(false);
        }
    };

    const handleTagChange = (id) => {

        setTagIds((currentTags) => {

            if (currentTags.includes(id)) {

                return currentTags.filter(
                    (tagId) => tagId !== id
                );

            }

            return [...currentTags, id];
        });
    };

    const handleCreate = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            await api.post("/notes", {
                title,
                content,
                categoryId:
                    categoryId === ""
                        ? null
                        : Number(categoryId),
                tagIds
            });

            navigate("/notes");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create note"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="create-note-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="create-note-header">

                <button
                    className="create-back-button"
                    onClick={() =>
                        navigate("/notes")
                    }
                >
                    ← Back to Notes
                </button>

                <div>
                    <h1>Create New Note</h1>

                    <p>
                        Create and organize your study notes
                    </p>
                </div>

            </div>


            {/* =========================
                FORM CARD
            ========================= */}

            <div className="create-note-card">

                <div className="form-header">

                    <div className="form-icon">
                        📝
                    </div>

                    <div>
                        <h2>
                            New Study Note
                        </h2>

                        <p>
                            Add your content and organize it
                            with categories and tags.
                        </p>
                    </div>

                </div>


                {loadingOptions ? (

                    <div className="options-loading">

                        <div className="create-spinner"></div>

                        <p>
                            Loading categories and tags...
                        </p>

                    </div>

                ) : (

                    <form
                        onSubmit={handleCreate}
                        className="create-note-form"
                    >

                        {/* TITLE */}

                        <div className="form-group">

                            <label htmlFor="note-title">
                                Title
                            </label>

                            <input
                                id="note-title"
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter note title"
                                required
                            />

                        </div>


                        {/* CONTENT */}

                        <div className="form-group">

                            <label htmlFor="note-content">
                                Content
                            </label>

                            <textarea
                                id="note-content"
                                value={content}
                                onChange={(e) =>
                                    setContent(
                                        e.target.value
                                    )
                                }
                                placeholder="Write your study notes here..."
                                rows="15"
                                required
                            />

                            <span className="field-hint">
                                Write clear and detailed notes.
                                PrepMate AI can later summarize
                                them, answer questions, create
                                quizzes and generate flashcards.
                            </span>

                        </div>


                        {/* CATEGORY */}

                        <div className="form-group">

                            <label htmlFor="note-category">
                                Category
                            </label>

                            <select
                                id="note-category"
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    No Category
                                </option>

                                {categories.map(
                                    (category) => (

                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* TAGS */}

                        <div className="form-group">

                            <label>
                                Tags
                            </label>

                            {tags.length === 0 ? (

                                <div className="no-tags">
                                    No tags available.
                                </div>

                            ) : (

                                <div className="tags-container">

                                    {tags.map(
                                        (tag) => (

                                            <label
                                                key={tag.id}
                                                className={
                                                    tagIds.includes(
                                                        tag.id
                                                    )
                                                        ? "tag-option selected"
                                                        : "tag-option"
                                                }
                                            >

                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        tagIds.includes(
                                                            tag.id
                                                        )
                                                    }
                                                    onChange={() =>
                                                        handleTagChange(
                                                            tag.id
                                                        )
                                                    }
                                                />

                                                <span>
                                                    #{tag.name}
                                                </span>

                                            </label>

                                        )
                                    )}

                                </div>

                            )}

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="create-note-error">
                                ⚠️ {error}
                            </div>

                        )}


                        {/* ACTIONS */}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    navigate("/notes")
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="submit-note-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Note"}
                            </button>

                        </div>

                    </form>

                )}

            </div>

        </div>
    );
}

export default CreateNote;