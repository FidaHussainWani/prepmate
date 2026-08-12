import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import NoteDetails from "./pages/NoteDetails";
import Categories from "./pages/Categories";
import EditNote from "./pages/EditNote";
import Notes from "./pages/Notes";
import Tags from "./pages/Tags";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC ROUTES
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    PROTECTED ROUTES
                ========================= */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/notes"
                        element={<Notes />}
                    />

                    <Route
                        path="/notes/create"
                        element={<CreateNote />}
                    />

                    <Route
                        path="/notes/:id"
                        element={<NoteDetails />}
                    />

                    <Route
                        path="/notes/:id/edit"
                        element={<EditNote />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/tags"
                        element={<Tags />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;