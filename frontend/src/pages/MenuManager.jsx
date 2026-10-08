import { useEffect, useState } from "react";
import { api } from "../api.js";
import { t } from "../translations.js";
import MenuTree from "../components/MenuTree.jsx";

export default function MenuManager({ user, lang }) {
  const [menu, setMenu] = useState([]);
  const [items, setItems] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [activeTab, setActiveTab] = useState("ru");
  const [translations, setTranslations] = useState({});
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "admin";

  const load = () => {
    api.getMenu(lang)
      .then(data => {
        const tree = data?.menu || [];
        setMenu(tree);
        const flat = [];
        const flatten = list => list.forEach(x => {
          flat.push(x);
          if (x.children?.length) flatten(x.children);
        });
        flatten(tree);
        setItems(flat);
      })
      .catch(e => setError(e.message));
  };

  useEffect(() => {
    api.getPublicLanguages()
      .then(data => {
        const langs = data.languages || [];
        setLanguages(langs);
        const initial = {};
        langs.forEach(l => { initial[l.code] = ""; });
        setTranslations(initial);
        const active = langs.find(l => l.is_active === 1) || langs[0];
        if (active) setActiveTab(active.code);
      })
      .catch(() => {});
    load();
  }, [lang]);

  const reset = () => {
    setEditingId(null);
    setUrl("");
    setParentId("");
    const empty = {};
    languages.forEach(l => { empty[l.code] = ""; });
    setTranslations(empty);
    setError("");
  };

  const edit = item => {
    if (!isAdmin) return;
    setEditingId(item.id);
    setUrl(item.url || "");
    setParentId(item.parent_id || "");

    const initial = {};
    languages.forEach(l => {
      initial[l.code] = l.code === (lang || "ru") ? (item.name || "") : "";
    });
    setTranslations(initial);
    setError("");
  };

  const remove = async id => {
    if (!isAdmin) return;
    if (!confirm(t(lang, "deleteMenuConfirm"))) return;
    try {
      await api.deleteMenuItem(id);
      reset();
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const submit = async e => {
    e.preventDefault();
    if (!isAdmin) return;
    setLoading(true);
    setError("");

    const mainName = translations[activeTab] || "";
    if (!mainName.trim()) {
      setError("Введите название для активного языка: " + activeTab);
      setLoading(false);
      return;
    }

    const transMap = {};
    languages.forEach(l => {
      const val = (translations[l.code] || "").trim();
      if (val) transMap[l.id] = val;
    });

    const data = {
      name: mainName.trim(),
      url: url || null,
      parent_id: parentId ? Number(parentId) : null,
      translations: transMap
    };

    try {
      if (editingId) {
        await api.updateMenuItem({ id: editingId, ...data });
      } else {
        await api.createMenuItem(data);
      }
      reset();
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = newTopItems => {
    const ordered = newTopItems.map((it, i) => ({ id: it.id, sort_order: i }));
    api.reorderMenu(ordered).catch(err => console.warn("Reorder error:", err.message));
  };

  const inputStyle = {
    width: "220px",
    height: "38px",
    padding: "8px 12px",
    border: "none",
    borderRadius: "9px",
    fontFamily: "Franklin Gothic Medium",
    boxSizing: "border-box",
    outline: "none"
  };

  const topItems = items.filter(i => !i.parent_id);

  return (
    <div style={{ display: "flex", gap: "35px", alignItems: "flex-start", maxWidth: "950px", margin: "30px auto", fontFamily: "Franklin Gothic Medium" }}>
      <aside style={{ width: "360px", background: "#f5f5f5", borderRadius: "14px", padding: "20px", boxSizing: "border-box", boxShadow: "3px 3px 8px rgba(0,0,0,.08)" }}>
        <h2 style={{ margin: "0 0 20px" }}>{t(lang, "menu")}</h2>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}

        {isAdmin && <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>{t(lang, "dragToReorder")}</p>}

        {menu.length ? (
          <MenuTree
            items={topItems}
            setItems={handleReorder}
            onEdit={edit}
            onDelete={remove}
            isAdmin={isAdmin}
            lang={lang}
          />
        ) : (
          !error && <p>{t(lang, "noMenuItems")}</p>
        )}
      </aside>

      {isAdmin && (
        <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "340px", boxSizing: "border-box" }}>
          <h2 style={{ margin: "0 0 20px" }}>
            {editingId ? t(lang, "editMenu") : t(lang, "createMenu")}
          </h2>

          <div style={{ display: "flex", gap: "5px", marginBottom: "15px", flexWrap: "wrap" }}>
            {languages.map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => setActiveTab(l.code)}
                style={{
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontFamily: "Franklin Gothic Medium",
                  background: activeTab === l.code ? "#2196f3" : "#e0e0e0",
                  color: activeTab === l.code ? "white" : "#333",
                  fontSize: "13px"
                }}
              >
                {l.name}
              </button>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              style={inputStyle}
              placeholder={`${t(lang, "itemName")} (${activeTab})`}
              value={translations[activeTab] || ""}
              onChange={e => setTranslations({ ...translations, [activeTab]: e.target.value })}
            />

            <input
              style={inputStyle}
              placeholder={t(lang, "urlRoute")}
              value={url}
              onChange={e => setUrl(e.target.value)}
            />

            <select
              style={{ width: "240px", height: "38px", padding: "8px 10px", border: "none", borderRadius: "6px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", background: "white", fontSize: "14px", color: "#333", cursor: "pointer", outline: "none" }}
              value={parentId}
              onChange={e => setParentId(e.target.value)}
            >
              <option value="">{t(lang, "noParent")}</option>
              {items
                .filter(x => Number(x.id) !== Number(editingId))
                .map(x => (
                  <option key={x.id} value={x.id}>{x.name}</option>
                ))}
            </select>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={loading} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white", width: "80px", height: "35px" }}>
                {loading ? t(lang, "saving") : editingId ? t(lang, "save") : t(lang, "create")}
              </button>

              {editingId && (
                <button type="button" onClick={reset} style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", width: "80px", height: "35px", color: "white", backgroundColor: "red" }}>
                  {t(lang, "cancel")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}