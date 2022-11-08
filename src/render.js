const pug = require("pug");

const fetchData = require("./data");

module.exports = async () => {
  const display = {
    height: process.env.DISPLAY_HEIGHT,
    width: process.env.DISPLAY_WIDTH,
  };
  const data = await fetchData();

  console.log("rendering", display, data);

  return pug.renderFile("./template.pug", { display, data });
};
