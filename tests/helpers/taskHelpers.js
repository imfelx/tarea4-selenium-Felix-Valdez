const { By, until } = require("selenium-webdriver");
const { BASE_URL } = require("./driver");

/** Inicia sesión con el usuario válido y espera a llegar a /tasks */
async function login(driver) {
  await driver.get(`${BASE_URL}/login`);
  await driver.findElement(By.id("username")).sendKeys("admin");
  await driver.findElement(By.id("password")).sendKeys("admin123");
  await driver.findElement(By.id("loginBtn")).click();
  await driver.wait(until.elementLocated(By.id("tasksTable")), 5000);
}

/** Crea una tarea desde el formulario visible en /tasks */
async function createTask(driver, title, description = "") {
  const titleInput = await driver.wait(until.elementLocated(By.id("taskTitle")), 5000);
  await titleInput.clear();
  await titleInput.sendKeys(title);
  if (description) {
    const descInput = await driver.findElement(By.id("taskDesc"));
    await descInput.clear();
    await descInput.sendKeys(description);
  }
  await driver.findElement(By.id("saveTaskBtn")).click();
}

/** Busca la fila de una tarea por su título y devuelve su id numérico (o null) */
async function findTaskIdByTitle(driver, title) {
  const rows = await driver.findElements(By.css("#tasksTable tbody tr"));
  for (const row of rows) {
    const cellText = await row.findElement(By.css("td")).getText();
    if (cellText === title) {
      const rowId = await row.getAttribute("id"); // task-row-<id>
      return rowId.replace("task-row-", "");
    }
  }
  return null;
}

module.exports = { login, createTask, findTaskIdByTitle };
