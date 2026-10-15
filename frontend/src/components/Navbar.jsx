import { Link } from "react-router-dom";
import LanguageSelector from "./LanguageSelector.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { t } from "../translations.js";

export default function Navbar({ user, onLogout, lang, setLang }) {
  const isAdmin = user?.role === "admin";

  return (
    <nav style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-color)", background: "var(--bg-nav)", color: "var(--text-main)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap", fontFamily: "Franklin Gothic Medium", transition: "background 0.3s" }}>
      {user && (
        <>
          <Link to="/" style={{ color: "var(--text-main)" }}>{t(lang, "posts")}</Link>
          <Link to="/my-posts" style={{ color: "var(--text-main)" }}>{t(lang, "myPosts")}</Link>
          <Link to="/menu" style={{ color: "var(--text-main)" }}>{t(lang, "manageMenu")}</Link>
          <Link to="/create" style={{ color: "var(--text-main)" }}>{t(lang, "createPost")}</Link>

          {isAdmin && (
            <span style={{ borderLeft: "2px solid var(--accent)", paddingLeft: "15px", display: "flex", gap: "18px" }}>
              <Link to="/admin/users" style={{ color: "var(--accent)", fontWeight: "bold" }}>{t(lang, "users")}</Link>
              <Link to="/admin/languages" style={{ color: "var(--accent)", fontWeight: "bold" }}>{t(lang, "languages")}</Link>
            </span>
          )}

          <span style={{ borderLeft: "2px solid var(--border-color)", paddingLeft: "15px", display: "flex", gap: "18px", alignItems: "center" }}>
            <Link to="/profile" style={{ color: "var(--text-main)" }}>{t(lang, "profile")}</Link>
            <span style={{ color: "var(--text-main)" }}>{t(lang, "hello")}, {user.name}!</span>
            <button onClick={onLogout} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "var(--danger)", color: "white" }}>{t(lang, "logout")}</button>
          </span>
        </>
      )}

      {!user && (
        <>
          <Link to="/login" style={{ color: "var(--text-main)" }}>{t(lang, "login")}</Link>
          <Link to="/register" style={{ color: "var(--text-main)" }}>{t(lang, "registration")}</Link>
        </>
      )}

      <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
        <ThemeToggle />
        <LanguageSelector lang={lang} setLang={setLang} />
      </div>
    </nav>
  );
}