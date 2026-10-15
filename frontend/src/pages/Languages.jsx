import { useEffect, useState } from "react";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function Languages({ lang }) {
  const [languages, setLanguages] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    api.getLanguages()
      .then(data => setLanguages(data.languages || []))
      .catch(e => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setCode("");
    setName("");
    setEditingId(null);
    setError("");
    setMsg("");
  };

  const edit = l => {
    setEditingId(l.id);
    setName(l.name);
    setCode(l.code);
    setError("");
    setMsg("");
  };

  const submit = async e => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      if (editingId) {
        await api.updateLanguage({ id: editingId, name });
        setMsg(t(lang, "profileUpdated"));
      } else {
        await api.createLanguage({ code, name });
        setMsg(t(lang, "profileUpdated"));
      }
      reset();
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async id => {
    if (!confirm(t(lang, "deleteLangConfirm"))) return;
    try {
      await api.deleteLanguage(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const setActive = async id => {
    try {
      await api.setActiveLanguage(id);
      load();
    } catch (e) {
      alert(e.message);
    }
  };

  const inputStyle = {
    width: "200px",
    height: "38px",
    padding: "8px 12px",
    border: "1px solid var(--border-input)",
    borderRadius: "9px",
    fontFamily: "Franklin Gothic Medium",
    boxSizing: "border-box",
    outline: "none",
    background: "var(--bg-input)",
    color: "var(--text-main)"
  };

  return (
    <div style={{ fontFamily: "Franklin Gothic Medium", maxWidth: "950px", margin: "30px auto", color: "var(--text-main)" }}>
      <h1 style={{ color: "var(--text-main)" }}>{t(lang, "languages")}</h1>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {msg && <p style={{ color: "var(--success)" }}>{msg}</p>}

      <div style={{ display: "flex", gap: "35px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, background: "var(--bg-row-alt)", borderRadius: "14px", padding: "20px", boxSizing: "border-box", color: "var(--text-main)" }}>
          <h2 style={{ margin: "0 0 20px", color: "var(--text-main)" }}>{t(lang, "languages")}</h2>
          {languages.length ? (
            <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {languages.map(l => (
                <li key={l.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", marginBottom: "8px", background: "var(--bg-row)", borderRadius: "9px", border: l.is_active === 1 ? "2px solid var(--success)" : "1px solid var(--border-color)", color: "var(--text-main)" }}>
                  <b>{l.code}</b>
                  <span>{l.name}</span>
                  {l.is_active === 1 && (
                    <span style={{ fontSize: "12px", color: "var(--success)", marginLeft: "5px" }}>
                      ● {t(lang, "activeLang")}
                    </span>
                  )}
                  <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                    {l.is_active !== 1 && (
                      <button onClick={() => setActive(l.id)} style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: "var(--success)", color: "white" }}>{t(lang, "setActive")}</button>
                    )}
                    <button onClick={() => edit(l)} style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: "var(--accent)", color: "white" }}>{t(lang, "edit")}</button>
                    <button onClick={() => remove(l.id)} style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: "var(--danger)", color: "white" }}>{t(lang, "delete")}</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t(lang, "loading")}</p>
          )}
        </div>

        <div style={{ background: "var(--bg-card)", boxShadow: "var(--shadow)", borderRadius: "14px", padding: "20px", boxSizing: "border-box", width: "300px", color: "var(--text-main)", transition: "background 0.3s" }}>
          <h2 style={{ margin: "0 0 20px", color: "var(--text-main)" }}>
            {editingId ? t(lang, "editLanguage") : t(lang, "addLanguage")}
          </h2>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              style={inputStyle}
              placeholder={t(lang, "langCode")}
              value={code}
              onChange={e => setCode(e.target.value.toLowerCase())}
              disabled={!!editingId}
              required
              pattern="[a-z]{2,5}"
              title="2-5 lowercase letters (ru, en, hy)"
            />
            <input
              style={inputStyle}
              placeholder={t(lang, "langName")}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "var(--accent)", color: "white", height: "35px" }}>
                {editingId ? t(lang, "save") : t(lang, "create")}
              </button>
              {editingId && (
                <button type="button" onClick={reset} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "var(--danger)", color: "white", height: "35px" }}>
                  {t(lang, "cancel")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}