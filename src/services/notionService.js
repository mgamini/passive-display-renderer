// require("dotenv").config();
const { Client } = require("@notionhq/client");
// const { time } = require("../util");

const notionService = {};

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const fetchDatabaseProps = async (database_id) => {
  const { properties } = await notion.databases.retrieve({
    database_id,
  });

  return properties;
};

const queryTodos = async (database_id) => {
  const { results } = await notion.databases.query({
    database_id,
    filter: {
      and: [
        {
          property: "Name",
          title: {
            is_not_empty: true,
          },
        },
        {
          property: "Stage",
          select: {
            is_not_empty: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
    ],
  });

  return results;
};

const queryShoppingList = async (database_id) => {
  const { results } = await notion.databases.query({
    database_id,
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
  });

  return results;
};

notionService.getTodos = async () => {
  const dbId = process.env.NOTION_TODOS_ID;
  const dbProps = await fetchDatabaseProps(dbId);
  const todos = await queryTodos(dbId);

  return {
    dbProps,
    todos,
  };
};

notionService.getShopping = async () => {
  const dbId = process.env.NOTION_SHOPPING_LIST_ID;
  // const dbProps = await fetchDatabaseProps(dbId);
  const shoppingList = await queryShoppingList(dbId);

  // return {
  //   dbProps,
  //   shoppingList,
  // };
  return shoppingList;
};

// const test = async () => {
//   const todos = await notionService.getTodos();

//   debug.print(todos);
// };

// test();

module.exports = notionService;
