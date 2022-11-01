const calendar = {};

const dateOptions = {
  weekday: "long",
  month: "short",
  day: "numeric",
  timeZone: "America/New_York",
};

function dayPlus(days) {
  const currentDate = new Date();
  return new Date(currentDate.setDate(currentDate.getDate() + days));
}

calendar.labels = {
  day0: new Date().toLocaleDateString("en-US", dateOptions),
  day1: dayPlus(1).toLocaleDateString("en-US", {
    ...dateOptions,
    weekday: "short",
  }),
  day2: dayPlus(2).toLocaleDateString("en-US", {
    ...dateOptions,
    weekday: "short",
  }),
  day3: dayPlus(3).toLocaleDateString("en-US", {
    ...dateOptions,
    weekday: "short",
  }),
};

module.exports = calendar;
