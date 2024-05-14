import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import HomeView from "./views/HomeView";
import GameView from "./views/protected/GameView";
import ProfileView from "./views/protected/ProfileView";
import NotFoundView from "./views/error/NotFoundView";
import NavBar from "./components/layout/Navbar";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <div className="container mx-auto px-4 mt-20 pt-6">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="/game" element={<GameView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
