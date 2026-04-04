import { useEffect, useState } from "react";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function Testimonials() {
  const [enabled, setEnabled] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    message: "",
    img: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Buscar depoimentos
    fetch(`${API_URL}/content/testimonials`)
      .then((res) => res.json())
      .then((data) => setTestimonials(data));

    // 🔥 Buscar estado da secção
    fetch(`${API_URL}/content/section-control`)
      .then((res) => res.json())
      .then((data) => setEnabled(data.testimonialsEnabled));
  }, []);

  const toggleSection = async () => {
    const newValue = !enabled;

    const res = await fetch(`${API_URL}/content/section-control`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testimonialsEnabled: newValue }),
    });

    if (res.ok) {
      setEnabled(newValue);
    }
  };

  // Upload para ImgBB
  const uploadToImgBB = async (file) => {
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
    if (!data.success) throw new Error("Erro ao enviar imagem");

    return data.data.url;
  };

  // Selecionar imagem
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadToImgBB(file);
      setNewTestimonial({ ...newTestimonial, img: imageUrl });
    } catch (err) {
      alert("Erro ao enviar imagem");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setNewTestimonial({
      ...newTestimonial,
      [e.target.name]: e.target.value,
    });
  };

  const addTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.message) {
      alert("Preencha pelo menos o nome e a mensagem.");
      return;
    }

    fetch(`${API_URL}/content/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTestimonial),
    })
      .then((res) => res.json())
      .then((data) => {
        setTestimonials([...testimonials, data]);
        setNewTestimonial({
          name: "",
          role: "",
          message: "",
          img: "",
        });
      });
  };

  const handleDelete = (id) => {
    if (!confirm("Remover este depoimento?")) return;

    fetch(`${API_URL}/content/testimonials/${id}`, {
      method: "DELETE",
    }).then(() => setTestimonials(testimonials.filter((t) => t._id !== id)));
  };

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={toggleSection}
          style={{
            background: enabled ? "#e74c3c" : "#2ecc71",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {enabled
            ? "Ocultar Seção de Depoimentos"
            : "Mostrar Seção no site"}
        </button>
      </div>
      {/* FORMULÁRIO */}
      <div className="form">
        <input
          type="text"
          name="name"
          value={newTestimonial.name}
          onChange={handleChange}
          placeholder="Nome"
        />

        <input
          type="text"
          name="role"
          value={newTestimonial.role}
          onChange={handleChange}
          placeholder="Profissão"
        />

        <textarea
          name="message"
          value={newTestimonial.message}
          onChange={handleChange}
          placeholder="Mensagem"
        />

        {/* Upload ImgBB */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {uploading && <p>Enviando imagem...</p>}

        {newTestimonial.img && (
          <img
            src={newTestimonial.img}
            alt="Preview"
            style={{ width: 120, marginTop: 10, borderRadius: 6 }}
          />
        )}

        <button onClick={addTestimonial} disabled={uploading}>
          Adicionar depoimento
        </button>
      </div>

      {/* LISTA */}
      <div className="grid">
        {testimonials.map((t) => (
          <div key={t._id} className="testimonial_card">
            {t.img && <img src={t.img} alt={t.name} />}
            <h4>{t.name}</h4>
            <h5>{t.role}</h5>
            <p>{t.message}</p>

            <button className="danger" onClick={() => handleDelete(t._id)}>
              Apagar
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
