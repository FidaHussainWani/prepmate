import { useLocation, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="dashboard-sidebar">

            <div className="dashboard-logo">
                📚 PrepMate
            </div>

            <nav className="dashboard-nav">

                <button
                    className={
                        isActive("/dashboard")
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    🏠 Dashboard
                </button>

                <button
                    className={
                        isActive("/notes")
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        navigate("/notes")
                    }
                >
                    📝 My Notes
                </button>

                <button
                    onClick={() =>
                        navigate("/notes/create")
                    }
                >
                    ➕ Create Note
                </button>

                <button
                    className={
                        isActive("/categories")
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        navigate("/categories")
                    }
                >
                    📁 Categories
                </button>

                <button
                    className={
                        isActive("/tags")
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        navigate("/tags")
                    }
                >
                    🏷️ Tags
                </button>

            </nav>

            <button
                className="sidebar-logout"
                onClick={logout}
            >
                🚪 Logout
            </button>

        </aside>
    );
}

export default Sidebar;