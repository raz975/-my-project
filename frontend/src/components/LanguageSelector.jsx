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
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span style={{ fontSize: "13px", color: "var(--text-secondary)", marginRight: "3px" }}>
        {t(lang, "language")}:
      </span>
      {languages.map(l => (
        <button
          key={l.id}
          onClick={() => changeLanguage(l.code)}
          style={{
            border: lang === l.code ? "1px solid var(--accent)" : "1px solid var(--border-color)",
            borderRadius: "10px",
            padding: "6px 9px",
            cursor: "pointer",
            fontFamily: "Franklin Gothic Medium",
            background: lang === l.code ? "var(--accent)" : "var(--bg-card)",
            color: lang === l.code ? "white" : "var(--text-main)",
            fontSize: "13px",
            transition: "all 0.2s"
          }}
        >
          {l.name}
        </button>
      ))}
    </div>
  );
}