import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

            setTitle(note.title);
            setContent(note.content);

            setCategoryId(
                note.categoryId
                    ? String(note.categoryId)
                    : ""
            );

            setTagIds(note.tagIds || []);

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

            return [...currentTags, tagId];
        });
    };


    const handleUpdate = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");

        try {

            await api.put(`/notes/${id}`, {
                title,
                content,
                categoryId:
                    categoryId === ""
                        ? null
                        : Number(categoryId),
                tagIds
            });

            navigate(`/notes/${id}`);

        } catch (error) {

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

        <div className="edit-note-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="edit-note-header">

                <button
                    className="edit-back-button"
                    onClick={() =>
                        navigate(`/notes/${id}`)
                    }
                >
                    ← Back to Note
                </button>

                <div>

                    <h1>
                        Edit Note
                    </h1>

                    <p>
                        Update and organize your study note
                    </p>

                </div>

            </div>


            {/* =========================
                FORM CARD
            ========================= */}

            <div className="edit-note-card">

                <div className="edit-form-header">

                    <div className="edit-form-icon">
                        ✏️
                    </div>

                    <div>

                        <h2>
                            Edit Study Note
                        </h2>

                        <p>
                            Make your changes and save them
                            when you're finished.
                        </p>

                    </div>

                </div>


                {error && (

                    <div className="edit-note-error">
                        ⚠️ {error}
                    </div>

                )}


                <form
                    onSubmit={handleUpdate}
                    className="edit-note-form"
                >

                    {/* TITLE */}

                    <div className="edit-form-group">

                        <label htmlFor="edit-title">
                            Title
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
                            required
                        />

                    </div>


                    {/* CONTENT */}

                    <div className="edit-form-group">

                        <label htmlFor="edit-content">
                            Content
                        </label>

                        <textarea
                            id="edit-content"
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            rows="15"
                            placeholder="Write your study notes..."
                            required
                        />

                        <span className="edit-field-hint">
                            Update the content of your note.
                            Your AI tools will use the updated
                            content.
                        </span>

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

                        <label>
                            Tags
                        </label>

                        {tags.length === 0 ? (

                            <div className="edit-no-tags">
                                No tags available.
                            </div>

                        ) : (

                            <div className="edit-tags-container">

                                {tags.map(
                                    (tag) => (

                                        <label
                                            key={tag.id}
                                            className={
                                                tagIds.includes(
                                                    tag.id
                                                )
                                                    ? "edit-tag-option selected"
                                                    : "edit-tag-option"
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
                            className="save-note-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditNote;