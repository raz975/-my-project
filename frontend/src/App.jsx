import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { api } from "./api.js";

const translations = {
  ru: {
    posts: "Посты",
    myPosts: "Мои посты",
    manageMenu: "Управление меню",
    createPost: "Создать пост",
    login: "Войти",
    registration: "Регистрация",
    hello: "Привет",
    logout: "Выйти",
    allPosts: "Все посты",
    noPosts: "Постов пока нет.",
    noMyPosts: "У вас пока нет постов.",
    author: "Автор",
    created: "Создан",
    readMore: "Подробнее",
    delete: "Удалить",
    edit: "Изменить",
    save: "Сохранить",
    cancel: "Отмена",
    create: "Создать",
    saving: "Сохранение...",
    creating: "Создание...",
    loading: "Загрузка...",
    loginTitle: "Вход",
    registerTitle: "Регистрация",
    editPost: "Изменить пост",
    createPostTitle: "Создать пост",
    name: "Имя",
    email: "Email",
    password: "Пароль",
    title: "Заголовок",
    content: "Содержание",
    menu: "Меню",
    createMenu: "Создать меню",
    editMenu: "Изменить меню",
    itemName: "Название пункта",
    urlRoute: "URL / Маршрут",
    noParent: "Без родителя",
    deleteMenuConfirm: "Удалить этот пункт меню и все его подменю?",
    deletePostConfirm: "Удалить этот пост?",
    ownMenuError: "Только администратор может изменять меню",
    noMenuItems: "Пунктов меню пока нет.",
    language: "Язык"
  },
  en: {
    posts: "Posts",
    myPosts: "My Posts",
    manageMenu: "Manage Menu",
    createPost: "Create Post",
    login: "Login",
    registration: "Registration",
    hello: "Hello",
    logout: "Logout",
    allPosts: "All Posts",
    noPosts: "No posts yet.",
    noMyPosts: "You have no posts yet.",
    author: "Author",
    created: "Created",
    readMore: "Read more",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    create: "Create",
    saving: "Saving...",
    creating: "Creating...",
    loading: "Loading...",
    loginTitle: "Login",
    registerTitle: "Registration",
    editPost: "Edit Post",
    createPostTitle: "Create Post",
    name: "Name",
    email: "Email",
    password: "Password",
    title: "Title",
    content: "Content",
    menu: "Menu",
    createMenu: "Create Menu",
    editMenu: "Edit Menu",
    itemName: "Item Name",
    urlRoute: "URL / Route",
    noParent: "No Parent",
    deleteMenuConfirm: "Delete this menu item and all its submenus?",
    deletePostConfirm: "Delete this post?",
    ownMenuError: "Only the administrator can manage the menu",
    noMenuItems: "No menu items yet.",
    language: "Language"
  },
  hy: {
    posts: "Գրառումներ",
    myPosts: "Իմ գրառումները",
    manageMenu: "Մենյուի կառավարում",
    createPost: "Ստեղծել գրառում",
    login: "Մուտք",
    registration: "Գրանցում",
    hello: "Բարև",
    logout: "Ելք",
    allPosts: "Բոլոր գրառումները",
    noPosts: "Գրառումներ դեռ չկան։",
    noMyPosts: "Դուք դեռ գրառումներ չունեք։",
    author: "Հեղինակ",
    created: "Ստեղծվել է",
    readMore: "Կարդալ ավելին",
    delete: "Ջնջել",
    edit: "Փոփոխել",
    save: "Պահպանել",
    cancel: "Չեղարկել",
    create: "Ստեղծել",
    saving: "Պահպանվում է...",
    creating: "Ստեղծվում է...",
    loading: "Բեռնվում է...",
    loginTitle: "Մուտք",
    registerTitle: "Գրանցում",
    editPost: "Փոփոխել գրառումը",
    createPostTitle: "Ստեղծել գրառում",
    name: "Անուն",
    email: "Email",
    password: "Գաղտնաբառ",
    title: "Վերնագիր",
    content: "Բովանդակություն",
    menu: "Մենյու",
    createMenu: "Ստեղծել մենյու",
    editMenu: "Փոփոխել մենյուն",
    itemName: "Կետի անունը",
    urlRoute: "URL / Ճանապարհ",
    noParent: "Առանց ծնողի",
    deleteMenuConfirm: "Ջնջե՞լ այս մենյուի կետը և նրա բոլոր ենթամենյուները։",
    deletePostConfirm: "Ջնջե՞լ այս գրառումը։",
    ownMenuError: "Միայն ադմինիստրատորը կարող է կառավարել մենյուն",
    noMenuItems: "Մենյուի կետեր դեռ չկան։",
    language: "Լեզու"
  }
};

