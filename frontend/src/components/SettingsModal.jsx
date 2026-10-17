import { useState } from "react";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function SettingsModal({ user, setUser, onClose, lang }) {
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const saveProfile = async e => {
    e.preventDefault(); setError(""); setMsg("");
    try {
      const data = await api.updateProfile({ name, email });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg(t(lang, "profileUpdated"));
    } catch (e) { setError(e.message); }
  };

  const savePassword = async e => {
    e.preventDefault(); setError(""); setMsg("");
    try {
      await api.changePassword({ old_password: oldPassword, new_password: newPassword });
      setMsg(t(lang, "passwordChanged"));
      setOldPassword(""); setNewPassword("");
    } catch (e) { setError(e.message); }
  };

  const inputStyle = {
    width: "100%",
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

  const tabStyle = active => ({
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "Franklin Gothic Medium",
    fontSize: "14px",
    background: active ? "var(--accent)" : "transparent",
    color: active ? "white" : "var(--text-main)"
  });

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000 }} />

      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "420px", maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto", background: "var(--bg-card)", borderRadius: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.5)", zIndex: 1001, color: "var(--text-main)", fontFamily: "Franklin Gothic Medium" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "18px" }}>⚙️ {t(lang, "settings")}</h3>
          <button onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "24px", cursor: "pointer", color: "var(--text-main)", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: "12px 20px", display: "flex", gap: "6px", borderBottom: "1px solid var(--border-color)" }}>
          <button onClick={() => setTab("profile")} style={tabStyle(tab === "profile")}>{t(lang, "profileTab")}</button>
          <button onClick={() => setTab("security")} style={tabStyle(tab === "security")}>{t(lang, "securityTab")}</button>
        </div>

        <div style={{ padding: "20px" }}>
          {error && <p style={{ color: "var(--danger)", margin: "0 0 12px" }}>{error}</p>}
          {msg && <p style={{ color: "var(--success)", margin: "0 0 12px" }}>{msg}</p>}

          {tab === "profile" ? (
            <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder={t(lang, "name")} required />
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t(lang, "email")} required />
              <button type="submit" style={{ border: "none", borderRadius: "10px", padding: "10px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "var(--accent)", color: "white" }}>{t(lang, "save")}</button>
            </form>
          ) : (
            <form onSubmit={savePassword} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input style={inputStyle} type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder={t(lang, "oldPassword")} required />
              <input style={inputStyle} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={t(lang, "newPassword")} required />
              <button type="submit" style={{ border: "none", borderRadius: "10px", padding: "10px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "var(--accent)", color: "white" }}>{t(lang, "changePassword")}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}