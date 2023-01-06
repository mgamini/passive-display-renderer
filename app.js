const functions = require("@google-cloud/functions-framework");

const { localService } = require("./src/services");
const Snapshot = require("./src/snapshot");

const SECRETS_PATH = "./secrets.json";
const ENV_PATH = "./env.json";

const loadEnv = async () => {
  const env = await localService.JSONRead(ENV_PATH);
  process.env = {
    ...process.env,
    ...env,
  };
};

const getRenderBucketName = async (secrets) => {
  let { RENDER_BUCKET_NAME } = secrets;

  if (!RENDER_BUCKET_NAME) {
    RENDER_BUCKET_NAME = `pdr-renders-${Date.now()}`;

    await localService.JSONWrite(SECRETS_PATH, {
      ...secrets,
      RENDER_BUCKET_NAME,
    });
  }

  return RENDER_BUCKET_NAME;
};

functions.http("generate", async (req, res) => {
  console.log("PDR: Received generate call");
  console.log(
    "PDR: env vars",
    SECRETS_PATH,
    ENV_PATH,
    JSON.stringify(process.env)
  );

  try {
    await loadEnv();

    console.log("PDR: env loaded");
    const secrets = await localService.JSONRead(SECRETS_PATH);
    const bucketName = await getRenderBucketName(secrets);

    console.log("PDR: secrets & bucket loaded");
    const snapshot = new Snapshot({
      secrets,
      viewport: {
        height: parseInt(process.env.DISPLAY_HEIGHT),
        width: parseInt(process.env.DISPLAY_WIDTH),
      },
      bucketName,
    });
    console.log("PDR: snapshot class instanced");
    const imageUrl = await snapshot.run();

    console.log(`PDR: snapshot run. Url: ${imageUrl}`);

    res.send(`generate result: ${JSON.stringify(imageUrl)}`);
  } catch (e) {
    console.log(`PDR: error: ${e}`);
  }
});

// functions.http("helloGET", async (req, res) => {
//   const bucket = new gcpService.Bucket("pdr-renders-1670112775820");
//   bucket.init();

//   res.send(`Hello World! Bucket: ${JSON.stringify(bucket)}`);
// });
