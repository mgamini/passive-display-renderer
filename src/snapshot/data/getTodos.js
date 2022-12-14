const { getDatabase } = require("@notionhq/client/build/src/api-endpoints");
const { NotionService } = require("../services");
const { time } = require("../util");

class Todo {
  constructor({ properties }) {
    this.title = properties.Name.title[0].plain_text;
    this.stage = properties.Stage.select.name;
    this.assignees = properties.Assignee.people.map((person) => person.name);

    if (properties.Date.date && properties.Date.date.start) {
      const { start } = properties.Date.date;

      const hasTime = start.indexOf("T") > -1;

      this.date = hasTime ? new Date(start) : new Date(`${start}T00:00`);

      this.dateLabel = hasTime
        ? `${time.print.date.short(this.date)} at ${time.print.time.hr12(
            this.date
          )}`
        : time.print.date.short(this.date);
    } else {
      this.date = null;
      this.dateLabel = null;
    }
  }
}

const TODOS_QUERY_PARAMS = {
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
};

module.exports = async ({ NOTION }) => {
  const notionService = new NotionService(NOTION.TOKEN, NOTION.TODOS_ID);

  const dbProps = await notionService.getDatabaseProps();
  const todos = await notionService.getDatabaseItems(TODOS_QUERY_PARAMS);

  const output = [];
  const stageIndex = {};

  dbProps.Stage.select.options.forEach(({ name }, index) => {
    stageIndex[name] = index;
    output.push({
      stage: name,
      todos: [],
    });
  });

  return todos.reduce((agg, rawTodo) => {
    try {
      const todo = new Todo(rawTodo);
      agg[stageIndex[todo.stage]].todos.push(todo);

      return agg;
    } catch (e) {
      console.log("bad todo:", e, rawTodo);
      return agg;
    }
  }, output);
};
