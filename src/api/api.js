const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();

const fetchItems = async (Bucket) => {
  console.log("==> FETCH ITEMS");

  const { Contents } = await s3.listObjectsV2({ Bucket }).promise();

  return Contents.filter(({ Key }) => Key.endsWith(".png")).map(
    ({ Key }) => Key
  );
};

const fetchRender = async (Bucket, Key) => {
  console.log("==> FETCH RENDER");

  const { Body, ContentLength, ContentType, LastModified } = await s3
    .getObject({ Bucket, Key })
    .promise();

  return {
    body: Buffer.from(Body).toString("base64"),
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": ContentLength,
      "Content-Type": ContentType,
      "Last-Modified": LastModified,
    },
    isBase64Encoded: true,
  };
};

const generate = async (FunctionName) => {
  console.log("==> GENERATE");
  const params = {
    FunctionName,
    InvocationType: "Event",
    LogType: "None",
    Payload: "{}",
  };

  const response = await lambda.invoke(params).promise();

  if (response.StatusCode !== 202) {
    throw new Error("Failed to invoke lambda function");
  }

  return { generate: true };
};

exports.handler = async function (event, _context) {
  console.log("API EVENT: \n" + JSON.stringify(event, null, 2));

  const { SNAPSHOT_FUNCTION, S3_BUCKET } = process.env;

  let response = {
    statusCode: 200,
  };

  try {
    switch (event.resource) {
      case "/generate":
        const generateResponse = await generate(SNAPSHOT_FUNCTION);

        response.body = JSON.stringify(generateResponse);
        break;
      case "/get":
        const getResponse = await fetchItems(S3_BUCKET);

        response.body = JSON.stringify(getResponse);
        break;
      case "/get/{id}":
        const imageResponse = await fetchRender(
          S3_BUCKET,
          event.pathParameters.id
        );

        response = {
          ...response,
          ...imageResponse,
        };
        break;
    }
  } catch (e) {
    response.statusCode = 502;
    response.body = e;
  }

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
