import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector.jsx";
import { t } from "../translations.js";

export default function Navbar({ user, onLogout, lang, setLang }) {
  const isAdmin = user?.role === "admin";

  return (
    <nav style={{ padding: "12px 18px", borderBottom: "1px solid #ccc", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap", fontFamily: "Franklin Gothic Medium" }}>
      {user && (
        <>
          <Link to="/">{t(lang, "posts")}</Link>
          <Link to="/my-posts">{t(lang, "myPosts")}</Link>
          <Link to="/menu">{t(lang, "manageMenu")}</Link>
          <Link to="/create">{t(lang, "createPost")}</Link>

          {isAdmin && (
            <span style={{ borderLeft: "2px solid #2196f3", paddingLeft: "15px", display: "flex", gap: "18px" }}>
              <Link to="/admin/users" style={{ color: "#1976d2", fontWeight: "bold" }}>{t(lang, "users")}</Link>
              <Link to="/admin/languages" style={{ color: "#1976d2", fontWeight: "bold" }}>{t(lang, "languages")}</Link>
            </span>
          )}

          <span style={{ borderLeft: "2px solid #ddd", paddingLeft: "15px", display: "flex", gap: "18px", alignItems: "center" }}>
            <Link to="/profile">{t(lang, "profile")}</Link>
            <span>{t(lang, "hello")}, {user.name}!</span>
            <button onClick={onLogout} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white" }}>{t(lang, "logout")}</button>
          </span>
        </>
      )}

      {!user && (
        <>
          <Link to="/login">{t(lang, "login")}</Link>
          <Link to="/register">{t(lang, "registration")}</Link>
        </>
      )}

      <LanguageSelector lang={lang} setLang={setLang} />
    </nav>
  );
}