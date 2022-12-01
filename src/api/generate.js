const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();

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

  const { SNAPSHOT_FUNCTION } = process.env;
  let response;

  try {
    const body = await generate(SNAPSHOT_FUNCTION);

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
