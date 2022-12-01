const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const fetchItems = async (Bucket) => {
  console.log("==> FETCH ITEMS");

  const { Contents } = await s3.listObjectsV2({ Bucket }).promise();

  return Contents.filter(({ Key }) => Key.endsWith(".png")).map(
    ({ Key }) => Key
  );
};

exports.handler = async function (event, _context) {
  console.log("API EVENT: \n" + JSON.stringify(event, null, 2));

  const { S3_BUCKET } = process.env;

  let response;

  try {
    const body = await fetchItems(S3_BUCKET);
    response = {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (e) {
    response = {
      statusCode: 502,
      body: JSON.stringify(e),
    };
  }

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
