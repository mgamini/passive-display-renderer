const { appendFile } = require("fs").promises;
const time = require("./time");

const DEBUG_FILE_PATH = "./build-local/debug.js";
const debug = {};

debug.print = async (obj, location = DEBUG_FILE_PATH) =>
  await appendFile(location, "===\n" + JSON.stringify(obj) + "\n");

module.exports = {
  time,
  debug,
};
