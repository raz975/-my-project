import { useState } from "react";
import { api } from "../api.js";
import { t } from "../translations.js";

export default function CommentItem({ comment, user, postOwnerId, onUpdate, onDelete, lang }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [likes, setLikes] = useState(comment.likes);
  const [likedByMe, setLikedByMe] = useState(comment.liked_by_me === 1);
  const [likeLoading, setLikeLoading] = useState(false);

  const isAuthor = user && Number(user.id) === Number(comment.user_id);
  const isPostOwner = user && Number(user.id) === Number(postOwnerId);
  const isAdmin = user && user.role === "admin";
  const canDelete = isAuthor || isPostOwner || isAdmin;
  const canEdit = isAuthor;

  const saveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await api.updateComment(comment.id, editText.trim());
      setEditing(false);
      onUpdate();
    } catch (e) { alert(e.message); }
  };

  const remove = async () => {
    if (!confirm(t(lang, "deleteCommentConfirm"))) return;
    try {
      await api.deleteComment(comment.id);
      onDelete();
    } catch (e) { alert(e.message); }
  };

  const toggleLike = async () => {
    if (!user || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await api.likeComment(comment.id);
      setLikes(res.likes);
      setLikedByMe(res.liked);
    } catch (e) { console.warn(e.message); }
    finally { setLikeLoading(false); }
  };

  const btnStyle = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "12px",
    padding: "3px 6px",
    color: "var(--text-muted)",
    borderRadius: "6px",
    fontFamily: "Franklin Gothic Medium"
  };

  return (
    <div style={{ padding: "12px", marginBottom: "10px", background: "var(--bg-row)", borderRadius: "10px", color: "var(--text-main)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <b style={{ fontSize: "14px" }}>{comment.author}</b>
        <small style={{ color: "var(--text-muted)", fontSize: "12px" }}>
          {new Date(comment.created_at).toLocaleString()}
          {comment.updated_at && " " + t(lang, "edited")}
        </small>
      </div>

      {editing ? (
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          <textarea
            value={editText}
            onChange={e => setEditText(e.target.value)}
            style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--border-input)", background: "var(--bg-input)", color: "var(--text-main)", fontFamily: "Franklin Gothic Medium", resize: "none", minHeight: "60px" }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={saveEdit} style={{ border: "none", borderRadius: "8px", padding: "5px 12px", cursor: "pointer", background: "var(--accent)", color: "white", fontSize: "12px" }}>{t(lang, "save")}</button>
            <button onClick={() => { setEditing(false); setEditText(comment.content); }} style={{ border: "none", borderRadius: "8px", padding: "5px 12px", cursor: "pointer", background: "var(--danger)", color: "white", fontSize: "12px" }}>{t(lang, "cancel")}</button>
          </div>
        </div>
      ) : (
        <p style={{ margin: "0 0 8px", whiteSpace: "pre-wrap", fontSize: "14px" }}>{comment.content}</p>
      )}

      {!editing && (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={toggleLike}
            disabled={!user || likeLoading}
            style={{ border: "none", background: "transparent", cursor: user ? "pointer" : "not-allowed", fontSize: "13px", color: likedByMe ? "#e91e63" : "var(--text-muted)", padding: "3px 6px", fontFamily: "Franklin Gothic Medium" }}
          >
            {likedByMe ? "❤️" : "🤍"} {likes}
          </button>

          {canEdit && <button onClick={() => setEditing(true)} style={btnStyle}>{t(lang, "edit")}</button>}
          {canDelete && <button onClick={remove} style={{ ...btnStyle, color: "var(--danger)" }}>{t(lang, "delete")}</button>}
        </div>
      )}
    </div>
  );
}