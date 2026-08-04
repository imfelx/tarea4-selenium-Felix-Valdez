# Historias de Usuario — Tarea 4: Pruebas Automatizadas con Selenium


## HU-01 — Inicio de sesión

**Como** usuario del sistema
**quiero** iniciar sesión con mi usuario y contraseña
**para** acceder al módulo de gestión de tareas.

**Criterios de aceptación**
- Dado que el usuario ingresa un usuario y contraseña válidos, cuando presiona "Entrar", entonces
  es redirigido a la pantalla de "Mis Tareas".
- Dado que el usuario deja los campos usuario/contraseña vacíos, cuando presiona "Entrar", entonces
  el sistema muestra el mensaje "El usuario y la contraseña son obligatorios."

**Criterios de rechazo**
- Si el usuario ingresa una contraseña incorrecta, el sistema debe mostrar el mensaje
  "Usuario o contraseña incorrectos." y no debe otorgar acceso a `/tasks`.
- Si no hay sesión iniciada, cualquier intento de acceder directamente a `/tasks` debe
  redirigir al formulario de login.

**Pruebas automatizadas relacionadas:** `tests/login.test.js`
(camino feliz, prueba negativa, prueba de límites)

---

## HU-02 — Crear tarea

**Como** usuario autenticado
**quiero** crear una nueva tarea con título y descripción
**para** registrarla en el sistema.

**Criterios de aceptación**
- Dado un título válido (1–50 caracteres), cuando el usuario presiona "Agregar", entonces la
  tarea aparece en el listado y se muestra el mensaje "Tarea creada correctamente."

**Criterios de rechazo**
- Si el título está vacío, el sistema debe mostrar "El título es obligatorio." y no debe
  crear la tarea.
- Si el título supera los 50 caracteres, el sistema debe mostrar "El título no puede superar
  50 caracteres." y no debe crear la tarea.

**Pruebas automatizadas relacionadas:** `tests/tasks.test.js → HU-02`
(camino feliz, prueba negativa, prueba de límites: 50 vs. 51 caracteres)

---

## HU-03 — Listar tareas

**Como** usuario autenticado
**quiero** ver el listado de todas mis tareas
**para** consultar la información registrada.

**Criterios de aceptación**
- Dado que existen tareas registradas, cuando el usuario entra a "Mis Tareas", entonces se
  muestran todas en la tabla y el contador "Total de tareas" coincide con la cantidad real.

**Criterios de rechazo**
- Un usuario sin sesión iniciada no debe poder ver el listado; debe ser redirigido al login.

**Pruebas automatizadas relacionadas:** `tests/tasks.test.js → HU-03`
(camino feliz, prueba negativa: acceso sin sesión, prueba de límites: conteo exacto)

---

## HU-04 — Actualizar tarea

**Como** usuario autenticado
**quiero** editar una tarea existente
**para** actualizar su título o descripción.

**Criterios de aceptación**
- Dado un título válido, cuando el usuario edita una tarea y presiona "Actualizar", entonces
  los cambios se reflejan en el listado y se muestra "Tarea actualizada correctamente."

**Criterios de rechazo**
- Si el usuario intenta guardar la edición con el título vacío, el sistema debe mostrar
  "El título es obligatorio." y no debe modificar la tarea.
- Si el nuevo título supera los 50 caracteres, el sistema debe rechazar el cambio.

**Pruebas automatizadas relacionadas:** `tests/tasks.test.js → HU-04`
(camino feliz, prueba negativa, prueba de límites: 50 caracteres exactos)

---

## HU-05 — Eliminar tarea

**Como** usuario autenticado
**quiero** eliminar una tarea existente
**para** removerla del sistema cuando ya no la necesite.

**Criterios de aceptación**
- Dado que el usuario presiona "Eliminar" sobre una tarea, entonces esta desaparece del
  listado y se muestra "Tarea eliminada correctamente."

**Criterios de rechazo**
- Si se intenta eliminar una tarea que ya no existe (id inválido), el sistema debe responder
  con un error y no debe afectar otras tareas.

**Pruebas automatizadas relacionadas:** `tests/tasks.test.js → HU-05`
(camino feliz, prueba negativa: id inexistente, prueba de límites: listado vacío tras
 eliminar todas las tareas)

---

## Resumen para el tablero

| # | Historia | Prioridad | Pruebas asociadas |
|---|----------|-----------|--------------------|
| HU-01 | Inicio de sesión | Alta | 3 (feliz / negativa / límite) |
| HU-02 | Crear tarea | Alta | 3 (feliz / negativa / límite) |
| HU-03 | Listar tareas | Media | 3 (feliz / negativa / límite) |
| HU-04 | Actualizar tarea | Alta | 3 (feliz / negativa / límite) |
| HU-05 | Eliminar tarea | Alta | 3 (feliz / negativa / límite) |

**Total: 5 historias de usuario, 15 casos de prueba automatizados.**
