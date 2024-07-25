import "./App.css";
// eslint-disable-next-line
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProviderSearch from "./pages/providerSearch";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
function App() {
    const user = useSelector((state) => state.user);
        // Helper function to render Login page only if user is not logged in
        const RenderLoginIfNotLoggedIn = () => {
            return !user ? <Login /> : <Navigate to="/" />;
        };
    return (
        <BrowserRouter>
            <div className="app">
                <Navigation />
                <div className="Main-Content">
                    <main className="content">
                        <div className="inner-content">
                            <Routes>
                                <Route path="/" element={<RenderLoginIfNotLoggedIn />} />
                                <Route path="/search" element={user ? <ProviderSearch /> : <Navigate to="/" />} />
                            </Routes>
                        </div>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}


export default App;