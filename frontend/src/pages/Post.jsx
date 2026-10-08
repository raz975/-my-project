import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function Post({ user, lang }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getPost(id, lang), api.getPostImage(id)])
      .then(([pData, iData]) => {
        setPost(pData.post);
        if (iData.image) setImage("http://my-api" + iData.image.url);
      })
      .catch(e => setError(e.message));
  }, [id, lang]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p style={{ fontFamily: "Franklin Gothic Medium" }}>{t(lang, "loading")}</p>;

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
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "430px", minHeight: "240px", margin: "30px auto", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 18px", fontSize: "30px" }}>{post.title}</h1>
      <p style={{ margin: "9px 0" }}><b>{t(lang, "author")}:</b> {post.author}</p>
      <p style={{ margin: "9px 0" }}><b>{t(lang, "created")}:</b> {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Unknown"}</p>

      {image && (
        <div style={{ margin: "15px 0", textAlign: "center" }}>
          <img src={image} alt={post.title} style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "10px", objectFit: "cover" }} />
        </div>
      )}

      <p style={{ margin: "14px 0 20px" }}>{post.content}</p>
      {(owner || isAdmin) && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={remove} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white" }}>{t(lang, "delete")}</button>
          {owner && <Link to={`/edit/${post.id}`} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", textDecoration: "none", display: "inline-block", background: "#2196f3", color: "white" }}>{t(lang, "edit")}</Link>}
        </div>
      )}
    </div>
  );
}