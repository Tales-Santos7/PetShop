import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Contact() {
  const [footer, setFooter] = useState({
    address: "",
    phone: "",
    email: "",
    socials: [],
  });

  useEffect(() => {
    fetch(`${API_URL}/content/footer`)
      .then((res) => res.json())
      .then((data) =>
        setFooter({
          ...data,
          socials: data.socials || [],
        }),
      );
  }, []);

  const addSocial = () => {
    setFooter({
      ...footer,
      socials: [
        ...footer.socials,
        { name: "", url: "", icon: "", enabled: true },
      ],
    });
  };

  const updateSocial = (index, field, value) => {
    const updated = [...footer.socials];
    updated[index][field] = value;
    setFooter({ ...footer, socials: updated });
  };

  const removeSocial = (index) => {
    const updated = footer.socials.filter((_, i) => i !== index);
    setFooter({ ...footer, socials: updated });
  };

  const saveFooter = async () => {
    await fetch(`${API_URL}/content/footer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(footer),
    });
    alert("✅ Contato salvo!");
  };

  return (
    <div className="footer-config">
      <h3 className="section-title">Redes Sociais</h3>

      <div className="social-list">
        {footer.socials.map((social, i) => (
          <div key={i} className="social-card">
            <div className="social-inputs">
              <input
                className="input"
                placeholder="Nome (ex: Instagram)"
                value={social.name}
                onChange={(e) => updateSocial(i, "name", e.target.value)}
              />

              <input
                className="input"
                placeholder="URL (ex: https://instagram.com/)"
                value={social.url}
                onChange={(e) => updateSocial(i, "url", e.target.value)}
              />
            </div>

            <div className="social-actions">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={social.enabled}
                  onChange={(e) => updateSocial(i, "enabled", e.target.checked)}
                />
                <span className="slider"></span>
              </label>

              <button className="btn-danger" onClick={() => removeSocial(i)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-buttons">
        <button className="btn-secondary" onClick={addSocial}>
          + Adicionar Rede
        </button>

        <button className="btn-primary" onClick={saveFooter}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
