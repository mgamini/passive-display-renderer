const { notionService } = require("../services");
const { time } = require("../util");

class ShoppingItem {
  constructor({ properties }) {
    this.name = properties.Item.title[0].plain_text;
    this.quantity = properties.Qty.number;
  }
}

module.exports = async () => {
  const shoppingList = await notionService.getShopping();

  return shoppingList.map((item) => new ShoppingItem(item));
};
