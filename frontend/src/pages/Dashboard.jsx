import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const [
                dashboardResponse,
                statisticsResponse,
                activityResponse
            ] = await Promise.all([
                api.get("/dashboard"),
                api.get("/dashboard/statistics"),
                api.get("/dashboard/activity")
            ]);

            setDashboard(dashboardResponse.data);
            setStatistics(statisticsResponse.data);
            setActivities(activityResponse.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {

                localStorage.removeItem("token");
                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);
        }
    };


    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    const refreshDashboard = () => {
        setLoading(true);
        setError("");
        loadDashboard();
    };


    const getActivityIcon = (type) => {

        switch (type) {

            case "SUMMARY":
                return "📋";

            case "QUESTION":
                return "💬";

            case "QUIZ":
                return "🧠";

            case "FLASHCARDS":
                return "🗂️";

            default:
                return "🤖";
        }
    };


    const getActivityName = (type) => {

        switch (type) {

            case "SUMMARY":
                return "AI Summary";

            case "QUESTION":
                return "AI Question";

            case "QUIZ":
                return "AI Quiz";

            case "FLASHCARDS":
                return "Flashcards";

            default:
                return type;
        }
    };


    if (loading) {

        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }


    if (error) {

        return (
            <div className="dashboard-error">

                <h2>Something went wrong</h2>

                <p>{error}</p>

                <button
                    onClick={loadDashboard}
                    className="retry-button"
                >
                    Try Again
                </button>

            </div>
        );
    }
return (

        <div className="dashboard-page">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="dashboard-sidebar">

                <div className="dashboard-logo">
                    📚 PrepMate
                </div>


                <nav className="dashboard-nav">

                    <button className="active">
                        🏠 Dashboard
                    </button>

                    <button
                        onClick={() => navigate("/notes")}
                    >
                        📝 My Notes
                    </button>

                    <button
                        onClick={() => navigate("/notes/create")}
                    >
                        ➕ Create Note
                    </button>

                </nav>


                <div className="sidebar-bottom">

                    <button
                        onClick={logout}
                        className="sidebar-logout"
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="dashboard-main">

                {/* HEADER */}

                <header className="dashboard-header">

                    <div>

                        <h1>
                            Welcome back! 👋
                        </h1>

                        <p>
                            Organize your notes and study smarter
                            with PrepMate.
                        </p>

                    </div>

                    <div className="dashboard-header-actions">

                        <button
                            onClick={refreshDashboard}
                            className="refresh-button"
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>

                        <button
                            onClick={logout}
                            className="logout-button"
                        >
                            Logout
                        </button>

                    </div>

                </header>


                {/* =========================
                    STATISTICS CARDS
                ========================= */}

                <section className="dashboard-cards">

                    <div className="dashboard-card">

                        <div className="dashboard-card-icon">
                            📝
                        </div>

                        <h3>Total Notes</h3>

                        <p className="dashboard-card-value">
                            {dashboard?.totalNotes ?? 0}
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="dashboard-card-icon">
                            ⭐
                        </div>

                        <h3>Favorite Notes</h3>

                        <p className="dashboard-card-value">
                            {dashboard?.favoriteNotes ?? 0}
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="dashboard-card-icon">
                            📋
                        </div>

                        <h3>AI Summaries</h3>

                        <p className="dashboard-card-value">
                            {dashboard?.summaries ?? 0}
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="dashboard-card-icon">
                            💬
                        </div>

                        <h3>AI Questions</h3>

                        <p className="dashboard-card-value">
                            {dashboard?.questions ?? 0}
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="dashboard-card-icon">
                            🧠
                        </div>

                        <h3>AI Quizzes</h3>

                        <p className="dashboard-card-value">
                            {dashboard?.quizzes ?? 0}
                        </p>

                    </div>


                    <div className="dashboard-card">

                        <div className="dashboard-card-icon">
                            🗂️
                        </div>

                        <h3>Flashcards</h3>

                        <p className="dashboard-card-value">
                            {dashboard?.flashcards ?? 0}
                        </p>

                    </div>

                </section>


                {/* =========================
                    CONTENT
                ========================= */}

                <section className="dashboard-content">


                    {/* RECENT ACTIVITY */}

                    <div className="dashboard-panel">

                        <h2>
                            Recent AI Activity
                        </h2>


                        {activities.length === 0 ? (

                            <p className="empty-message">
                                No AI activity yet.
                            </p>

                        ) : (
<ul className="activity-list">

                                {activities.map((activity) => (

                                    <li
                                        key={activity.id}
                                        className={`activity-item ${
                                            activity.noteId
                                                ? "activity-clickable"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            if (activity.noteId) {
                                                navigate(
                                                    `/notes/${activity.noteId}`
                                                );
                                            }
                                        }}
                                    >

                                        <div className="activity-icon">

                                            {getActivityIcon(
                                                activity.type
                                            )}

                                        </div>


                                        <div className="activity-info">

                                            <div className="activity-type">

                                                {getActivityName(
                                                    activity.type
                                                )}

                                            </div>


                                            <div className="activity-note">

                                                {activity.noteId
                                                    ? `Note #${activity.noteId}`
                                                    : "General activity"}

                                            </div>

                                        </div>


                                        <div className="activity-time">

                                            {new Date(
                                                activity.createdAt
                                            ).toLocaleString()}

                                        </div>

                                    </li>

                                ))}

                            </ul>

                        )}

                    </div>


                    {/* RIGHT COLUMN */}

                    <div>


                        {/* NOTE STATISTICS */}

                        <div className="dashboard-panel">

                            <h2>
                                Note Statistics
                            </h2>


                            <div className="statistics-row">

                                <span className="statistics-label">
                                    Total Notes
                                </span>

                                <span className="statistics-value">
                                    {statistics?.totalNotes ?? 0}
                                </span>

                            </div>


                            <div className="statistics-row">

                                <span className="statistics-label">
                                    Favorite Notes
                                </span>

                                <span className="statistics-value">
                                    {statistics?.favoriteNotes ?? 0}
                                </span>

                            </div>


                            <div className="statistics-row">

                                <span className="statistics-label">
                                    With Categories
                                </span>

                                <span className="statistics-value">
                                    {statistics?.notesWithCategories ?? 0}
                                </span>

                            </div>


                            <div className="statistics-row">

                                <span className="statistics-label">
                                    Without Categories
                                </span>

                                <span className="statistics-value">
                                    {statistics?.notesWithoutCategories ?? 0}
                                </span>

                            </div>

                        </div>


                        {/* QUICK ACTIONS */}

                        <div className="dashboard-panel quick-actions-panel">

                            <h2>
                                Quick Actions
                            </h2>


                            <div className="quick-actions">

                                <button
                                    className="quick-action-button"
                                    onClick={() =>
                                        navigate("/notes")
                                    }
                                >
                                    📝 View My Notes
                                </button>


                                <button
                                    className="quick-action-button"
                                    onClick={() =>
                                        navigate("/notes/create")
                                    }
                                >
                                    ➕ Create New Note
                                </button>

                                <button
                                className="quick-action-button"
                                onClick={() =>
                                    navigate("/categories")
                                }
                            >
                                📁 Manage Categories
                            </button>

                            <button
                                className="quick-action-button"
                                onClick={() =>
                                    navigate("/tags")
                                }
                            >
                                🏷️ Manage Tags
                            </button>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;