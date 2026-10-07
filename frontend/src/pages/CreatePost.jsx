import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function CreatePost({ lang }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = e => {
    const f = e.target.files[0];
    if (!f) { setFile(null); setPreview(null); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const created = await api.createPost({ title, content });
      const newId = created.id;

      if (file) {
        const up = await api.uploadImage(newId, file);
        if (!up.success) throw new Error(up.error || "Image upload failed");
      }

      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "400px", minHeight: "300px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 28px" }}>{t(lang, "createPostTitle")}</h1>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
        <input style={inputStyle} placeholder={t(lang, "title")} value={title} onChange={e => setTitle(e.target.value)} required />
        <input style={inputStyle} placeholder={t(lang, "content")} value={content} onChange={e => setContent(e.target.value)} required />
        <input type="file" accept="image/*" onChange={onFileChange} style={{ fontFamily: "Franklin Gothic Medium", fontSize: "13px" }} />
        {preview && <img src={preview} alt="preview" style={{ maxWidth: "220px", maxHeight: "150px", borderRadius: "9px", objectFit: "cover" }} />}
        {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}
        <button disabled={loading} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", marginTop: "5px", background: "#2196f3", color: "white", width: "80px", height: "35px" }}>
          {loading ? t(lang, "creating") : t(lang, "create")}
        </button>
      </form>
    </div>
  );
}