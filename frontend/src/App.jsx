import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
    Outlet,
} from "react-router-dom";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Project from "./pages/Project";
import Contact from "./pages/Contact";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";


const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
<Router>
  <Routes>
    <Route path="/" element={<Layout/>}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="skills" element={<Skills/>} />
      <Route path="project" element={<Project />} />
      <Route path="contact" element={<Contact />} />
    </Route>

    {/* Example route WITHOUT navbar */}
      <Route path="admin" element={<Dashboard/>} />

  </Routes>
</Router>

  );
};

export default App;
