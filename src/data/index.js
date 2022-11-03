const getCalendar = require("./getCalendar");

module.exports = {
  fetchAll: async () => {
    const hydratedData = {};

    hydratedData.calendar = await getCalendar();

    return hydratedData;
  },
};
