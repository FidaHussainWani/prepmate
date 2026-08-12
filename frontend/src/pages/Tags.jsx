import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Tags.css";

function Tags() {

    const navigate = useNavigate();

    const [tags, setTags] = useState([]);
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/tags");

            setTags(response.data);

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load tags"
            );

        } finally {

            setLoading(false);
        }
    };


    const createTag = async (e) => {

        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        try {

            setSaving(true);
            setError("");

            await api.post("/tags", {
                name: name.trim()
            });

            setName("");

            await loadTags();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create tag"
            );

        } finally {

            setSaving(false);
        }
    };


    const deleteTag = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this tag?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await api.delete(
                `/tags/${id}`
            );

            await loadTags();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete tag"
            );
        }
    };


    return (

        <div className="tags-page">

            <div className="tags-header">

                <button
                    className="tags-back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

                <div>

                    <h1>
                        Tags
                    </h1>

                    <p>
                        Add labels to organize your notes.
                    </p>

                </div>

            </div>


            <div className="tags-card">

                <h2>
                    Create Tag
                </h2>

                <form
                    onSubmit={createTag}
                    className="tag-create-form"
                >

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter tag name"
                    />

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            !name.trim()
                        }
                    >
                        {saving
                            ? "Creating..."
                            : "Add Tag"}
                    </button>

                </form>

            </div>


            {error && (

                <div className="tags-error">
                    ⚠️ {error}
                </div>

            )}


            <div className="tags-card">

                <h2>
                    Your Tags
                </h2>

                {loading ? (

                    <p className="tags-message">
                        Loading tags...
                    </p>

                ) : tags.length === 0 ? (

                    <div className="tags-empty">

                        <div className="empty-icon">
                            🏷️
                        </div>

                        <h3>
                            No tags yet
                        </h3>

                        <p>
                            Create your first tag above.
                        </p>

                    </div>

                ) : (

                    <div className="tag-list">

                        {tags.map(
                            (tag) => (

                                <div
                                    className="tag-item"
                                    key={tag.id}
                                >

                                    <span className="tag-name">
                                        # {tag.name}
                                    </span>

                                    <button
                                        className="tag-delete"
                                        onClick={() =>
                                            deleteTag(
                                                tag.id
                                            )
                                        }
                                    >
                                        🗑️
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Tags;