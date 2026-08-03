# Tarea 4: Pruebas Automatizadas con Selenium

App CRUD de "Tareas" con login, más una suite de pruebas automatizadas con **Selenium
WebDriver (JavaScript) + Mocha + Chai**, y reporte HTML con capturas de pantalla
(**Mochawesome**).

## 📁 Estructura del proyecto

```
tarea4-selenium/
├── app/                     # Aplicación web (Express + EJS)
│   ├── server.js            # Rutas: login y CRUD de tareas
│   ├── views/                # login.ejs, tasks.ejs
│   └── public/style.css
├── tests/                   # Pruebas Selenium
│   ├── login.test.js         # HU-01
│   ├── tasks.test.js         # HU-02, HU-03, HU-04, HU-05
│   └── helpers/
│       ├── driver.js         # Crea el WebDriver + toma capturas
│       └── taskHelpers.js    # login(), createTask(), findTaskIdByTitle()
├── docs/
│   └── historias-usuario.md  # Las 5 HU listas para copiar a Jira/Azure DevOps
├── reports/                  # Se genera al correr las pruebas (reporte HTML + capturas)
├── package.json
└── .mocharc.json
```

## ✅ Requisitos previos

- Node.js 18+ instalado
- Google Chrome instalado en tu máquina (las pruebas usan `chromedriver`)

## 🚀 Instalación

```bash
npm install
```

Esto instala tanto las dependencias de la app (`express`, `ejs`, `express-session`)
como las de pruebas (`selenium-webdriver`, `chromedriver`, `mocha`, `mochawesome`, `chai`).

## ▶️ Cómo correr la aplicación

En una terminal:

```bash
npm start
```

Abre `http://localhost:3000` — usuario de prueba: **admin** / **admin123**.

## 🧪 Cómo correr las pruebas Selenium

Con la app corriendo (`npm start` en otra terminal), en una segunda terminal:

```bash
npm test
```

- Por defecto corre en modo **headless** (sin abrir ventana de Chrome).
  Para ver el navegador mientras se ejecutan las pruebas:

  ```bash
  # Windows (PowerShell)
  $env:HEADLESS="false"; npm test

  # macOS / Linux
  HEADLESS=false npm test
  ```

- Al terminar, se genera:
  - `reports/reporte-pruebas.html` → reporte HTML navegable con el resultado de cada
    caso de prueba.
  - `reports/screenshots/` → una captura de pantalla por cada prueba ejecutada,
    embebida también dentro del reporte HTML.

Abre `reports/reporte-pruebas.html` en el navegador para ver el resultado.

## 🧩 Cobertura de pruebas

| Historia de Usuario | Archivo | Casos |
|---|---|---|
| HU-01 Inicio de sesión | `tests/login.test.js` | Camino feliz, negativa, límite |
| HU-02 Crear tarea | `tests/tasks.test.js` | Camino feliz, negativa, límite |
| HU-03 Listar tareas | `tests/tasks.test.js` | Camino feliz, negativa, límite |
| HU-04 Actualizar tarea | `tests/tasks.test.js` | Camino feliz, negativa, límite |
| HU-05 Eliminar tarea | `tests/tasks.test.js` | Camino feliz, negativa, límite |

Ver el detalle de cada historia (criterios de aceptación/rechazo) en
[`docs/historias-usuario.md`](docs/historias-usuario.md).

## 📦 Pasos para completar la entrega (checklist según la rúbrica)

1. **Repositorio en GitHub**
   - Crea un repositorio **público** (o con acceso otorgado al profesor/monitor).
   - `git init && git add . && git commit -m "Tarea 4: app + pruebas Selenium"`
   - `git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git`
   - `git push -u origin main`
   - Verifica que el enlace sea accesible sin iniciar sesión.

2. **Tablero de Jira o Azure DevOps**
   - Crea un proyecto nuevo.
   - Copia las 5 historias de `docs/historias-usuario.md` como *User Stories / Issues*,
     con sus criterios de aceptación y rechazo en la descripción.
   - Da acceso público (Jira: "Share" → enlace público / Azure DevOps: configurar el
     proyecto como público en Project Settings → General).

3. **Reporte HTML + capturas**
   - Ejecuta `npm test` y confirma que `reports/reporte-pruebas.html` se generó con
     las capturas embebidas.
   - Sube esa carpeta `reports/` como parte del commit en GitHub (o adjunta el reporte
     tal como pida tu profesor).

4. **Video demostrativo**
   - Graba tu pantalla ejecutando `HEADLESS=false npm test` para que se vea el
     navegador realizando cada acción (login, crear, editar, eliminar).
   - Muestra también brevemente el reporte HTML generado y el tablero de Jira/Azure DevOps.
   - Sube el video a **YouTube (público/no listado) o OneDrive** con enlace abierto.
     (No se acepta Google Drive ni archivos adjuntos.)

5. **Entrega en la plataforma**
   - En el campo "Texto en línea", pega los 3 enlaces:
     - Repositorio de GitHub
     - Tablero de Jira/Azure DevOps
     - Video demostrativo

## ⚠️ Notas importantes

- **No se usó Selenium IDE** — todas las pruebas están escritas en código
  (`selenium-webdriver` + Mocha), tal como exige la tarea.
- Verifica antes de entregar que los tres enlaces sean de acceso público; si el
  profesor/monitor no puede acceder, la calificación es 0 según la rúbrica.
- No se permiten modificaciones después de la fecha de entrega.
