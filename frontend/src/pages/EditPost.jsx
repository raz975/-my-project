import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function EditPost({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPost(id)
      .then(data => { setTitle(data.post.title); setContent(data.post.content); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async e => {
    e.preventDefault(); setError("");
    try {
      await api.updatePost({ id: Number(id), title, content });
      navigate(`/posts/${id}`);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p style={{ fontFamily: "Franklin Gothic Medium" }}>{t(lang, "loading")}</p>;

  const inputStyle = { width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "400px", minHeight: "300px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 28px" }}>{t(lang, "editPost")}</h1>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
        <input style={inputStyle} placeholder={t(lang, "title")} value={title} onChange={e => setTitle(e.target.value)} required />
        <input style={inputStyle} placeholder={t(lang, "content")} value={content} onChange={e => setContent(e.target.value)} required />
        {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}
        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <button style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white", width: "80px", height: "35px" }}>{t(lang, "save")}</button>
          <button type="button" onClick={() => navigate(`/posts/${id}`)} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white", width: "80px", height: "35px" }}>{t(lang, "cancel")}</button>
        </div>
      </form>
    </div>
  );
}