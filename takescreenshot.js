import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config("./env");
let num = 1;

const clip = {
  x: 0,
  y: 0,
  width: 1000,
  height: 1000,
};
async function Screenshot() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://frontend-qzefdfpq4-yesilius-projects.vercel.app/");

  // Set screen size
  await page.setViewport({ width: 1920, height: 1080 });
  await page.waitForNavigation({
    waitUntil: "networkidle2",
  });
  await page.screenshot({
    path: `./images/screenshot-1.jpg`,
    type: "jpeg",
    quality: 100,
    clip: clip,
  });
  await browser.close();
  console.log("Screenshot taken.");
}

export default Screenshot;
