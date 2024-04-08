import puppeteer from "puppeteer";
import dotenv from "dotenv";

import { uploadFile } from "./flightData.js";
import { encode } from "base64-arraybuffer";
dotenv.config("./.env");
let num = 1;

const clip = {
  x: 0,
  y: 0,
  width: 1000,
  height: 1000,
};

const options = {
  args: [
    "--disable-setuid-sandbox",
    "--no-sandbox",
    "--single-process",
    "--no-zygote",
  ],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
};
async function Screenshot(supabase) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto("https://frontend-iota-sandy-95.vercel.app/");

  // Set screen size
  await page.setViewport({ width: 1920, height: 1080 });

  const imageData = await page.screenshot({
    type: "jpeg",
    quality: 100,
    clip: clip,
  });

  await browser.close();

  const file = imageData.toString("base64");
  uploadFile(file);

  console.log("Screenshot taken.");
}

export default Screenshot;
