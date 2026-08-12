import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Categories.css";

function Categories() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/categories");

            setCategories(response.data);

        } catch (error) {

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load categories"
            );

        } finally {

            setLoading(false);
        }
    };


    const createCategory = async (e) => {

        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        try {

            setSaving(true);
            setError("");

            await api.post("/categories", {
                name: name.trim()
            });

            setName("");

            await loadCategories();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to create category"
            );

        } finally {

            setSaving(false);
        }
    };


    const startEdit = (category) => {

        setEditingId(category.id);
        setEditingName(category.name);
        setError("");
    };


    const cancelEdit = () => {

        setEditingId(null);
        setEditingName("");
    };


    const updateCategory = async (id) => {

        if (!editingName.trim()) {
            return;
        }

        try {

            setSaving(true);
            setError("");

            await api.put(
                `/categories/${id}`,
                {
                    name: editingName.trim()
                }
            );

            cancelEdit();

            await loadCategories();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update category"
            );

        } finally {

            setSaving(false);
        }
    };


    const deleteCategory = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this category?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await api.delete(
                `/categories/${id}`
            );

            await loadCategories();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete category"
            );
        }
    };


    return (

        <div className="categories-page">

            <div className="categories-header">

                <button
                    className="categories-back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

                <div>

                    <h1>
                        Categories
                    </h1>

                    <p>
                        Organize your notes by category.
                    </p>

                </div>

            </div>


            <div className="categories-card">

                <h2>
                    Create Category
                </h2>

                <form
                    onSubmit={createCategory}
                    className="category-create-form"
                >

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Enter category name"
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
                            : "Add Category"}
                    </button>

                </form>

            </div>


            {error && (

                <div className="categories-error">
                    ⚠️ {error}
                </div>

            )}


            <div className="categories-card">

                <div className="categories-list-header">

                    <div>

                        <h2>
                            Your Categories
                        </h2>

                        <p>
                            {categories.length}{" "}
                            {categories.length === 1
                                ? "category"
                                : "categories"}
                        </p>

                    </div>

                </div>


                {loading ? (

                    <p className="categories-message">
                        Loading categories...
                    </p>

                ) : categories.length === 0 ? (

                    <div className="categories-empty">

                        <div className="empty-icon">
                            📁
                        </div>

                        <h3>
                            No categories yet
                        </h3>

                        <p>
                            Create your first category
                            above.
                        </p>

                    </div>

                ) : (

                    <div className="category-list">

                        {categories.map(
                            (category) => (

                                <div
                                    className="category-item"
                                    key={category.id}
                                >

                                    {editingId ===
                                    category.id ? (

                                        <input
                                            className="category-edit-input"
                                            value={
                                                editingName
                                            }
                                            onChange={(e) =>
                                                setEditingName(
                                                    e.target.value
                                                )
                                            }
                                            autoFocus
                                        />

                                    ) : (

                                        <div className="category-name">

                                            <span>
                                                📁
                                            </span>

                                            {category.name}

                                        </div>

                                    )}


                                    <div className="category-actions">

                                        {editingId ===
                                        category.id ? (

                                            <>
                                                <button
                                                    className="category-save"
                                                    onClick={() =>
                                                        updateCategory(
                                                            category.id
                                                        )
                                                    }
                                                    disabled={
                                                        saving ||
                                                        !editingName.trim()
                                                    }
                                                >
                                                    Save
                                                </button>

                                                <button
                                                    className="category-cancel"
                                                    onClick={
                                                        cancelEdit
                                                    }
                                                >
                                                    Cancel
                                                </button>
                                            </>

                                        ) : (

                                            <>
                                                <button
                                                    className="category-edit"
                                                    onClick={() =>
                                                        startEdit(
                                                            category
                                                        )
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    className="category-delete"
                                                    onClick={() =>
                                                        deleteCategory(
                                                            category.id
                                                        )
                                                    }
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Categories;