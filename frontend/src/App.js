import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "@/App.css";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Ethos from "@/components/Ethos";
import Practice from "@/components/Practice";
import Listings from "@/components/Listings";
import Pillars from "@/components/Pillars";
import Ventures from "@/components/Ventures";
import Wire from "@/components/Wire";
import Quote from "@/components/Quote";
import Inquire from "@/components/Inquire";
import Footer from "@/components/Footer";
import Admin from "@/components/Admin";
import DetailPage from "@/components/DetailPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // No dependencies — runs once on mount; IntersectionObserver is a stable browser global.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function useBackendPing(api) {
  useEffect(() => {
    axios.get(`${api}/`).catch(() => {});
  }, [api]);
}

function App() {
  useReveal();
  useBackendPing(API);

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/detail/:itemId" element={<DetailPage />} />
        <Route path="/" element={
          <div className="App grain" data-testid="phantomworx-app">
            <Nav />
            <main>
              <Hero />
              <Marquee />
              <Ethos />
              <Practice />
              <Listings />
              <Pillars />
              <Ventures />
              <Wire />
              <Quote />
              <Inquire api={API} />
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
