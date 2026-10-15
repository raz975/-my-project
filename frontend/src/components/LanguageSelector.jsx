import { useEffect, useState } from "react";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function LanguageSelector({ lang, setLang }) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    api.getPublicLanguages()
      .then(data => setLanguages(data.languages || []))
      .catch(() => setLanguages([{ id: 1, code: "ru", name: "Русский" }]));
  }, []);

  const changeLanguage = e => {
    const code = e.target.value;
    setLang(code);
    localStorage.setItem("language", code);
  };

  const selectStyle = {
    padding: "8px 12px",
    border: "1px solid var(--border-input)",
    borderRadius: "9px",
    fontFamily: "Franklin Gothic Medium",
    background: "var(--bg-input)",
    color: "var(--text-main)",
    fontSize: "13px",
    cursor: "pointer",
    outline: "none",
    transition: "background 0.2s"
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <select value={lang} onChange={changeLanguage} style={selectStyle}>
        {languages.map(l => (
          <option key={l.id} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}