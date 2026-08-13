import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import "./EditNote.css";

function EditNote() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tagIds, setTagIds] = useState([]);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                noteResponse,
                categoriesResponse,
                tagsResponse
            ] = await Promise.all([
                api.get(`/notes/${id}`),
                api.get("/categories"),
                api.get("/tags")
            ]);

            const note = noteResponse.data;

            setTitle(note.title || "");
            setContent(note.content || "");

            setCategoryId(
                note.categoryId
                    ? String(note.categoryId)
                    : ""
            );

            setTagIds(
                note.tagIds || []
            );

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
                "Failed to load note"
            );

        } finally {

            setLoading(false);
        }
    };


    const handleTagChange = (tagId) => {

        setTagIds((currentTags) => {

            if (currentTags.includes(tagId)) {

                return currentTags.filter(
                    (id) => id !== tagId
                );
            }

            return [
                ...currentTags,
                tagId
            ];
        });
    };


    const handleUpdate = async (e) => {

        e.preventDefault();

        if (!title.trim()) {

            setError(
                "Please enter a note title."
            );

            return;
        }

        if (!content.trim()) {

            setError(
                "Please enter note content."
            );

            return;
        }

        setSaving(true);
        setError("");

        try {

            await api.put(`/notes/${id}`, {

                title: title.trim(),

                content: content.trim(),

                categoryId:
                    categoryId === ""
                        ? null
                        : Number(categoryId),

                tagIds

            });

            navigate(`/notes/${id}`);

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to update note"
            );

        } finally {

            setSaving(false);
        }
    };


    if (loading) {

        return (

            <div className="edit-note-loading">

                <div className="edit-spinner"></div>

                <p>
                    Loading note...
                </p>

            </div>
        );
    }


    return (

        <div className="edit-note-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <Sidebar />


            {/* =========================
                MAIN
            ========================= */}

            <main className="edit-note-main">

                {/* =========================
                    HEADER
                ========================= */}

                <header className="edit-note-header">

                    <div>

                        <h1>
                            Edit Note
                        </h1>

                        <p>
                            Update and organize your
                            study note.
                        </p>

                    </div>


                    <button
                        className="edit-back-button"
                        onClick={() =>
                            navigate(`/notes/${id}`)
                        }
                    >
                        ← Back to Note
                    </button>

                </header>


                {/* =========================
                    FORM CARD
                ========================= */}

                <form
                    className="edit-note-card"
                    onSubmit={handleUpdate}
                >

                    <div className="edit-card-title">

                        <div className="edit-card-icon">
                            ✏️
                        </div>

                        <div>

                            <h2>
                                Edit Study Note
                            </h2>

                            <p>
                                Make your changes and
                                save them when finished.
                            </p>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="edit-note-error">
                            ⚠️ {error}
                        </div>

                    )}


                    {/* TITLE */}

                    <div className="edit-form-group">

                        <label htmlFor="edit-title">
                            Note Title
                        </label>

                        <input
                            id="edit-title"
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="Enter note title"
                            disabled={saving}
                            required
                        />

                    </div>


                    {/* CONTENT */}

                    <div className="edit-form-group">

                        <div className="edit-label-row">

                            <label htmlFor="edit-content">
                                Note Content
                            </label>

                            <span>
                                {content.length} characters
                            </span>

                        </div>

                        <textarea
                            id="edit-content"
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            rows="16"
                            placeholder="Write your study notes..."
                            disabled={saving}
                            required
                        />

                        <small>
                            Your AI tools will use
                            the updated content.
                        </small>

                    </div>


                    {/* CATEGORY */}

                    <div className="edit-form-group">

                        <label htmlFor="edit-category">
                            Category
                        </label>

                        <select
                            id="edit-category"
                            value={categoryId}
                            onChange={(e) =>
                                setCategoryId(
                                    e.target.value
                                )
                            }
                            disabled={saving}
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

                    <div className="edit-form-group">

                        <div className="edit-label-row">

                            <label>
                                Tags
                            </label>

                            <span>
                                {tagIds.length} selected
                            </span>

                        </div>


                        {tags.length === 0 ? (

                            <div className="edit-no-tags">
                                No tags available. Create
                                tags from the Tags page.
                            </div>

                        ) : (

                            <div className="edit-tags-container">

                                {tags.map((tag) => {

                                    const selected =
                                        tagIds.includes(
                                            tag.id
                                        );

                                    return (

                                        <button
                                            type="button"
                                            key={tag.id}
                                            className={`edit-tag-option ${
                                                selected
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleTagChange(
                                                    tag.id
                                                )
                                            }
                                            disabled={saving}
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


                    {/* ACTIONS */}

                    <div className="edit-form-actions">

                        <button
                            type="button"
                            className="edit-cancel-button"
                            onClick={() =>
                                navigate(`/notes/${id}`)
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="edit-save-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </form>

            </main>

        </div>
    );
}

export default EditNote;