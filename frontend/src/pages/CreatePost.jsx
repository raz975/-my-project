import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function CreatePost({ lang }) {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [activeTab, setActiveTab] = useState("ru");
  const [translations, setTranslations] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getPublicLanguages()
      .then(data => {
        const langs = data.languages || [];
        setLanguages(langs);

        const initial = {};
        langs.forEach(l => { initial[l.code] = { title: "", content: "" }; });
        setTranslations(initial);

        const active = langs.find(l => l.is_active === 1);
        if (active) setActiveTab(active.code);
      })
      .catch(() => setError("Failed to load languages"));
  }, []);

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
    setLoading(true);
    setError("");

    const main = translations[activeTab] || translations.ru || { title: "", content: "" };

    if (!main.title || !main.content) {
      setError("Заполните поля для активного языка: " + activeTab);
      setLoading(false);
      return;
    }

    try {
      const created = await api.createPost({
        title: main.title,
        content: main.content,
        translations
      });
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

  const inputStyle = { width: "260px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "440px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 20px" }}>{t(lang, "createPostTitle")}</h1>

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

        <input type="file" accept="image/*" onChange={onFileChange} style={{ fontFamily: "Franklin Gothic Medium", fontSize: "13px" }} />
        {preview && <img src={preview} alt="preview" style={{ maxWidth: "220px", maxHeight: "150px", borderRadius: "9px", objectFit: "cover" }} />}

        {error && <p style={{ color: "red", margin: "0" }}>{error}</p>}

        <button disabled={loading} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white", height: "35px" }}>
          {loading ? t(lang, "creating") : t(lang, "create")}
        </button>
      </form>
    </div>
  );
}