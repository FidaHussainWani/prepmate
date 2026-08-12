import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            navigate("/login");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="register-page">

            <div className="register-container">

                {/* BRAND */}

                <div className="register-brand">

                    <div className="register-logo">
                        📚
                    </div>

                    <h1>
                        PrepMate
                    </h1>

                    <p>
                        Your smart study companion.
                        <br />
                        Learn, organize and prepare better.
                    </p>

                    <div className="register-benefits">

                        <div>
                            📝
                            <span>
                                Organize your notes
                            </span>
                        </div>

                        <div>
                            🤖
                            <span>
                                Learn with AI
                            </span>
                        </div>

                        <div>
                            🧠
                            <span>
                                Practice with quizzes
                            </span>
                        </div>

                    </div>

                </div>


                {/* FORM */}

                <div className="register-card">

                    <div className="register-header">

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Start your smarter study journey
                            with PrepMate.
                        </p>

                    </div>


                    {error && (

                        <div className="register-error">
                            ⚠️ {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleRegister}
                        className="register-form"
                    >

                        <div className="register-field">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your name"
                                autoComplete="name"
                                required
                            />

                        </div>


                        <div className="register-field">

                            <label htmlFor="register-email">
                                Email
                            </label>

                            <input
                                id="register-email"
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


                        <div className="register-field">

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="register-password-wrapper">

                                <input
                                    id="register-password"
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
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
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
                            className="register-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create Account"}
                        </button>

                    </form>


                    <div className="register-footer">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;