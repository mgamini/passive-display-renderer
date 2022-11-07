const getCalendar = require("./getCalendar");

module.exports = async () => ({
  calendar: await getCalendar(),
});