const t = (lang, key) => translations[lang]?.[key] || translations.en[key] || key;

function LanguageSelector({ lang, setLang }) {
  const changeLanguage = language => {
    setLang(language);
    localStorage.setItem("language", language);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "auto" }}>
      <span style={{ fontSize: "13px", color: "#555", marginRight: "3px" }}>
        {t(lang, "language")}:
      </span>

      <button
        onClick={() => changeLanguage("ru")}
        style={{ border: lang === "ru" ? "1px solid #2196f3" : "1px solid #ddd", borderRadius: "10px", padding: "6px 9px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: lang === "ru" ? "#d9ecff" : "white", color: "#222", fontSize: "13px" }}
      >
        🇷🇺 Русский
      </button>

      <button
        onClick={() => changeLanguage("en")}
        style={{ border: lang === "en" ? "1px solid #2196f3" : "1px solid #ddd", borderRadius: "10px", padding: "6px 9px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: lang === "en" ? "#d9ecff" : "white", color: "#222", fontSize: "13px" }}
      >
        🇺🇸 English
      </button>

      <button
        onClick={() => changeLanguage("hy")}
        style={{ border: lang === "hy" ? "1px solid #2196f3" : "1px solid #ddd", borderRadius: "10px", padding: "6px 9px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: lang === "hy" ? "#d9ecff" : "white", color: "#222", fontSize: "13px" }}
      >
        🇦🇲 Հայերեն
      </button>
    </div>
  );
}

function NestedMenuItem({ item, onEdit, onDelete, isAdmin, lang }) {
  const [open, setOpen] = useState(false);
  const children = item.children?.length > 0;

  return (
    <li style={{ listStyle: "none", marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 11px", background: "white", borderRadius: "9px", width: "fit-content", maxWidth: "100%" }}>
        <span
          onClick={() => children && setOpen(!open)}
          style={{ cursor: children ? "pointer" : "default" }}
        >
          {children ? (open ? "📂" : "📁") : "📄"}
        </span>

        <span>{item.name}</span>

        {item.url && (
          <small style={{ color: "#777" }}>
            {item.url}
          </small>
        )}

        {isAdmin && (
          <>
            <button
              onClick={() => onDelete(item.id)}
              style={{ border: "none", borderRadius: "10px", padding: "5px 10px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white" }}
            >
              {t(lang, "delete")}
            </button>

            <button
              onClick={() => onEdit(item)}
              style={{ border: "none", borderRadius: "10px", padding: "5px 10px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white" }}
            >
              {t(lang, "edit")}
            </button>
          </>
        )}
      </div>

      {children && open && (
        <ul style={{ paddingLeft: "28px", margin: "10px 0 0" }}>
          {item.children.map(child => (
            <NestedMenuItem
              key={child.id}
              item={child}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
              lang={lang}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function MenuManager({ user, lang }) {
  const [menu, setMenu] = useState([]);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.email === "admin@gmail.com";

  const load = async () => {
    try {
      const data = await api.getMenu();
      const tree = data?.menu || data || [];

      setMenu(Array.isArray(tree) ? tree : []);

      const flat = [];

      const flatten = list => {
        list.forEach(x => {
          flat.push(x);

          if (x.children?.length) {
            flatten(x.children);
          }
        });
      };

      if (Array.isArray(tree)) {
        flatten(tree);
      }

      setItems(flat);
    } catch (e) {
      setError(e.message || "Failed to load menu");
    }
  };

  useEffect(() => {
    if (user) {
      load();
    }
  }, [user]);

  const edit = item => {
    if (!isAdmin) {
      return;
    }

    setEditingId(item.id);
    setName(item.name);
    setUrl(item.url || "");
    setParentId(item.parent_id || "");
    setError("");
  };

  const reset = () => {
    setEditingId(null);
    setName("");
    setUrl("");
    setParentId("");
    setError("");
  };

  const remove = async id => {
    if (!isAdmin) {
      return;
    }

    if (!confirm(t(lang, "deleteMenuConfirm"))) {
      return;
    }

    try {
      await api.deleteMenuItem(id);
      reset();
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const submit = async e => {
    e.preventDefault();

    if (!isAdmin) {
      setError(t(lang, "ownMenuError"));
      return;
    }

    setLoading(true);
    setError("");

    const data = {
      name,
      url: url || null,
      parent_id: parentId ? Number(parentId) : null
    };

    try {
      if (editingId) {
        await api.updateMenuItem({
          id: editingId,
          ...data
        });
      } else {
        await api.createMenuItem(data);
      }

      reset();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "35px", alignItems: "flex-start", maxWidth: "950px", margin: "30px auto", fontFamily: "Franklin Gothic Medium" }}>
      <aside style={{ width: "360px", background: "#f5f5f5", borderRadius: "14px", padding: "20px", boxSizing: "border-box", boxShadow: "3px 3px 8px rgba(0,0,0,.08)" }}>
        <h2 style={{ margin: "0 0 20px" }}>
          {t(lang, "menu")}
        </h2>

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {menu.length ? (
          <ul style={{ padding: 0, margin: 0 }}>
            {menu.map(item => (
              <NestedMenuItem
                key={item.id}
                item={item}
                onEdit={edit}
                onDelete={remove}
                isAdmin={isAdmin}
                lang={lang}
              />
            ))}
          </ul>
        ) : (
          !error && (
            <p>
              {t(lang, "noMenuItems")}
            </p>
          )
        )}
      </aside>

      {isAdmin && (
        <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "300px", boxSizing: "border-box" }}>
          <h2 style={{ margin: "0 0 20px" }}>
            {editingId ? t(lang, "editMenu") : t(lang, "createMenu")}
          </h2>

          <form
            onSubmit={submit}
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "15px" }}
          >
            <input
              style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
              placeholder={t(lang, "itemName")}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />

            <input
              style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
              placeholder={t(lang, "urlRoute")}
              value={url}
              onChange={e => setUrl(e.target.value)}
            />

            <select
              style={{ width: "240px", height: "38px", padding: "8px 10px", border: "none", borderRadius: "6px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", background: "white", fontSize: "14px", color: "#333", cursor: "pointer", outline: "none" }}
              value={parentId}
              onChange={e => setParentId(e.target.value)}
            >
              <option value="">
                {t(lang, "noParent")}
              </option>

              {items
                .filter(x => Number(x.id) !== Number(editingId))
                .map(x => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
            </select>

            <div style={{ display: "flex", gap: "10px", marginTop: "3px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white", width: "80px", height: "35px" }}
              >
                {loading
                  ? t(lang, "saving")
                  : editingId
                  ? t(lang, "save")
                  : t(lang, "create")}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={reset}
                  style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", width: "80px", height: "35px", color: "white", backgroundColor: "red" }}
                >
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

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem("language") || "ru");

  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "hy" ? "hy" : lang;
  }, [lang]);

  const login = data => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}

    setUser(null);
    localStorage.removeItem("user");
  };

  if (loading) {
    return (
      <h2 style={{ fontFamily: "Franklin Gothic Medium" }}>
        {t(lang, "loading")}
      </h2>
    );
  }

  return (
    <>
      <nav style={{ padding: "12px 18px", borderBottom: "1px solid #ccc", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap", fontFamily: "Franklin Gothic Medium" }}>
        {user && (
          <>
            <Link to="/">
              {t(lang, "posts")}
            </Link>

            <Link to="/my-posts">
              {t(lang, "myPosts")}
            </Link>

            <Link to="/menu">
              {t(lang, "manageMenu")}
            </Link>
          </>
        )}

        {user ? (
          <>
            <Link to="/create">
              {t(lang, "createPost")}
            </Link>

            <span>
              {t(lang, "hello")}, {user.name}!
            </span>

            <button
              onClick={logout}
              style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white" }}
            >
              {t(lang, "logout")}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              {t(lang, "login")}
            </Link>

            <Link to="/register">
              {t(lang, "registration")}
            </Link>
          </>
        )}

        <LanguageSelector lang={lang} setLang={setLang} />
      </nav>

      <main style={{ padding: "25px" }}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Posts user={user} onlyMine={false} lang={lang} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/my-posts"
            element={
              user ? (
                <Posts user={user} onlyMine={true} lang={lang} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Login onLogin={login} lang={lang} />
              )
            }
          />

          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <Register lang={lang} />
              )
            }
          />

          <Route
            path="/posts/:id"
            element={
              user ? (
                <Post user={user} lang={lang} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/edit/:id"
            element={
              user ? (
                <EditPost lang={lang} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/create"
            element={
              user ? (
                <CreatePost lang={lang} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/menu"
            element={
              user ? (
                <MenuManager user={user} lang={lang} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </main>
    </>
  );
}

function Login({ onLogin, lang }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await api.login({
        email,
        password
      });

      if (!data?.user) {
        throw new Error("Invalid response");
      }

      onLogin(data.user);
      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "400px", minHeight: "300px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 28px" }}>
        {t(lang, "loginTitle")}
      </h1>

      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}
      >
        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          type="email"
          placeholder={t(lang, "email")}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          type="password"
          placeholder={t(lang, "password")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: "red", margin: "0" }}>
            {error}
          </p>
        )}

        <button
          style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", marginTop: "5px", background: "#2196f3", color: "white", width: "80px", height: "35px" }}
          disabled={loading}
        >
          {loading ? t(lang, "loading") : t(lang, "login")}
        </button>
      </form>
    </div>
  );
}

function Register({ lang }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async e => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.register(form);
      navigate("/login");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "400px", minHeight: "330px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 28px" }}>
        {t(lang, "registerTitle")}
      </h1>

      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "17px" }}
      >
        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          name="name"
          placeholder={t(lang, "name")}
          value={form.name}
          onChange={change}
          required
        />

        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          name="email"
          type="email"
          placeholder={t(lang, "email")}
          value={form.email}
          onChange={change}
          required
        />

        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          name="password"
          type="password"
          placeholder={t(lang, "password")}
          value={form.password}
          onChange={change}
          required
        />

        {error && (
          <p style={{ color: "red", margin: "0" }}>
            {error}
          </p>
        )}

        <button
          style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", marginTop: "5px", background: "#2196f3", color: "white", width: "105px", height: "35px" }}
          disabled={loading}
        >
          {loading ? t(lang, "loading") : t(lang, "registration")}
        </button>
      </form>
    </div>
  );
}

function Posts({ user, onlyMine = false, lang }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getPosts()
      .then(data => {
        const allPosts = data.posts || [];

        if (onlyMine) {
          const myPosts = allPosts.filter(
            post => Number(post.user_id) === Number(user.id)
          );

          setPosts(myPosts);
        } else {
          setPosts(allPosts);
        }
      })
      .catch(e => setError(e.message));
  }, [user, onlyMine]);

  return (
    <>
      <h1 style={{ fontFamily: "Franklin Gothic Medium", margin: "0 0 25px" }}>
        {onlyMine ? t(lang, "myPosts") : t(lang, "allPosts")}
      </h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "20px", rowGap: "20px", flexWrap: "wrap" }}>
        {posts.map(post => (
          <div
            key={post.id}
            style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "205px", height: "180px", boxSizing: "border-box", overflow: "hidden" }}
          >
            <h2 style={{ margin: "0 0 10px", fontSize: "22px" }}>
              {post.title}
            </h2>

            <p style={{ margin: "7px 0" }}>
              {t(lang, "author")}: {post.author}
            </p>

            <p style={{ margin: "7px 0 16px", overflow: "hidden" }}>
              {post.content?.substring(0, 55)}
              {post.content?.length > 55 ? "..." : ""}
            </p>

            <Link
              to={`/posts/${post.id}`}
              style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", textDecoration: "none", display: "inline-block", background: "white", color: "black" }}
            >
              {t(lang, "readMore")}
            </Link>
          </div>
        ))}
      </div>

      {!posts.length && !error && (
        <p style={{ fontFamily: "Franklin Gothic Medium" }}>
          {onlyMine ? t(lang, "noMyPosts") : t(lang, "noPosts")}
        </p>
      )}
    </>
  );
}

