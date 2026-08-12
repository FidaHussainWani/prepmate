import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-container">

                {/* LEFT SIDE */}

                <div className="auth-brand">

                    <div className="brand-logo">
                        📚
                    </div>

                    <h1>
                        PrepMate
                    </h1>

                    <p>
                        Organize your notes.
                        <br />
                        Study smarter with AI.
                    </p>

                    <div className="brand-features">

                        <div>
                            🤖
                            <span>
                                AI-powered learning
                            </span>
                        </div>

                        <div>
                            📝
                            <span>
                                Smart note management
                            </span>
                        </div>

                        <div>
                            🧠
                            <span>
                                Quizzes & flashcards
                            </span>
                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="auth-card">

                    <div className="auth-header">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Login to continue studying
                            with PrepMate.
                        </p>

                    </div>


                    {error && (

                        <div className="auth-error">
                            ⚠️ {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleLogin}
                        className="auth-form"
                    >

                        <div className="auth-field">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                            />

                        </div>


                        <div className="auth-field">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>


                    <div className="auth-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create an account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;