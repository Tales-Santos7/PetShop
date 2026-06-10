import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Address() {
 const [form, setForm] = useState({
  address: "",
  mapUrl: "",
});

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/content/footer`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          address: data.address || "",
          mapUrl: data.mapUrl || "",
        });
      })
      .catch((err) => console.error("Erro ao carregar contato:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/content/footer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Erro ao salvar");

      await response.json();
      alert("✅ Contato atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Erro ao salvar contato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-wrapper">
      <form onSubmit={handleSubmit} className="address-form">
        <h3>Informações de Contato</h3>

        <div className="form-group">
          <label>Endereço</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Ex: São Paulo, Brazil"
          />
        </div>

        <div className="form-group">
          <label>Link do Google Maps</label>
          <input
            type="text"
            name="mapUrl"
            value={form.mapUrl}
            onChange={handleChange}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <button className="save-btn" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
}
