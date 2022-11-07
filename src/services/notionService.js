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

// class Todo {
//   constructor({ properties }) {
//     this.title = properties.Name.title[0].plain_text;
//     this.stage = properties.Stage.select.name;
//     this.assignees = properties.Assignee.people.map((person) => person.name);

//     if (properties.Date.date && properties.Date.date.start) {
//       const { start } = properties.Date.date;

//       const hasTime = start.indexOf("T") > -1;

//       this.date = hasTime ? new Date(start) : new Date(`${start}T00:00`);

//       this.dateLabel = hasTime
//         ? `${time.print.date.short(this.date)} at ${time.print.time.hr12(
//             this.date
//           )}`
//         : time.print.date.short(this.date);
//     } else {
//       this.date = null;
//       this.dateLabel = null;
//     }
//   }
// }

notionService.getTodos = async () => {
  const dbProps = await fetchDatabaseProps(process.env.NOTION_TODOS_ID);
  const todos = await queryTodos(process.env.NOTION_TODOS_ID);

  return {
    dbProps,
    todos,
  };
};

// const test = async () => {
//   const todos = await notionService.getTodos();

//   debug.print(todos);
// };

// test();

module.exports = notionService;
