const { NotionService } = require("../services");

class ShoppingItem {
  constructor({ properties }) {
    this.name = properties.Item.title[0].plain_text;
    this.quantity = properties.Qty.number;
  }
}

const SHOPPING_QUERY_PARAMS = {
  filter: {
    property: "Bought",
    checkbox: {
      equals: false,
    },
  },
  sorts: [
    {
      timestamp: "last_edited_time",
      direction: "ascending",
    },
  ],
};

module.exports = async ({ NOTION }) => {
  const notionService = new NotionService(
    NOTION.TOKEN,
    NOTION.SHOPPING_LIST_ID
  );
  const shoppingList = await notionService.getDatabaseItems(
    SHOPPING_QUERY_PARAMS
  );

  return shoppingList.map((item) => new ShoppingItem(item));
};
