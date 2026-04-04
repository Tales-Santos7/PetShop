import { useEffect, useState } from "react";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function About() {
  const [about, setAbout] = useState({
    header: "",
    title: "",
    description: "",
    cards: [],
  });

  // Buscar dados existentes ao carregar
  useEffect(() => {
    fetch(`${API_URL}/content/about`)
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch((err) => console.error("Erro ao carregar:", err));
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

  // Atualizar campos principais (title, header, description)
  const handleChange = (e) => {
    setAbout({ ...about, [e.target.name]: e.target.value });
  };

  // Atualizar campos de um card específico
  const handleCardChange = (index, e) => {
    const newCards = [...about.cards];
    newCards[index][e.target.name] = e.target.value;
    setAbout({ ...about, cards: newCards });
  };

  // Adicionar um novo card vazio
  const handleAddCard = () => {
    const newCard = {
      title: "",
      description: "",
      img: "",
      icon: "",
    };
    setAbout({ ...about, cards: [...about.cards, newCard] });
  };

  // Remover um card pelo índice
  const handleRemoveCard = (index) => {
    if (confirm("Tem certeza que deseja remover este card?")) {
      const newCards = about.cards.filter((_, i) => i !== index);
      setAbout({ ...about, cards: newCards });
    }
  };

  // Salvar alterações no backend
  const handleSave = () => {
    fetch(`${API_URL}/content/about`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(about),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("✅ Seção 'Sobre' atualizada com sucesso!");
        setAbout(data);
      })
      .catch((err) => {
        console.error("Erro ao salvar:", err);
        alert("❌ Ocorreu um erro ao salvar as alterações.");
      });
  };

  return (
    <>
      <h2>Editar Seção "Sobre"</h2>

      {/* Campos principais */}
      <label>Subtítulo / Header</label>
      <input
        type="text"
        name="header"
        value={about.header}
        onChange={handleChange}
        placeholder="Cabeçalho da seção"
      />

      <hr style={{ margin: "20px 0" }} />

      {/* Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Cards da Seção</h3>
        <button
          onClick={handleAddCard}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
          }}
        >
          Adicionar Card
        </button>
      </div>

      {about.cards?.length === 0 && (
        <p style={{ opacity: 0.7 }}>Nenhum card adicionado ainda.</p>
      )}

      {about.cards?.map((card, index) => (
        <div
          key={index}
          className="about-card-form"
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "15px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>Card {index + 1}</h4>
            <button
              onClick={() => handleRemoveCard(index)}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                padding: "4px 8px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Remover
            </button>
          </div>

          <input
            type="text"
            name="title"
            value={card.title}
            onChange={(e) => handleCardChange(index, e)}
            placeholder="Título do card"
          />

          <textarea
            name="description"
            value={card.description}
            onChange={(e) => handleCardChange(index, e)}
            placeholder="Descrição do card"
          />

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              try {
                const imageUrl = await uploadImageToImgbb(file);

                const newCards = [...about.cards];
                newCards[index].img = imageUrl;

                setAbout({ ...about, cards: newCards });
              } catch (err) {
                alert("❌ Erro ao enviar imagem");
                console.error(err);
              }
            }}
          />

          {card.img && (
            <img
              src={card.img}
              alt="preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}

          <label style={{ marginTop: "10px", display: "block" }}>
            Ícone do card
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              try {
                const iconUrl = await uploadImageToImgbb(file);

                const newCards = [...about.cards];
                newCards[index].icon = iconUrl;

                setAbout({ ...about, cards: newCards });
              } catch (err) {
                alert("❌ Erro ao enviar ícone");
                console.error(err);
              }
            }}
          />

          {card.icon && (
            <img
              src={card.icon}
              alt="icon preview"
              style={{
                width: "50px",
                marginTop: "10px",
                background: "#f5f5f5",
                padding: "5px",
                borderRadius: "6px",
              }}
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          backgroundColor: "#2196f3",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Salvar Alterações
      </button>
    </>
  );
}
