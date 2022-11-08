const pug = require("pug");

const fetchData = require("./data");

module.exports = async (secrets) => {
  const data = await fetchData(secrets);
  const display = {
    height: process.env.DISPLAY_HEIGHT,
    width: process.env.DISPLAY_WIDTH,
  };

  console.log("rendering", display, data);

  return pug.renderFile("./template.pug", { display, data });
};
