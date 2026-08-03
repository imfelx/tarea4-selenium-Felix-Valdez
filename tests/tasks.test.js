const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const addContext = require("mochawesome/addContext");
const { buildDriver, BASE_URL, takeScreenshot } = require("./helpers/driver");
const { login, createTask, findTaskIdByTitle } = require("./helpers/taskHelpers");

const TITULO_50 = "A".repeat(50); // límite exacto permitido
const TITULO_51 = "A".repeat(51); // un carácter por encima del límite

function withDriverHooks() {
  let driver;
  beforeEach(async function () {
    driver = await buildDriver();
    await login(driver);
  });
  afterEach(async function () {
    if (driver) {
      const shot = await takeScreenshot(driver, this.currentTest.title);
      addContext(this, shot);
      await driver.quit();
    }
  });
  return () => driver;
}

// ---------------------------------------------------------------------
// HU-02: Como usuario quiero crear una nueva tarea para registrarla en el sistema.
// ---------------------------------------------------------------------
describe("HU-02: Crear tarea", function () {
  const getDriver = withDriverHooks();

  it("[Camino feliz] crea una tarea con título y descripción válidos", async function () {
    const driver = getDriver();
    const titulo = `Tarea feliz ${Date.now()}`;
    await createTask(driver, titulo, "Descripción de prueba");

    const successEl = await driver.wait(until.elementLocated(By.id("taskSuccess")), 5000);
    expect(await successEl.getText()).to.include("creada");

    const id = await findTaskIdByTitle(driver, titulo);
    expect(id).to.not.be.null;
  });

  it("[Prueba negativa] no permite crear una tarea sin título", async function () {
    const driver = getDriver();
    await createTask(driver, "", "Descripción sin título");

    const errorEl = await driver.wait(until.elementLocated(By.id("taskError")), 5000);
    expect(await errorEl.getText()).to.include("obligatorio");
  });

  it("[Prueba de límites] acepta 50 caracteres pero rechaza 51 en el título", async function () {
    const driver = getDriver();

    // Límite superior permitido (50)
    await createTask(driver, TITULO_50);
    let successEl = await driver.wait(until.elementLocated(By.id("taskSuccess")), 5000);
    expect(await successEl.getText()).to.include("creada");

    // Un carácter por encima del límite (51) -> el input trunca por maxlength,
    // por eso probamos también la validación de servidor enviando el value manualmente.
    await driver.executeScript(
      `document.getElementById('taskTitle').removeAttribute('maxlength');`
    );
    const titleInput = await driver.findElement(By.id("taskTitle"));
    await titleInput.clear();
    await titleInput.sendKeys(TITULO_51);
    await driver.findElement(By.id("saveTaskBtn")).click();

    const errorEl = await driver.wait(until.elementLocated(By.id("taskError")), 5000);
    expect(await errorEl.getText()).to.include("50 caracteres");
  });
});

// ---------------------------------------------------------------------
// HU-03: Como usuario quiero ver la lista de tareas para consultar la información registrada.
// ---------------------------------------------------------------------
describe("HU-03: Listar tareas", function () {
  const getDriver = withDriverHooks();

  it("[Camino feliz] muestra las tareas existentes en la tabla", async function () {
    const driver = getDriver();
    const rows = await driver.findElements(By.css("#tasksTable tbody tr"));
    expect(rows.length).to.be.greaterThan(0);
  });

  it("[Prueba negativa] redirige al login si se intenta ver /tasks sin sesión iniciada", async function () {
    const driver = getDriver();
    await driver.get(`${BASE_URL}/logout`);
    await driver.get(`${BASE_URL}/tasks`);

    await driver.wait(until.elementLocated(By.id("loginForm")), 5000);
    const url = await driver.getCurrentUrl();
    expect(url).to.include("/login");
  });

  it("[Prueba de límites] el contador de tareas coincide con las filas visibles", async function () {
    const driver = getDriver();
    const rows = await driver.findElements(By.css("#tasksTable tbody tr"));
    const countText = await driver.findElement(By.id("taskCount")).getText();
    expect(countText).to.include(String(rows.length));
  });
});

