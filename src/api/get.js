const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const fetchRender = async (Bucket, Key) => {
  console.log("==> FETCH RENDER");

  const { Body, ContentLength, ContentType, LastModified } = await s3
    .getObject({ Bucket, Key })
    .promise();

  return {
    body: Buffer.from(Body).toString("base64"),
    headers: {
      "Content-Length": ContentLength,
      "Content-Type": ContentType,
      "Last-Modified": LastModified,
    },
  };
};

exports.handler = async function (event, _context) {
  console.log("API EVENT: \n" + JSON.stringify(event, null, 2));

  const { S3_BUCKET } = process.env;

  let response = {};

  try {
    const { body, headers } = await fetchRender(
      S3_BUCKET,
      event.pathParameters.id
    );

    response = {
      statusCode: 200,
      body,
      headers: {
        ...headers,
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: true,
    };
  } catch (e) {
    response = {
      statusCode: 502,
      body: e,
    };
  }

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} \n headers: ${response.headers} \n body: ${response.body}`
  );
  return response;
};
