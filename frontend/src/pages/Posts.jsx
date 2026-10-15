import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

function PostCard({ post, lang, user }) {
  const [image, setImage] = useState(null);
  const [likes, setLikes] = useState(post.likes || 0);
  const [likedByMe, setLikedByMe] = useState(post.liked_by_me === 1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getPostImage(post.id)
      .then(data => { if (data.image) setImage("http://my-api" + data.image.url); })
      .catch(() => {});
  }, [post.id]);

  const toggleLike = async () => {
    if (!user || loading) return;
    setLoading(true);
    try {
      const res = await api.likePost(post.id);
      setLikes(res.likes);
      setLikedByMe(res.liked);
    } catch (e) {
      console.warn(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg-card)", boxShadow: "var(--shadow)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "205px", height: "300px", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column", color: "var(--text-main)", transition: "background 0.3s" }}>
      {image && (
        <img src={image} alt={post.title} style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
      )}
      <h2 style={{ margin: "0 0 8px", fontSize: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</h2>
      <p style={{ margin: "5px 0", fontSize: "13px", color: "var(--text-secondary)" }}>{t(lang, "author")}: {post.author}</p>
      <p style={{ margin: "5px 0 8px", fontSize: "13px", overflow: "hidden", flex: 1 }}>{post.content?.substring(0, 45)}{post.content?.length > 45 ? "..." : ""}</p>

      {/* ЛАЙКИ + Read More */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto" }}>
        <button
          onClick={toggleLike}
          disabled={loading || !user}
          title={user ? "" : "Войдите, чтобы лайкать"}
          style={{
            border: "none",
            background: "transparent",
            cursor: user ? "pointer" : "not-allowed",
            fontSize: "16px",
            padding: "4px",
            borderRadius: "8px",
            transition: "transform 0.15s",
            color: likedByMe ? "#e91e63" : "var(--text-muted)"
          }}
        >
          {likedByMe ? "❤️" : "🤍"} {likes}
        </button>

        <Link to={`/posts/${post.id}`} style={{ border: "none", borderRadius: "10px", padding: "7px 12px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", textDecoration: "none", display: "inline-block", background: "var(--accent)", color: "white", fontSize: "12px", textAlign: "center", marginLeft: "auto" }}>{t(lang, "readMore")}</Link>
      </div>
    </div>
  );
}

export default function Posts({ user, onlyMine = false, lang }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPosts(lang, search)
      .then(data => {
        const all = data.posts || [];
        setPosts(onlyMine ? all.filter(p => Number(p.user_id) === Number(user.id)) : all);
      })
      .catch(e => setError(e.message));
  }, [user, onlyMine, lang, search]);

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "9px",
    border: "1px solid var(--border-input)",
    fontFamily: "Franklin Gothic Medium",
    width: "250px",
    fontSize: "14px",
    outline: "none",
    background: "var(--bg-input)",
    color: "var(--text-main)"
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
        <h1 style={{ fontFamily: "Franklin Gothic Medium", margin: 0, color: "var(--text-main)" }}>{onlyMine ? t(lang, "myPosts") : t(lang, "allPosts")}</h1>
        <input
          style={inputStyle}
          type="text"
          placeholder={t(lang, "search") || "Поиск..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      <div style={{ display: "flex", gap: "20px", rowGap: "20px", flexWrap: "wrap" }}>
        {posts.map(post => <PostCard key={post.id} post={post} lang={lang} user={user} />)}
      </div>
      {!posts.length && !error && <p style={{ fontFamily: "Franklin Gothic Medium", color: "var(--text-main)" }}>{onlyMine ? t(lang, "noMyPosts") : t(lang, "noPosts")}</p>}
    </>
  );
}