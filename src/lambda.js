const AWS = require("aws-sdk");
const chromium = require("@sparticuz/chrome-aws-lambda");
const s3 = new AWS.S3();

const render = require("./render");

const agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

class Snapshot {
  constructor({ secrets, viewport }) {
    this.secrets = secrets;
    this.viewport = viewport;

    this.browser;
    this.logStep = 0;
  }

  log(message) {
    console.log(`${this.logStep}: ${message}`);
  }

  async run() {
    this.browser = await this.launchBrowser();

    const imageUrl = await this.getSecrets(this.secrets)
      .then(this.uploadHtml.bind(this))
      .then(this.screenshotHtml.bind(this))
      .then(this.uploadImage.bind(this));

    await this.closeBrowser();

    return imageUrl;
  }

  async launchBrowser() {
    this.logStep++;
    this.log("launching headless browser...");

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: this.viewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    this.log("browser launched");
    return browser;
  }

  async closeBrowser() {
    if (this.browser !== null) {
      await this.browser.close();
      this.browser = null;

      this.logStep++;
      this.log("browser closed");
    }
  }

  async getSecrets(params) {
    this.logStep++;
    this.log("getting secrets...");

    const secretsFile = await s3.getObject(params).promise();

    const secrets = JSON.parse(secretsFile.Body.toString("utf-8"));
    this.log("secrets loaded");

    return secrets;
  }

  async uploadHtml(secrets) {
    this.logStep++;
    this.log("uploading html...");

    const Body = await render(secrets);
    const { Location } = await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Key: "render.html",
        Body,
        ContentType: "text/html",
        ACL: "public-read",
      })
      .promise();

    this.log("html uploaded. Location:");
    this.log(Location);

    return Location;
  }

  async screenshotHtml(targetUrl) {
    this.logStep++;
    this.log("taking screenshot...");

    const page = await this.browser.newPage();
    await page.setUserAgent(agent);

    await page.goto(targetUrl);
    const buffer = await page.screenshot();

    this.log("screenshot taken. Closing page...");
    await page.close();

    return buffer;
  }

  async uploadImage(Body) {
    this.logStep++;
    this.log("uploading image...");

    const { Location } = await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Key: `render.png`,
        Body,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    this.log("image uploaded");

    return Location;
  }
}

exports.handler = async () => {
  console.log("Running snapshot function");

  const snapshot = new Snapshot({
    secrets: {
      Bucket: process.env.S3_SECRETS_BUCKET,
      Key: process.env.S3_SECRETS_KEY,
    },
    viewport: {
      height: parseInt(process.env.DISPLAY_HEIGHT),
      width: parseInt(process.env.DISPLAY_WIDTH),
    },
  });

  try {
    const imageUrl = await snapshot.run();
    console.log("Success! Image location: ", imageUrl);
  } catch (error) {
    console.log(error);
  } finally {
    await snapshot.closeBrowser();
  }

  return;
};
