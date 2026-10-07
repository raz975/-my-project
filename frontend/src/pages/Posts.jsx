import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

function PostCard({ post, lang }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    api.getPostImage(post.id)
      .then(data => { if (data.image) setImage("http://my-api" + data.image.url); })
      .catch(() => {});
  }, [post.id]);

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "205px", height: "270px", boxSizing: "border-box", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {image && (
        <img src={image} alt={post.title} style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} />
      )}
      <h2 style={{ margin: "0 0 8px", fontSize: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</h2>
      <p style={{ margin: "5px 0", fontSize: "13px" }}>{t(lang, "author")}: {post.author}</p>
      <p style={{ margin: "5px 0 12px", fontSize: "13px", overflow: "hidden", flex: 1 }}>{post.content?.substring(0, 55)}{post.content?.length > 55 ? "..." : ""}</p>
      <Link to={`/posts/${post.id}`} style={{ border: "none", borderRadius: "10px", padding: "7px 14px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", textDecoration: "none", display: "inline-block", background: "white", color: "black", fontSize: "13px", textAlign: "center", marginTop: "auto" }}>{t(lang, "readMore")}</Link>
    </div>
  );
}

export default function Posts({ user, onlyMine = false, lang }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPosts()
      .then(data => {
        const all = data.posts || [];
        setPosts(onlyMine ? all.filter(p => Number(p.user_id) === Number(user.id)) : all);
      })
      .catch(e => setError(e.message));
  }, [user, onlyMine]);

  return (
    <>
      <h1 style={{ fontFamily: "Franklin Gothic Medium", margin: "0 0 25px" }}>{onlyMine ? t(lang, "myPosts") : t(lang, "allPosts")}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", gap: "20px", rowGap: "20px", flexWrap: "wrap" }}>
        {posts.map(post => <PostCard key={post.id} post={post} lang={lang} />)}
      </div>
      {!posts.length && !error && <p style={{ fontFamily: "Franklin Gothic Medium" }}>{onlyMine ? t(lang, "noMyPosts") : t(lang, "noPosts")}</p>}
    </>
  );
}