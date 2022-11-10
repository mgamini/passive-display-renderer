const { readFile, writeFile } = require("fs").promises;

const render = require("../src/snapshot/render");

const print = async () => {
  // in the lambda env, these are set in template.yaml
  const envString = await readFile("./env-local.json", "utf8");
  const secretsString = await readFile("./secrets.json", "utf8");

  process.env = {
    ...process.env,
    ...JSON.parse(envString),
    TEMPLATE: "../src/snapshot/template.pug",
  };

  const html = await render(JSON.parse(secretsString));

  await writeFile(process.env.LOCAL_BUILD_PATH, html);
};

print();
