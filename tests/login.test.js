const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const addContext = require("mochawesome/addContext");
const { buildDriver, BASE_URL, takeScreenshot } = require("./helpers/driver");

/**
 * HU-01: Como usuario registrado quiero iniciar sesión con mis credenciales
 * para acceder al sistema de gestión de tareas.
 */
describe("HU-01: Inicio de sesión (Login)", function () {
  let driver;

  beforeEach(async function () {
    driver = await buildDriver();
    await driver.get(`${BASE_URL}/login`);
  });

  afterEach(async function () {
    if (driver) {
      const shot = await takeScreenshot(driver, this.currentTest.title);
      addContext(this, shot);
      await driver.quit();
    }
  });

  it("[Camino feliz] permite iniciar sesión con credenciales válidas", async function () {
    await driver.findElement(By.id("username")).sendKeys("admin");
    await driver.findElement(By.id("password")).sendKeys("admin123");
    await driver.findElement(By.id("loginBtn")).click();

    await driver.wait(until.elementLocated(By.id("tasksTable")), 5000);
    const heading = await driver.findElement(By.css("h1")).getText();
    expect(heading).to.equal("Mis Tareas");
  });

  it("[Prueba negativa] rechaza el acceso con contraseña incorrecta", async function () {
    await driver.findElement(By.id("username")).sendKeys("admin");
    await driver.findElement(By.id("password")).sendKeys("password-incorrecta");
    await driver.findElement(By.id("loginBtn")).click();

    const errorEl = await driver.wait(until.elementLocated(By.id("loginError")), 5000);
    const text = await errorEl.getText();
    expect(text).to.include("incorrectos");
  });

  it("[Prueba de límites] no permite enviar el formulario con campos vacíos", async function () {
    await driver.findElement(By.id("loginBtn")).click();

    const errorEl = await driver.wait(until.elementLocated(By.id("loginError")), 5000);
    const text = await errorEl.getText();
    expect(text).to.include("obligatorios");
  });
});
