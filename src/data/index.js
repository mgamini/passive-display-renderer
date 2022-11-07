const getCalendar = require("./getCalendar");
const getTodos = require("./getTodos");

module.exports = async () => ({
  calendar: await getCalendar(),
  // calendar: [],
  todos: await getTodos(),
});
