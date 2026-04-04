import { useState, useEffect } from "react";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function Intro() {
  const [intros, setIntros] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/content/intros`)
      .then((res) => res.json())
      .then((data) => setIntros(data))
      .catch((err) => console.error("Erro ao buscar intros:", err));
  }, []);

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error("Erro ao fazer upload da imagem");
    }

    return data.data.url;
  };

  const handleChange = (e, index) => {
    const newIntros = [...intros];
    newIntros[index][e.target.name] = e.target.value;
    setIntros(newIntros);
  };

  const handleSave = () => {
    fetch(`${API_URL}/content/intros`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(intros),
    })
      .then(() => {
        alert("✅ Intros atualizadas com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => {
        setMessage("❌ Erro ao atualizar intros.");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  return (
    <>
      {intros.length === 0 && <p>Carregando intros...</p>}

      {intros.map((intro, idx) => (
        <div
          className="intro-edit-item"
          id="cards-intro"
          key={intro._id || idx}
        >
          <h3 className="margin-bottom">Intro {idx + 1}</h3>
          <input
            type="text"
            name="title"
            value={intro.title}
            onChange={(e) => handleChange(e, idx)}
            placeholder="Título"
          />
          <textarea
            name="description"
            value={intro.description}
            onChange={(e) => handleChange(e, idx)}
            placeholder="Descrição"
          />
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              try {
                const imageUrl = await uploadImageToImgbb(file);

                const newIntros = [...intros];
                newIntros[idx].img = imageUrl;
                setIntros(newIntros);
              } catch (err) {
                alert("❌ Erro ao enviar imagem");
                console.error(err);
              }
            }}
          />
          {intro.img && (
            <img
              src={intro.img}
              alt="preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
        </div>
      ))}

      <button onClick={handleSave}>Salvar</button>

      {message && <p className="save-message">{message}</p>}
    </>
  );
}
