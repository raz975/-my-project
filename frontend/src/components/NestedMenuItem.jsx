import { useState } from "react";
import { t } from "../translations.js";

export default function NestedMenuItem({ item, onEdit, onDelete, isAdmin, lang, level = 0 }) {
  const [open, setOpen] = useState(true);
  const children = item.children?.length > 0;

  return (
    <li style={{ listStyle: "none", marginBottom: "8px", marginLeft: level > 0 ? "20px" : 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 11px", background: "white", borderRadius: "9px", width: "fit-content", maxWidth: "100%" }}>
        <span onClick={() => children && setOpen(!open)} style={{ cursor: children ? "pointer" : "default" }}>
          {children ? (open ? "📂" : "📁") : "📄"}
        </span>
        <span>{item.display_name || item.name}</span>
        {item.url && <small style={{ color: "#777" }}>{item.url}</small>}
        {isAdmin && (
          <>
            <button onClick={() => onEdit(item)} style={{ border: "none", borderRadius: "10px", padding: "5px 10px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white" }}>{t(lang, "edit")}</button>
            <button onClick={() => onDelete(item.id)} style={{ border: "none", borderRadius: "10px", padding: "5px 10px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white" }}>{t(lang, "delete")}</button>
          </>
        )}
      </div>
      {children && open && (
        <ul style={{ paddingLeft: "10px", margin: "8px 0 0" }}>
          {item.children.map(child => (
            <NestedMenuItem key={child.id} item={child} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} lang={lang} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}