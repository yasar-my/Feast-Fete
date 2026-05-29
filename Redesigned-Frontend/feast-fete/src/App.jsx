import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Organizers from "./pages/Organizers";
import OrganizerDetails from "./pages/OrganizerDetails";
import MyBookings from "./pages/MyBookings";
import CreateOrganizerProfile from "./pages/CreateOrganizerProfile";
import EditOrganizerProfile from "./pages/EditOrganizerProfile";
import OrganizerProfile from "./pages/OrganizerProfile";
import CustomerProfile from "./pages/CustomerProfile";

function App() {

    return (

        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/organizers"
                    element={<Organizers />}
                />
                <Route
                    path="/organizer/:email"
                    element={<OrganizerDetails />}
                />
                <Route
                    path="/my-bookings"
                    element={<MyBookings />}
                />
                <Route
                    path="/create-organizer-profile"
                    element={<CreateOrganizerProfile />}
                />
                <Route
                    path="/edit-organizer-profile"
                    element={<EditOrganizerProfile />}
                />
                <Route
                    path="/organizer-profile"
                    element={<OrganizerProfile />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;