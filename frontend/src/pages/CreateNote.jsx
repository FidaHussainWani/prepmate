import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
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

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                navigate("/login");

                return;
            }

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

        if (!title.trim()) {

            setError("Please enter a note title.");

            return;
        }

        if (!content.trim()) {

            setError("Please enter note content.");

            return;
        }

        setLoading(true);
        setError("");

        try {

            await api.post("/notes", {

                title: title.trim(),

                content: content.trim(),

                categoryId:
                    categoryId === ""
                        ? null
                        : Number(categoryId),

                tagIds

            });

            navigate("/notes");

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to create note"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="create-note-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <Sidebar />


            {/* =========================
                MAIN
            ========================= */}

            <main className="create-note-main">

                {/* =========================
                    HEADER
                ========================= */}

                <header className="create-note-header">

                    <div>

                        <h1>
                            Create New Note
                        </h1>

                        <p>
                            Add your study material and
                            organize it with categories
                            and tags.
                        </p>

                    </div>

                </header>


                {/* =========================
                    FORM CARD
                ========================= */}

                <form
                    className="create-note-card"
                    onSubmit={handleCreate}
                >

                    {/* TITLE */}

                    <div className="form-group">

                        <label htmlFor="note-title">
                            Note Title
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
                            placeholder="e.g. Java Collections"
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* CONTENT */}

                    <div className="form-group">

                        <div className="content-label-row">

                            <label htmlFor="note-content">
                                Note Content
                            </label>

                            <span>
                                {content.length} characters
                            </span>

                        </div>

                        <textarea
                            id="note-content"
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            placeholder="Write your study notes here..."
                            rows="16"
                            disabled={loading}
                            required
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="form-group">

                        <label htmlFor="note-category">
                            Category
                        </label>

                        {loadingOptions ? (

                            <div className="options-loading">
                                Loading categories...
                            </div>

                        ) : (

                            <select
                                id="note-category"
                                value={categoryId}
                                onChange={(e) =>
                                    setCategoryId(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
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

                        )}

                    </div>


                    {/* TAGS */}

                    <div className="form-group">

                        <div className="content-label-row">

                            <label>
                                Tags
                            </label>

                            <span>
                                {tagIds.length} selected
                            </span>

                        </div>


                        {loadingOptions ? (

                            <div className="options-loading">
                                Loading tags...
                            </div>

                        ) : tags.length === 0 ? (

                            <div className="no-tags">
                                No tags available. You can
                                create tags from the Tags page.
                            </div>

                        ) : (

                            <div className="tag-selection">

                                {tags.map((tag) => {

                                    const selected =
                                        tagIds.includes(
                                            tag.id
                                        );

                                    return (

                                        <button
                                            type="button"
                                            key={tag.id}
                                            className={`tag-option ${
                                                selected
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleTagChange(
                                                    tag.id
                                                )
                                            }
                                            disabled={loading}
                                        >

                                            {selected
                                                ? "✓ "
                                                : ""}

                                            #{tag.name}

                                        </button>

                                    );

                                })}

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

                    <div className="create-note-actions">

                        <button
                            type="button"
                            className="cancel-note-button"
                            onClick={() =>
                                navigate("/notes")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="save-note-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating..."
                                : "Create Note"}

                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default CreateNote;