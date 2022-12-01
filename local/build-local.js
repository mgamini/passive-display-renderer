const { readFile, writeFile } = require("fs").promises;

const LOCAL_PATH = process.env.npm_package_config_local_path;
const SNAPSHOT_PATH = process.env.npm_package_config_snapshot_path;

const render = require(`../${SNAPSHOT_PATH}/render`);

const print = async () => {
  // in the lambda env, these are set in template.yaml
  const envString = await readFile(`${LOCAL_PATH}/env-local.json`, "utf8");
  const secretsString = await readFile(`${LOCAL_PATH}/secrets.json`, "utf8");

  process.env = {
    ...process.env,
    ...JSON.parse(envString),
    TEMPLATE: `${SNAPSHOT_PATH}/template.pug`,
  };

  const html = await render(JSON.parse(secretsString));

  await writeFile(process.env.LOCAL_BUILD_PATH, html);
};

print();
