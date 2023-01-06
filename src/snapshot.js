const puppeteer = require("puppeteer");

const { gcpService } = require("./services");
const render = require("./render");

const PUPPETEER_OPTIONS = {
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    // "--timeout=30000",
    "--no-first-run",
    "--no-sandbox",
    "--no-zygote",
    "--single-process",
    "--proxy-server='direct://'",
    "--proxy-bypass-list=*",
    "--deterministic-fetch",
  ],
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

class Snapshot {
  constructor({ secrets, viewport, bucketName }) {
    this.secrets = secrets;
    this.viewport = viewport;

    this.browser;
    this.bucket = new gcpService.Bucket(bucketName);
    this.logStep = 0;
  }

  log(msg) {
    console.log(`PDR Snapshot ${this.logStep}: ${msg}`);
    this.logStep++;
  }

  async run() {
    this.browser = await this.launchBrowser();
    this.log("browser run initiated");
    await this.bucket.init();
    this.log("bucket initiated");

    const imageUrl = await this.renderPage(this.secrets)
      .then(this.uploadPage.bind(this))
      .then(this.screenshotPage.bind(this))
      .then(this.uploadScreenshot.bind(this));

    await this.closeBrowser();

    return imageUrl;
  }

  async launchBrowser() {
    const browser = await puppeteer.launch({
      ...PUPPETEER_OPTIONS,
      defaultViewport: this.viewport,
    });

    this.log("browser launched");

    return browser;
  }

  async closeBrowser() {
    if (this.browser !== null) {
      await this.browser.close();
      this.browser = null;

      this.log("browser closed");
    }
  }

  async renderPage(secrets) {
    const page = await render(secrets);

    this.log("page rendered");
    return page;
  }

  async uploadPage(page) {
    const pageUrl = await this.bucket.createFile("render.html", page);

    this.log("page uploaded");
    return pageUrl;
  }

  async screenshotPage(pageUrl) {
    const page = await this.browser.newPage();
    await page.setUserAgent(USER_AGENT);

    await page.goto(pageUrl);
    const buffer = await page.screenshot();

    await page.close();

    this.log("page screenshotted");
    return buffer;
  }

  async uploadScreenshot(buffer) {
    const imgUrl = await this.bucket.createFile("render.png", buffer);

    this.log("screenshot uploaded");
    return imgUrl;
  }
}

module.exports = Snapshot;
