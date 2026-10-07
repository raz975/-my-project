import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { t } from "../translations.js";

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
        {posts.map(post => (
          <div key={post.id} style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "205px", height: "180px", boxSizing: "border-box", overflow: "hidden" }}>
            <h2 style={{ margin: "0 0 10px", fontSize: "22px" }}>{post.title}</h2>
            <p style={{ margin: "7px 0" }}>{t(lang, "author")}: {post.author}</p>
            <p style={{ margin: "7px 0 16px", overflow: "hidden" }}>{post.content?.substring(0, 55)}{post.content?.length > 55 ? "..." : ""}</p>
            <Link to={`/posts/${post.id}`} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", textDecoration: "none", display: "inline-block", background: "white", color: "black" }}>{t(lang, "readMore")}</Link>
          </div>
        ))}
      </div>
      {!posts.length && !error && <p style={{ fontFamily: "Franklin Gothic Medium" }}>{onlyMine ? t(lang, "noMyPosts") : t(lang, "noPosts")}</p>}
    </>
  );
}