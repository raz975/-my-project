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

  const changeLanguage = code => {
    setLang(code);
    localStorage.setItem("language", code);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "auto" }}>
      <span style={{ fontSize: "13px", color: "#555", marginRight: "3px" }}>
        {t(lang, "language")}:
      </span>
      {languages.map(l => (
        <button
          key={l.id}
          onClick={() => changeLanguage(l.code)}
          style={{ border: lang === l.code ? "1px solid #2196f3" : "1px solid #ddd", borderRadius: "10px", padding: "6px 9px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: lang === l.code ? "#d9ecff" : "white", color: "#222", fontSize: "13px" }}
        >
          {l.name}
        </button>
      ))}
    </div>
  );
}