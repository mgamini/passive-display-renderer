// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require("aws-sdk");
const chromium = require("@sparticuz/chrome-aws-lambda");
const s3 = new AWS.S3();

const pageURL = process.env.TARGET_URL;
const agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

exports.handler = async (event, context) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();
    await page.setUserAgent(agent);

    console.log("Navigating to page: ", pageURL);

    await page.goto(pageURL);
    const buffer = await page.screenshot();
    result = await page.title();

    // upload the image using the current timestamp as filename
    const s3result = await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Key: `${Date.now()}.png`,
        Body: buffer,
        ContentType: "image/png",
        ACL: "public-read",
      })
      .promise();

    console.log("S3 image URL:", s3result.Location);

    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return result;
};

// let response;

// /**
//  *
//  * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
//  * @param {Object} event - API Gateway Lambda Proxy Input Format
//  *
//  * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
//  * @param {Object} context
//  *
//  * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
//  * @returns {Object} object - API Gateway Lambda Proxy Output Format
//  *
//  */
// exports.lambdaHandler = async (event, context) => {
//   try {
//     // const ret = await axios(url);
//     response = {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: "hello world",
//         // location: ret.data.trim()
//       }),
//     };
//   } catch (err) {
//     console.log(err);
//     return err;
//   }

//   return response;
// };

// exports.handler = async (event, context) => {
//   console.log("=== automated run");
//   console.log(event);
//   console.log("===");
//   console.log(context);
//   console.log("===");
//   console.log(arguments);
// };
