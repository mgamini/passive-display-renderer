const { GcalService } = require("../services");
const { time } = require("../util");

class Event {
  constructor(calendarName, { summary, start, end }) {
    this.calendarName = calendarName.replaceAll("(personal)", "").trim();
    this.eventName = summary;

    this.allDayEvent = !Object.hasOwn(start, "dateTime");
    this.start = new Date(
      this.allDayEvent ? `${start.date}T00:00` : start.dateTime
    );
    this.end = new Date(this.allDayEvent ? `${end.date}T00:00` : end.dateTime);

    this.timeLabel = this.allDayEvent
      ? "All day"
      : `${time.print.time.hr12(this.start)} - ${time.print.time.hr12(
          this.end
        )}`;
  }
}

module.exports = async ({ GOOGLE }) => {
  const output = [];
  const dayCount = process.env.DAY_COUNT;
  const gcalService = new GcalService(GOOGLE);
  const fetchedEvents = await gcalService.getEvents(dayCount);

  const eventList = fetchedEvents.reduce((agg, { summary, items }) => {
    items.forEach((item) => {
      agg.push(new Event(summary, item));
    });

    return agg;
  }, []);

  for (let i = 0; i < dayCount; i++) {
    const dayStart = time.getDayStart(i);
    const dayEnd = time.getDayEnd(i);

    const label =
      i === 0
        ? time.print.date.long(time.getDayStart(i))
        : time.print.date.short(time.getDayStart(i));

    const events = eventList
      .filter(({ start }) => start >= dayStart && start < dayEnd)
      .sort((a, b) => (a.start > b.start ? 1 : -1));

    output.push({
      label,
      events,
    });
  }

  return output;

  // return data.map((calEvents, idx) => {
  //   const label =
  //     idx === 0
  //       ? time.print.date.long(time.getDayStart(idx))
  //       : time.print.date.short(time.getDayStart(idx));

  //   const events = calEvents.map((event) => ({
  //     ...event,
  //     timeLabel: event.allDayEvent
  //       ? "All day"
  //       : `${time.print.time.hr12(event.start)} - ${time.print.time.hr12(
  //           event.end
  //         )}`,
  //   }));

  //   return {
  //     label,
  //     events,
  //   };
  // });
};
