import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProviderSearch from "./pages/providerSearch";
import Login from "./pages/Login";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <div className="app">
        {user ? null : <Navigation />}
        <div className="Main-Content">
          {user ? <Sidebar /> : null}
          <main className="content">
            {user ? <Topbar /> : null}
            <div className="inner-content">
              <Routes>
                <Route path="/" element={!user ? <Login /> : <Navigate to="/search" />} />
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
