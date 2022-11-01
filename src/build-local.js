const { writeFile } = require("fs").promises;

const pug = require("pug");

const data = require("./data");

const print = async () => {
  const html = pug.renderFile("./template.pug", data);

  await writeFile("./build-local/output.html", html);
};

print();