function Post({ user, lang }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getPost(id)
      .then(data => setPost(data.post))
      .catch(e => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <p style={{ color: "red" }}>
        {error}
      </p>
    );
  }

  if (!post) {
    return (
      <p style={{ fontFamily: "Franklin Gothic Medium" }}>
        {t(lang, "loading")}
      </p>
    );
  }

  const owner = user && Number(user.id) === Number(post.user_id);

  const remove = async () => {
    if (!confirm(t(lang, "deletePostConfirm"))) {
      return;
    }

    try {
      await api.deletePost(post.id);
      navigate("/");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "430px", minHeight: "240px", margin: "30px auto", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 18px", fontSize: "30px" }}>
        {post.title}
      </h1>

      <p style={{ margin: "9px 0" }}>
        <b>{t(lang, "author")}:</b> {post.author}
      </p>

      <p style={{ margin: "9px 0" }}>
        <b>{t(lang, "created")}:</b>{" "}
        {post.created_at
          ? new Date(post.created_at).toLocaleDateString()
          : "Unknown"}
      </p>

      <p style={{ margin: "14px 0 20px" }}>
        {post.content}
      </p>

      {owner && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={remove}
            style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white" }}
          >
            {t(lang, "delete")}
          </button>

          <Link
            to={`/edit/${post.id}`}
            style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", textDecoration: "none", display: "inline-block", background: "#2196f3", color: "white" }}
          >
            {t(lang, "edit")}
          </Link>
        </div>
      )}
    </div>
  );
}

