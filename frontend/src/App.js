import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Donate from "./pages/Donate";
import Confirmation from "./pages/Confirmation";
import { Club, Impact, Events } from "./pages/Static";
import ChatWidget from "./components/ChatWidget";

function Shell({ children }) {
  const location = useLocation();
  const noChrome = location.pathname.startsWith("/confirmation");
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!noChrome && <Header />}
      <main className="flex-1">{children}</main>
      {!noChrome && <Footer />}
      <ChatWidget />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/club" element={<Club />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

export default App;
