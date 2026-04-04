import { useEffect, useState } from "react";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function TituloSite() {
  const [form, setForm] = useState({
    siteName: "",
    pageTitle: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/content/site-config`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          siteName: data.siteName || "",
          pageTitle: data.pageTitle || "",
          favicon: data.favicon || "",
        });
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Upload para ImgBB
  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error("Erro ao fazer upload da imagem");
    }

    return data.data.url;
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      const imageUrl = await uploadImageToImgbb(file);

      setForm((prev) => ({
        ...prev,
        favicon: imageUrl,
      }));
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao enviar imagem.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/content/site-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("✅ Atualizado com sucesso!");

        // 🔥 Atualizar título
        if (form.pageTitle) {
          document.title = form.pageTitle;
        }

        // 🔥 Atualizar favicon instantaneamente
        if (form.favicon) {
          let favicon = document.getElementById("site-favicon");

          if (!favicon) {
            favicon = document.createElement("link");
            favicon.id = "site-favicon";
            favicon.rel = "icon";
            document.head.appendChild(favicon);
          }

          favicon.href = form.favicon + "?v=" + new Date().getTime();
        }
      } else {
        setMessage("❌ Erro ao salvar.");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Erro de conexão.");
    }

    setLoading(false);
  };

  return (
    <div className="config_container">
      <form onSubmit={handleSubmit} className="config_form">
        <div className="form_group">
          <label>Nome do Site</label>
          <input
            type="text"
            name="siteName"
            value={form.siteName}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label>Título da Página</label>
          <input
            type="text"
            name="pageTitle"
            value={form.pageTitle}
            onChange={handleChange}
          />
        </div>

        <div className="form_group">
          <label>Favicon (Icone para o navegador)</label>
          <input type="file" accept="image/*" onChange={handleFaviconUpload} />
          {uploading && <p>Enviando imagem...</p>}

          {form.favicon && (
            <img
              src={form.favicon}
              alt="preview favicon"
              style={{ width: "40px", marginTop: "10px" }}
            />
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