function EditPost({ lang }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPost(id)
      .then(data => {
        setTitle(data.post.title);
        setContent(data.post.content);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async e => {
    e.preventDefault();

    setError("");

    try {
      await api.updatePost({
        id: Number(id),
        title,
        content
      });

      navigate(`/posts/${id}`);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <p style={{ fontFamily: "Franklin Gothic Medium" }}>
        {t(lang, "loading")}
      </p>
    );
  }

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "400px", minHeight: "300px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 28px" }}>
        {t(lang, "editPost")}
      </h1>

      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}
      >
        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          placeholder={t(lang, "title")}
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          placeholder={t(lang, "content")}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: "red", margin: "0" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
          <button
            style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", marginTop: "5px", background: "#2196f3", color: "white", width: "80px", height: "35px" }}
          >
            {t(lang, "save")}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", marginTop: "5px", background: "red", color: "white", width: "80px", height: "35px" }}
          >
            {t(lang, "cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}

function CreatePost({ lang }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.createPost({
        title,
        content
      });

      navigate("/");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "rgb(206,236,255)", boxShadow: "4px 4px 10px rgba(0,0,0,.12)", borderRadius: "14px", padding: "20px", fontFamily: "Franklin Gothic Medium", width: "400px", minHeight: "300px", margin: "30px auto", textAlign: "center", boxSizing: "border-box" }}>
      <h1 style={{ margin: "0 0 28px" }}>
        {t(lang, "createPostTitle")}
      </h1>

      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}
      >
        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          placeholder={t(lang, "title")}
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <input
          style={{ width: "220px", height: "38px", padding: "8px 12px", border: "none", borderRadius: "9px", fontFamily: "Franklin Gothic Medium", boxSizing: "border-box", outline: "none" }}
          placeholder={t(lang, "content")}
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: "red", margin: "0" }}>
            {error}
          </p>
        )}

        <button
          style={{ border: "none", borderRadius: "10px", padding: "9px 17px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", marginTop: "5px", background: "#2196f3", color: "white", width: "80px", height: "35px" }}
          disabled={loading}
        >
          {loading ? t(lang, "creating") : t(lang, "create")}
        </button>
      </form>
    </div>
  );
}

export default App;