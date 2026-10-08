import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function EditPost({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [activeTab, setActiveTab] = useState("ru");
  const [translations, setTranslations] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existing, setExisting] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPost(id, lang), api.getPostImage(id), api.getPublicLanguages()])
      .then(([pData, iData, lData]) => {
        const langs = lData.languages || [];
        setLanguages(langs);

        const initial = {};
        langs.forEach(l => { initial[l.code] = { title: "", content: "" }; });

        const active = langs.find(l => l.is_active === 1) || langs[0];
        if (active) {
          initial[active.code] = {
            title: pData.post.title || "",
            content: pData.post.content || ""
          };
          setActiveTab(active.code);
        }

        setTranslations(initial);
        if (iData.image) setExisting("http://my-api" + iData.image.url);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, lang]);

  const updateField = (code, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [code]: { ...prev[code], [field]: value }
    }));
  };

  const onFileChange = e => {
    const f = e.target.files[0];
    if (!f) { setFile(null); setPreview(null); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submit = async e => {
    e.preventDefault();
    setError("");

    const main = translations[activeTab] || {};
    if (!main.title || !main.content) {
      setError("Заполните поля для языка: " + activeTab);
      return;
    }

    try {
      await api.updatePost({
        id: Number(id),
        title: main.title,
        content: main.content,
        translations
      });
      if (file) {
        const up = await api.uploadImage(Number(id), file);
        if (!up.success) throw new Error(up.error || "Image upload failed");
      }
      navigate(`/posts/${id}`);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p style={{ fontFamily: "Franklin Gothic Medium" }}>{t(lang, "loading")}</p>;

  const inputStyle = { width: "260px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "440px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 20px" }}>{t(lang, "editPost")}</h1>

      <div style={{ display: "flex", gap: "5px", marginBottom: "15px", justifyContent: "center", flexWrap: "wrap" }}>
        {languages.map(l => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveTab(l.code)}
            style={{ border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: activeTab === l.code ? "#2196f3" : "#e0e0e0", color: activeTab === l.code ? "white" : "#333", fontSize: "13px" }}
          >
            {l.name}
          </button>
        ))}
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
        {translations[activeTab] && (
          <>
            <input
              style={inputStyle}
              placeholder={`${t(lang, "title")} (${activeTab})`}
              value={translations[activeTab].title}
              onChange={e => updateField(activeTab, "title", e.target.value)}
            />
            <input
              style={inputStyle}
              placeholder={`${t(lang, "content")} (${activeTab})`}
              value={translations[activeTab].content}
              onChange={e => updateField(activeTab, "content", e.target.value)}
            />
          </>
        )}

        {existing && !preview && (
          <div>
            <p style={{ margin: "0 0 5px", fontSize: "13px", color: "#555" }}>Текущая картинка:</p>
            <img src={existing} alt="current" style={{ maxWidth: "220px", maxHeight: "150px", borderRadius: "9px", objectFit: "cover" }} />
          </div>
        )}

        <input type="file" accept="image/*" onChange={onFileChange} style={{ fontFamily: "Franklin Gothic Medium", fontSize: "13px" }} />
        {preview && <img src={preview} alt="preview" style={{ maxWidth: "220px", maxHeight: "150px", borderRadius: "9px", objectFit: "cover" }} />}

        {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white", height: "35px" }}>{t(lang, "save")}</button>
          <button type="button" onClick={() => navigate(`/posts/${id}`)} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white", height: "35px" }}>{t(lang, "cancel")}</button>
        </div>
      </form>
    </div>
  );
}