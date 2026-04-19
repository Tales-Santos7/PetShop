import { useState, useEffect } from "react";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function Hero() {
  const [hero, setHero] = useState({
    title: "",
    highlight: "",
    subtitle: "",
    description: "",
    buttonText: "",
    images: [""],
  });

  // 🔹 Buscar os dados do Hero
  useEffect(() => {
    fetch(`${API_URL}/content/hero`)
      .then((res) => res.json())
      .then((data) => {
        setHero(data); // <-- apenas isto!
      })
      .catch((err) => console.error("Erro ao carregar Hero:", err));
  }, []); // ⚠️ Importante: dependência vazia [] para não entrar em loop

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

  // 🔹 Guardar no backend
  const salvarHero = async () => {
    await fetch(`${API_URL}/content/hero`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });
    alert("✅ Hero atualizado!");
  };

  return (
    <div>
      {/* Mostrar preview da imagem */}
      {hero.images && hero.images[0] && (
        <img src={hero.images[0]} alt="Hero" style={{ maxWidth: "200px" }} />
      )}

      {/* Campo para URL da imagem */}
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          try {
            const imageUrl = await uploadImageToImgbb(file);

            setHero({
              ...hero,
              images: [imageUrl],
            });
          } catch (err) {
            alert("❌ Erro ao enviar imagem");
            console.error(err);
          }
        }}
      />

      <input
        type="text"
        placeholder="Título"
        value={hero.title || ""}
        onChange={(e) => setHero({ ...hero, title: e.target.value })}
      />

      <input
        type="text"
        placeholder="Subtítulo"
        value={hero.subtitle || ""}
        onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
      />

      <textarea
        placeholder="Descrição"
        value={hero.description || ""}
        onChange={(e) => setHero({ ...hero, description: e.target.value })}
      />

      <input
        type="text"
        placeholder="Texto do botão"
        value={hero.buttonText || ""}
        onChange={(e) => setHero({ ...hero, buttonText: e.target.value })}
      />

      <button onClick={salvarHero}>Salvar</button>
    </div>
  );
}
