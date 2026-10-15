import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function Post({ user, lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [image, setImage] = useState(null);
  const [likes, setLikes] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getPost(id, lang), api.getPostImage(id)])
      .then(([pData, iData]) => {
        setPost(pData.post);
        setLikes(pData.post.likes || 0);
        setLikedByMe(pData.post.liked_by_me === 1);
        if (iData.image) setImage("http://my-api" + iData.image.url);
      })
      .catch(e => setError(e.message));
  }, [id, lang]);

  const toggleLike = async () => {
    if (!user || loadingLike) return;
    setLoadingLike(true);
    try {
      const res = await api.likePost(post.id);
      setLikes(res.likes);
      setLikedByMe(res.liked);
    } catch (e) {
      console.warn(e.message);
    } finally {
      setLoadingLike(false);
    }
  };

  if (error) return <p style={{ color: "var(--danger)" }}>{error}</p>;
  if (!post) return <p style={{ fontFamily: "Franklin Gothic Medium", color: "var(--text-main)" }}>{t(lang, "loading")}</p>;

  const owner = user && Number(user.id) === Number(post.user_id);
  const isAdmin = user && user.role === "admin";

  const remove = async () => {
    if (!confirm(t(lang, "deletePostConfirm"))) return;
    try {
      await api.deletePost(post.id);
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ background: "var(--bg-card)", boxShadow: "var(--shadow)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "430px", minHeight: "240px", margin: "30px auto", boxSizing: "border-box", color: "var(--text-main)", transition: "background 0.3s" }}>
      <h1 style={{ margin: "0 0 18px", fontSize: "30px" }}>{post.title}</h1>
      <p style={{ margin: "9px 0" }}><b>{t(lang, "author")}:</b> {post.author}</p>
      <p style={{ margin: "9px 0" }}><b>{t(lang, "created")}:</b> {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Unknown"}</p>

      {image && (
        <div style={{ margin: "15px 0", textAlign: "center" }}>
          <img src={image} alt={post.title} style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "10px", objectFit: "cover" }} />
        </div>
      )}

      <p style={{ margin: "14px 0 16px" }}>{post.content}</p>

      {/* ЛАЙКИ */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <button
          onClick={toggleLike}
          disabled={loadingLike || !user}
          title={user ? "" : "Войдите, чтобы лайкать"}
          style={{
            border: "2px solid " + (likedByMe ? "#e91e63" : "var(--border-color)"),
            background: likedByMe ? "#fce4ec" : "transparent",
            cursor: user ? "pointer" : "not-allowed",
            fontSize: "16px",
            padding: "6px 14px",
            borderRadius: "20px",
            fontFamily: "Franklin Gothic Medium",
            color: likedByMe ? "#e91e63" : "var(--text-main)",
            fontWeight: "bold",
            transition: "all 0.2s"
          }}
        >
          {likedByMe ? "❤️" : "🤍"} {likes} {likes === 1 ? "лайк" : "лайков"}
        </button>
      </div>

      {(owner || isAdmin) && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={remove} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "var(--danger)", color: "white" }}>{t(lang, "delete")}</button>
          {owner && <Link to={`/edit/${post.id}`} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", textDecoration: "none", display: "inline-block", background: "var(--accent)", color: "white" }}>{t(lang, "edit")}</Link>}
        </div>
      )}
    </div>
  );
}