const getCalendar = require("./getCalendar");
const getTodos = require("./getTodos");
const getShopping = require("./getShopping");

module.exports = async (secrets) => ({
  calendar: await getCalendar(secrets),
  todos: await getTodos(secrets),
  shoppingList: await getShopping(secrets),
});
