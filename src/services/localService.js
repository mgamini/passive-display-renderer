const { readFile, writeFile } = require("fs").promises;

// const SECRETS_PATH = process.env.npm_package_config_secrets_path;

const localService = {};

// localService.readSecrets = async () => {
//   return await localService.JSONRead()
// };

// localService.writeSecrets = async (secrets) => {
//   await writeFile(SECRETS_PATH, JSON.stringify(secrets));

//   return true;
// };

localService.JSONRead = async (path) => {
  const fileString = await readFile(path, "utf8");

  return JSON.parse(fileString);
};

localService.JSONWrite = async (path, data) => {
  await writeFile(path, JSON.stringify(data));

  return true;
};

module.exports = localService;
