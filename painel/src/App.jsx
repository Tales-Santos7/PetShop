import { useState, useEffect } from "react";
import TituloSite from "./components/TituloSite";
import Sidebar from "./components/Sidebar";
import About from "./components/About";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import Intro from "./components/Intro";
import Instagram from "./components/Instagram";
import Contact from "./components/Contact";
import Service from "./components/Services";
import Address from "./components/Address";

export default function App() {
  const [active, setActive] = useState("home");

  return (
    <div className="app">
      {/* Sidebar de navegação */}
      <Sidebar active={active} setActive={setActive} />

      <main>
        <section
          id="config"
          className={`card ${active === "config" ? "active" : ""}`}
        >
          <h2>Titulo do Site</h2>
          <TituloSite />
        </section>

        {/* Home */}
        <section
          id="home"
          className={`card ${active === "home" ? "active" : ""}`}
        >
          <h2>Hero / Foto Principal</h2>
          <Hero />
        </section>

        {/* Intro */}
        <section
          id="intro"
          className={`card ${active === "intro" ? "active" : ""}`}
        >
          <h2>Introdução</h2>
          <Intro />
        </section>

        {/* About */}
        <section
          id="about"
          className={`card ${active === "about" ? "active" : ""}`}
        >
          <h2>Perfil</h2>
          <About />
        </section>

        {/* Serviços */}
        <section
          id="service"
          className={`card ${active === "service" ? "active" : ""}`}
        >
          <h2>Serviços</h2>
          <Service />
        </section>

        {/* Instagram */}
        <section
          id="instagram"
          className={`card ${active === "instagram" ? "active" : ""}`}
        >
          <h2>Instagram / Publicações</h2>
          <Instagram />
        </section>

        {/* Depoimentos */}
        <section
          id="testimonials"
          className={`card ${active === "testimonials" ? "active" : ""}`}
        >
          <h2>Depoimentos</h2>
          <Testimonials />
        </section>

        {/* Contact */}
        <section
          id="contact"
          className={`card ${active === "contact" ? "active" : ""}`}
        >
          <h2>Contato</h2>
          <Contact />
        </section>

          {/* Address */} 
        <section
          id="address"
          className={`card ${active === "address" ? "active" : ""}`}
        >
          <h2>Endereço</h2>
          <Address />
        </section>
      </main>
    </div>
  );
}
