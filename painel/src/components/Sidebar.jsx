export default function Sidebar({ active, setActive }) {
const navItems = [
  { key: "config", label: "Titulo", icon: "settings", target: "config" },
  { key: "home", label: "Home", icon: "home", target: "home" },
  { key: "intro", label: "Introdução", icon: "start", target: "intro" },
  { key: "about", label: "Sobre", icon: "info", target: "about" },
  { key: "service", label: "Serviços", icon: "build", target: "service" },
  { key: "instagram", label: "Instagram", icon: "photo", target: "instagram" },
  { key: "testimonials", label: "Depoimentos", icon: "people", target: "testimonials" },
  { key: "contact", label: "Contato", icon: "phone", target: "contact" },
  { key: "address", label: "Endereço", icon: "location_on", target: "address" },
];

  return (
    <aside>
      <h1>Painel</h1>
      {navItems.map((item) => (
        <div
          key={item.key}
          className={`nav-link ${active === item.key ? "active" : ""}`}
          onClick={() => {
            setActive(item.key);
            const el = document.getElementById(item.target);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          <span className="material-icons">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </aside>
  );
}
