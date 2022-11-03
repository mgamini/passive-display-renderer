const { writeFile } = require("fs").promises;

require("dotenv").config();
const pug = require("pug");

const data = require("./data");

const print = async () => {
  const fetchedData = await data.fetchAll();
  const html = pug.renderFile("./template.pug", fetchedData);

  console.log(fetchedData);

  await writeFile("./build-local/output.html", html);
};

print();
