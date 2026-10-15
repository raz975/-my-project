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

  const deleteUser = async u => {
    if (u.id === user.id) { alert("Нельзя удалить себя"); return; }
    if (!confirm(`Удалить пользователя ${u.name} (${u.email})?`)) return;
    try {
      await api.deleteUser(u.id);
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div style={{ fontFamily: "Franklin Gothic Medium", maxWidth: "1000px", margin: "30px auto" }}>
      <h1>{t(lang, "users")}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ⭐ ОБЁРТКА СО СКРУГЛЕНИЕМ */}
      <div style={{
        marginTop: "20px",
        borderRadius: "14px",
        overflow: "hidden",          
        boxShadow: "4px 4px 10px rgba(0,0,0,.12)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
            {users.map(u => {
              const isMe = u.id === user.id;
              return (
                <tr
                  key={u.id}
                  style={{
                    background: isMe
                      ? "#d4f5d4"
                      : u.is_blocked === 1
                      ? "#ffe0e0"
                      : "white",
                    fontWeight: isMe ? "bold" : "normal"
                  }}
                >
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.id}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {u.name} {isMe && <small style={{ color: "#2e7d32" }}>({t(lang, "you")})</small>}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{u.email}</td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {u.role === "admin" ? t(lang, "roleAdmin") : t(lang, "roleUser")}
                    {u.is_blocked === 1 && <span style={{ color: "red", marginLeft: "8px" }}>● {t(lang, "blocked")}</span>}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {isMe ? (
                      <span style={{ color: "#666", fontSize: "13px" }}>— {t(lang, "you")} —</span>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleBlock(u)}
                          style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: u.is_blocked === 1 ? "#4caf50" : "#ff9800", color: "white" }}
                        >
                          {u.is_blocked === 1 ? t(lang, "unblock") : t(lang, "block")}
                        </button>

                        <button
                          onClick={() => changeRole(u)}
                          style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: "#2196f3", color: "white" }}
                        >
                          {u.role === "admin" ? "→ User" : "→ Admin"}
                        </button>

                        <button
                          onClick={() => deleteUser(u)}
                          style={{ border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", background: "red", color: "white" }}
                        >
                          {t(lang, "delete")}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}