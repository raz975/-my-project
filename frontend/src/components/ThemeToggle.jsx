import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "6px 10px",
        cursor: "pointer",
        fontFamily: "Franklin Gothic Medium",
        background: "var(--bg-card)",
        color: "var(--text-main)",
        fontSize: "16px",
        transition: "background 0.2s"
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}