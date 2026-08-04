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
  return driver.wait(async () => {
    return driver.executeScript(
      (searchTitle) => {
        const rows = Array.from(document.querySelectorAll("#tasksTable tbody tr"));
        const matchedRow = rows.find((row) => {
          const firstCell = row.querySelector("td");
          return firstCell && firstCell.textContent.trim() === searchTitle;
        });

        if (!matchedRow) {
          return null;
        }

        return matchedRow.id.replace("task-row-", "");
      },
      title
    );
  }, 5000, `No se encontró la tarea ${title}`);
}

module.exports = { login, createTask, findTaskIdByTitle };
