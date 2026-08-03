const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SCREENSHOT_DIR = path.join(__dirname, "..", "..", "reports", "screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

/**
 * Crea un WebDriver de Chrome.
 * Por defecto corre en modo headless (sin interfaz) para poder ejecutarse
 * en CI o en máquinas sin escritorio. Para verlo en pantalla, exporta
 * HEADLESS=false antes de correr las pruebas.
 */
async function buildDriver() {
  const options = new chrome.Options();
  if (process.env.HEADLESS !== "false") {
    options.addArguments("--headless=new");
  }
  options.addArguments("--window-size=1280,900");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  return driver;
}

/**
 * Toma una captura de pantalla y la guarda en reports/screenshots.
 * Devuelve la ruta relativa para adjuntarla al reporte HTML (mochawesome).
 */
async function takeScreenshot(driver, name) {
  const safeName = name.replace(/[^a-z0-9-_]/gi, "_");
  const fileName = `${Date.now()}_${safeName}.png`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);
  const image = await driver.takeScreenshot();
  fs.writeFileSync(filePath, image, "base64");
  return path.join("screenshots", fileName); // ruta relativa a /reports
}

module.exports = { buildDriver, BASE_URL, takeScreenshot };
