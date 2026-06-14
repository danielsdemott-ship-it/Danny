import React, { useEffect, useRef, useState } from "react";
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function App() {
  useReveal();

  // Optional health ping
  useEffect(() => {
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
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
  );
}

export default App;
