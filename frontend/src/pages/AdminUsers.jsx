import { useEffect, useState } from "react";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function AdminUsers({ user, lang }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api.getUsers()
      .then(data => setUsers(data.users || []))
      .catch(e => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const toggleBlock = async u => {
    if (u.id === user.id) { alert(t(lang, "cannotBlockSelf")); return; }
    const action = u.is_blocked === 1 ? t(lang, "confirmUnblock") : t(lang, "confirmBlock");
    if (!confirm(action)) return;
    try {
      await api.blockUser(u.id, u.is_blocked === 1 ? 0 : 1);
      load();
    } catch (e) { alert(e.message); }
  };

  const changeRole = async u => {
    if (u.id === user.id) { alert(t(lang, "cannotChangeOwnRole")); return; }
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!confirm(`${t(lang, "confirmChangeRole")} → ${newRole}`)) return;
    try {
      await api.changeRole(u.id, newRole);
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ fontFamily: "Franklin Gothic Medium", maxWidth: "900px", margin: "30px auto" }}>
      <h1>{t(lang, "users")}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>{t(lang, "name")}</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>{t(lang, "email")}</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>{t(lang, "role")}</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>{t(lang, "actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ background: u.is_blocked === 1 ? "#ffe0e0" : "white" }}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.id}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.name} {u.id === user.id && <small>({t(lang, "you")})</small>}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.email}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.role === "admin" ? t(lang, "roleAdmin") : t(lang, "roleUser")}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => toggleBlock(u)} style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: u.is_blocked === 1 ? "#4caf50" : "#ff9800", color: "white" }}>{u.is_blocked === 1 ? t(lang, "unblock") : t(lang, "block")}</button>
                <button onClick={() => changeRole(u)} style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: "#2196f3", color: "white" }}>{t(lang, "changeRole")}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}