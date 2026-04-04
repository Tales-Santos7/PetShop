import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Instagram() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/content/instagram`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const handleChange = (index, value) => {
    const newPosts = [...posts];
    newPosts[index].permalink = value;
    setPosts(newPosts);
  };

  const addPost = () => {
    setPosts([...posts, { permalink: "" }]);
  };

  const removePost = (index) => {
    if (!confirm("Remover este post?")) return;
    setPosts(posts.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    fetch(`${API_URL}/content/instagram`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(posts),
    }).then(() => alert("✅ Instagram atualizado!"));
  };

  return (
    <>
      <button onClick={addPost}>Adicionar post</button>

      {posts.map((p, i) => (
        <div key={i} style={{ marginTop: 10 }}>
          <input
            type="text"
            value={p.permalink || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder="Link do post do Instagram"
          />
          <button onClick={() => removePost(i)}>Remover</button>
        </div>
      ))}

      <button onClick={handleSave} style={{ marginTop: 15 }}>
        Salvar
      </button>
    </>
  );
}
