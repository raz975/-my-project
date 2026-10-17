import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";
import SettingsModal from "../components/SettingsModal.jsx";

export default function Profile({ user, setUser, lang }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const load = () => {
    setLoading(true);
    api.getMyProfile()
      .then(data => setProfile(data.profile))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <p style={{ fontFamily: "Franklin Gothic Medium", color: "var(--text-main)", textAlign: "center", marginTop: "40px" }}>{t(lang, "loading")}</p>;
  if (error) return <p style={{ color: "var(--danger)", textAlign: "center", marginTop: "40px" }}>{error}</p>;
  if (!profile) return null;

  return (
    <>
      <div style={{ maxWidth: "900px", margin: "30px auto", fontFamily: "Franklin Gothic Medium", color: "var(--text-main)" }}>
        
        <div style={{ background: "var(--bg-card)", borderRadius: "16px", padding: "30px", boxShadow: "var(--shadow)", display: "flex", gap: "30px", alignItems: "center", flexWrap: "wrap", transition: "background 0.3s" }}>
          
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "white", fontWeight: "bold", flexShrink: 0 }}>
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: "250px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
              <h1 style={{ margin: "0", fontSize: "26px" }}>{profile.name}</h1>
              <button onClick={() => setShowSettings(true)} title={t(lang, "settings")} style={{ border: "none", background: "var(--bg-hover)", borderRadius: "10px", padding: "6px 10px", cursor: "pointer", fontSize: "18px" }}>⚙️</button>
              {profile.role === "admin" && (
                <span style={{ background: "var(--accent)", color: "white", fontSize: "12px", padding: "3px 10px", borderRadius: "20px" }}>ADMIN</span>
              )}
            </div>
            <p style={{ margin: "8px 0", color: "var(--text-secondary)", fontSize: "14px" }}>{profile.email}</p>
          </div>

          <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
            <Stat label={t(lang, "posts")} value={profile.posts.length} />
            <Stat label={t(lang, "followers")} value={profile.followers} />
            <Stat label={t(lang, "following")} value={profile.following} />
            <Stat label={t(lang, "likesReceived")} value={"❤️ " + profile.likes_received} />
          </div>
        </div>

        <h2 style={{ margin: "30px 0 20px" }}>{t(lang, "posts")}</h2>
        
        {profile.posts.length ? (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {profile.posts.map(post => (
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "14px",
                  padding: "12px",
                  boxShadow: "var(--shadow-small)",
                  width: "220px",
                  boxSizing: "border-box",
                  textDecoration: "none",
                  color: "var(--text-main)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.15s, box-shadow 0.15s"
                }}
              >
                {post.image_url ? (
                  <img
                    src={"http://my-api" + post.image_url}
                    alt={post.title}
                    style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "120px", background: "var(--bg-hover)", borderRadius: "10px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "12px" }}>
                    нет картинки
                  </div>
                )}
                
                <h3 style={{ margin: "0 0 8px", fontSize: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</h3>
                <p style={{ margin: "0", fontSize: "13px", color: "var(--text-secondary)", overflow: "hidden", flex: 1 }}>{post.content?.substring(0, 60)}{post.content?.length > 60 ? "..." : ""}</p>
                <small style={{ marginTop: "10px", color: "var(--text-muted)", fontSize: "11px" }}>
                  {post.created_at ? new Date(post.created_at).toLocaleDateString() : ""}
                </small>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>{t(lang, "noUserPosts")}</p>
        )}

      </div>

      {showSettings && (
        <SettingsModal user={user} setUser={setUser} onClose={() => setShowSettings(false)} lang={lang} />
      )}
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "22px", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}