const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Configuración ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "tarea4-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// ---------- "Base de datos" en memoria ----------
const USUARIO_VALIDO = { username: "admin", password: "admin123" };
const MAX_TITULO = 50; // límite usado en pruebas de límite

let tasks = [
  { id: 1, title: "Comprar materiales", description: "Para el laboratorio de BD", done: false },
  { id: 2, title: "Estudiar Selenium", description: "Repasar locators y esperas explícitas", done: false },
];
let nextId = 3;

// ---------- Middleware de autenticación ----------
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  return res.redirect("/login");
}

// ---------- Rutas: Login ----------
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => {
  if (req.session.loggedIn) return res.redirect("/tasks");
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).render("login", { error: "El usuario y la contraseña son obligatorios." });
  }

  if (username === USUARIO_VALIDO.username && password === USUARIO_VALIDO.password) {
    req.session.loggedIn = true;
    req.session.username = username;
    return res.redirect("/tasks");
  }

  return res.status(401).render("login", { error: "Usuario o contraseña incorrectos." });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// ---------- Rutas: CRUD de Tareas ----------
app.get("/tasks", requireLogin, (req, res) => {
  res.render("tasks", { tasks, error: null, success: null, editTask: null, maxTitulo: MAX_TITULO });
});

// Crear
app.post("/tasks", requireLogin, (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).render("tasks", {
      tasks, error: "El título es obligatorio.", success: null, editTask: null, maxTitulo: MAX_TITULO,
    });
  }

  if (title.length > MAX_TITULO) {
    return res.status(400).render("tasks", {
      tasks, error: `El título no puede superar ${MAX_TITULO} caracteres.`, success: null, editTask: null, maxTitulo: MAX_TITULO,
    });
  }

  tasks.push({ id: nextId++, title: title.trim(), description: (description || "").trim(), done: false });
  res.render("tasks", { tasks, error: null, success: "Tarea creada correctamente.", editTask: null, maxTitulo: MAX_TITULO });
});

// Formulario de edición
app.get("/tasks/:id/edit", requireLogin, (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  if (!task) {
    return res.status(404).render("tasks", { tasks, error: "Tarea no encontrada.", success: null, editTask: null, maxTitulo: MAX_TITULO });
  }
  res.render("tasks", { tasks, error: null, success: null, editTask: task, maxTitulo: MAX_TITULO });
});

// Actualizar
app.post("/tasks/:id", requireLogin, (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id, 10));
  const { title, description } = req.body;

  if (!task) {
    return res.status(404).render("tasks", { tasks, error: "Tarea no encontrada.", success: null, editTask: null, maxTitulo: MAX_TITULO });
  }
  if (!title || title.trim() === "") {
    return res.status(400).render("tasks", { tasks, error: "El título es obligatorio.", success: null, editTask: task, maxTitulo: MAX_TITULO });
  }
  if (title.length > MAX_TITULO) {
    return res.status(400).render("tasks", {
      tasks, error: `El título no puede superar ${MAX_TITULO} caracteres.`, success: null, editTask: task, maxTitulo: MAX_TITULO,
    });
  }

  task.title = title.trim();
  task.description = (description || "").trim();
  res.render("tasks", { tasks, error: null, success: "Tarea actualizada correctamente.", editTask: null, maxTitulo: MAX_TITULO });
});

// Eliminar
app.post("/tasks/:id/delete", requireLogin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const exists = tasks.some((t) => t.id === id);
  tasks = tasks.filter((t) => t.id !== id);

  if (!exists) {
    return res.status(404).render("tasks", { tasks, error: "Tarea no encontrada.", success: null, editTask: null, maxTitulo: MAX_TITULO });
  }
  res.render("tasks", { tasks, error: null, success: "Tarea eliminada correctamente.", editTask: null, maxTitulo: MAX_TITULO });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports = app;
