const { appendFile } = require("fs").promises;
const time = require("./time");

const debug = {};

debug.print = async (obj, location = process.env.DEBUG_FILE_PATH) =>
  await appendFile(location, "===\n" + JSON.stringify(obj) + "\n");

module.exports = {
  time,
  debug,
};
