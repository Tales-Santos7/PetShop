import { useEffect, useState } from "react";
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export default function Service() {
  const [header, setHeader] = useState("");
  const [services, setServices] = useState([]);

  // Buscar título da seção
  useEffect(() => {
    fetch(`${API_URL}/content/services-section`)
      .then((res) => res.json())
      .then((data) => setHeader(data.header || ""));
  }, []);

  // Buscar serviços
  useEffect(() => {
    fetch(`${API_URL}/content/services`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Erro ao carregar serviços:", err));
  }, []);

  // Atualizar serviço
  const handleChange = (index, e) => {
    const newServices = [...services];
    newServices[index][e.target.name] = e.target.value;
    setServices(newServices);
  };

  const handleAddService = () => {
    setServices([...services, { title: "", img: "" }]);
  };

  const handleRemoveService = (index) => {
    if (confirm("Tem certeza que deseja remover este serviço?")) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

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

  const handleSave = () => {
    Promise.all([
      fetch(`${API_URL}/content/services-section`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ header }),
      }),
      fetch(`${API_URL}/content/services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      }),
    ])
      .then(() => alert("✅ Serviços atualizados com sucesso!"))
      .catch(() => alert("❌ Erro ao salvar serviços."));
  };

  return (
    <>
      <h2>Editar Serviços</h2>

      <label>Título da Seção</label>
      <input
        type="text"
        value={header}
        onChange={(e) => setHeader(e.target.value)}
        placeholder="O que podemos fazer por você"
      />

      <hr style={{ margin: "20px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Lista de Serviços</h3>
        <button onClick={handleAddService}>Adicionar Serviço</button>
      </div>

      {services.length === 0 && (
        <p style={{ opacity: 0.7 }}>Nenhum serviço cadastrado.</p>
      )}

      {services.map((service, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Serviço {index + 1}</h4>
            <button onClick={() => handleRemoveService(index)}>Remover</button>
          </div>

          <input
            type="text"
            name="title"
            value={service.title || ""}
            onChange={(e) => handleChange(index, e)}
            placeholder="Nome do serviço"
          />

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              try {
                const imageUrl = await uploadImageToImgbb(file);

                const newServices = [...services];
                newServices[index].img = imageUrl;
                setServices(newServices);
              } catch (err) {
                alert("❌ Erro ao enviar imagem");
                console.error(err);
              }
            }}
          />

          {service.img && (
            <img
              src={service.img}
              alt="preview"
              style={{ width: "80px", marginTop: "10px" }}
            />
          )}
        </div>
      ))}

      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Salvar Alterações
      </button>
    </>
  );
}
