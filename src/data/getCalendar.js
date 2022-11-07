const { gcalService } = require("../services");
const { time } = require("../util");

const DAY_COUNT = 4;

// const dateOptions = {
//   weekday: "long",
//   month: "short",
//   day: "numeric",
//   timeZone: "America/New_York",
// };

// function dayPlus(days) {
//   const currentDate = new Date();
//   return new Date(currentDate.setDate(currentDate.getDate() + days));
// }

// function dayLabel(idx) {
//   return idx === 0
//     ? new Date().toLocaleDateString("en-US", dateOptions)
//     : dayPlus(idx).toLocaleDateString("en-US", {
//         ...dateOptions,
//         weekday: "short",
//       });
// }

// function eventToDisplayObject(event)

module.exports = async () => {
  const data = await gcalService.getEvents(DAY_COUNT);

  return data.map((calEvents, idx) => {
    const label =
      idx === 0
        ? time.print.date.long(time.getDayStart(idx))
        : time.print.date.short(time.getDayStart(idx));

    const events = calEvents.map((event) => ({
      ...event,
      timeLabel: event.allDayEvent
        ? "All day"
        : `${time.print.time.hr12(event.start)} - ${time.print.time.hr12(
            event.end
          )}`,
    }));

    return {
      label,
      events,
    };
  });
};