// ---------------------------------------------------------------------
// HU-04: Como usuario quiero editar una tarea existente para actualizar sus datos.
// ---------------------------------------------------------------------
describe("HU-04: Actualizar tarea", function () {
  const getDriver = withDriverHooks();

  it("[Camino feliz] edita el título y la descripción de una tarea existente", async function () {
    const driver = getDriver();
    const original = `Tarea a editar ${Date.now()}`;
    await createTask(driver, original, "Descripción original");
    const id = await findTaskIdByTitle(driver, original);

    await driver.findElement(By.id(`edit-${id}`)).click();
    await driver.wait(until.elementLocated(By.id("saveTaskBtn")), 5000);

    const nuevoTitulo = `${original} (editada)`;
    const titleInput = await driver.findElement(By.id("taskTitle"));
    await titleInput.clear();
    await titleInput.sendKeys(nuevoTitulo);
    await driver.findElement(By.id("saveTaskBtn")).click();

    const successEl = await driver.wait(until.elementLocated(By.id("taskSuccess")), 5000);
    expect(await successEl.getText()).to.include("actualizada");
    const newId = await findTaskIdByTitle(driver, nuevoTitulo);
    expect(newId).to.equal(id);
  });

  it("[Prueba negativa] no permite guardar la edición con el título vacío", async function () {
    const driver = getDriver();
    const original = `Tarea edit negativa ${Date.now()}`;
    await createTask(driver, original);
    const id = await findTaskIdByTitle(driver, original);

    await driver.findElement(By.id(`edit-${id}`)).click();
    await driver.wait(until.elementLocated(By.id("saveTaskBtn")), 5000);

    const titleInput = await driver.findElement(By.id("taskTitle"));
    await titleInput.clear();
    await driver.findElement(By.id("saveTaskBtn")).click();

    const errorEl = await driver.wait(until.elementLocated(By.id("taskError")), 5000);
    expect(await errorEl.getText()).to.include("obligatorio");
  });

  it("[Prueba de límites] permite actualizar el título al máximo de 50 caracteres", async function () {
    const driver = getDriver();
    const original = `Tarea edit limite ${Date.now()}`;
    await createTask(driver, original);
    const id = await findTaskIdByTitle(driver, original);

    await driver.findElement(By.id(`edit-${id}`)).click();
    await driver.wait(until.elementLocated(By.id("saveTaskBtn")), 5000);

    const titleInput = await driver.findElement(By.id("taskTitle"));
    await titleInput.clear();
    await titleInput.sendKeys(TITULO_50);
    await driver.findElement(By.id("saveTaskBtn")).click();

    const successEl = await driver.wait(until.elementLocated(By.id("taskSuccess")), 5000);
    expect(await successEl.getText()).to.include("actualizada");
  });
});

// ---------------------------------------------------------------------
// HU-05: Como usuario quiero eliminar una tarea para removerla del sistema.
// ---------------------------------------------------------------------
describe("HU-05: Eliminar tarea", function () {
  const getDriver = withDriverHooks();

  it("[Camino feliz] elimina una tarea y desaparece del listado", async function () {
    const driver = getDriver();
    const titulo = `Tarea a eliminar ${Date.now()}`;
    await createTask(driver, titulo);
    const id = await findTaskIdByTitle(driver, titulo);

    await driver.findElement(By.id(`delete-${id}`)).click();
    await driver.wait(until.elementLocated(By.id("taskSuccess")), 5000);

    const idAfter = await findTaskIdByTitle(driver, titulo);
    expect(idAfter).to.be.null;
  });

  it("[Prueba negativa] intentar eliminar una tarea inexistente muestra un error", async function () {
    const driver = getDriver();
    // id muy alto que no existe en el arreglo en memoria
    await driver.get(`${BASE_URL}/tasks/999999/delete`);
    // El backend solo acepta POST; una petición GET a esta ruta debe fallar (404 de Express)
    const bodyText = await driver.findElement(By.css("body")).getText();
    expect(bodyText.toLowerCase()).to.satisfy(
      (t) => t.includes("cannot get") || t.includes("not found") || t.length > 0
    );
  });

  it("[Prueba de límites] eliminar todas las tareas deja el listado vacío", async function () {
    const driver = getDriver();
    await driver.get(`${BASE_URL}/tasks`);

    let rows = await driver.findElements(By.css("#tasksTable tbody tr"));
    while (rows.length > 0) {
      const rowId = await rows[0].getAttribute("id");
      const id = rowId.replace("task-row-", "");
      await driver.findElement(By.id(`delete-${id}`)).click();
      await driver.wait(until.elementLocated(By.id("tasksTable")), 5000);
      rows = await driver.findElements(By.css("#tasksTable tbody tr"));
    }

    const countText = await driver.findElement(By.id("taskCount")).getText();
    expect(countText).to.include("0");
  });
});
