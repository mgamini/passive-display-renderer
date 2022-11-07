const { gcalService } = require("../services");
const { time } = require("../util");

const DAY_COUNT = 4;

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
