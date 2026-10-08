import { useState } from "react";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function Profile({ user, setUser, lang }) {
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

  const inputStyle = { width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" };
  const cardStyle = { background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "400px", margin: "20px auto", textAlign: "center", boxSizing: "border-box" };

  return (
    <div>
      <h1 style={{ fontFamily: "Franklin Gothic Medium", textAlign: "center" }}>{t(lang, "myProfile")}</h1>

      <div style={cardStyle}>
        <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
          <h2>{t(lang, "profileInfo")}</h2>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder={t(lang, "name")} required />
          <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t(lang, "email")} required />
          <button style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white" }}>{t(lang, "save")}</button>
        </form>
      </div>

      <div style={cardStyle}>
        <form onSubmit={savePassword} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
          <h2>{t(lang, "security")}</h2>
          <input style={inputStyle} type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder={t(lang, "oldPassword")} required />
          <input style={inputStyle} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={t(lang, "newPassword")} required />
          <button style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white" }}>{t(lang, "changePassword")}</button>
        </form>
      </div>

      {msg && <p style={{ color: "green", textAlign: "center", fontFamily: "Franklin Gothic Medium" }}>{msg}</p>}
      {error && <p style={{ color: "red", textAlign: "center", fontFamily: "Franklin Gothic Medium" }}>{error}</p>}
    </div>
  );
}