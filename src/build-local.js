const { readFile, writeFile } = require("fs").promises;

const render = require("./render");

const print = async () => {
  const envString = await readFile("./env-local.json", "utf8");
  const secretsString = await readFile("./secrets.json", "utf8");

  process.env = {
    ...process.env,
    ...JSON.parse(envString),
  };

  const html = await render(JSON.parse(secretsString));

  await writeFile(process.env.LOCAL_BUILD_PATH, html);
};

print();
