require("dotenv").config();
const { writeFile } = require("fs").promises;

const render = require("./render");

const print = async () => {
  const html = await render();

  await writeFile("./build-local/output.html", html);
};

print();
