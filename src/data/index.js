const getCalendar = require("./getCalendar");
const getTodos = require("./getTodos");
const getShopping = require("./getShopping");

module.exports = async () => ({
  // calendar: await getCalendar(),
  calendar: [],
  // todos: await getTodos(),
  todos: [],
  shoppingList: await getShopping(),
});
