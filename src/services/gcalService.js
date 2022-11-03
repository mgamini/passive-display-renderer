// require("dotenv").config();
const { google } = require("googleapis");

const { time } = require("../util");

const gcalService = {};

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

const {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PROJECT_NUMBER,
  GOOGLE_CALENDAR_IDS,
} = process.env;

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

const fetchEvents = async (calendarId, endDayIdx, maxResults) => {
  const params = {
    calendarId,
    timeMin: time.today.toISOString(),
    timeMax: time.getDayEnd(endDayIdx).toISOString(),
    singleEvents: true,
  };

  if (maxResults) {
    params.maxResults = maxResults;
  }

  const { data } = await calendar.events.list(params);

  return data.items.map(({ summary, start, end }) => {
    const allDayEvent = !Object.hasOwn(start, "dateTime");

    return {
      calendarName: data.summary,
      eventName: summary,
      allDayEvent,
      start: new Date(allDayEvent ? `${start.date}T00:00` : start.dateTime),
      end: new Date(allDayEvent ? `${end.date}T00:00` : end.dateTime),
    };
  });
};

gcalService.getEvents = async (dayCount = 1, maxResults = null) => {
  const events = [];
  const calendarIds = GOOGLE_CALENDAR_IDS.split(",");

  const eventList = await calendarIds.reduce(async (agg, calendarId) => {
    const current = await agg;
    const fetchedEvents = await fetchEvents(
      calendarId,
      dayCount - 1,
      maxResults
    );
    return [...current, ...fetchedEvents];
  }, []);

  for (let i = 0; i < dayCount; i++) {
    const dayStart = time.getDayStart(i);
    const dayEnd = time.getDayEnd(i);

    events.push(
      eventList.filter(({ start }) => start >= dayStart && start < dayEnd)
    );
  }

  return events;
};

// const test = async () => {
//   const res = await gcalService.getEvents(0);
//   console.log(res);
// };

// test();

module.exports = gcalService;

// calendar.events
//   .list({
//     calendarId: GOOGLE_CALENDAR_ID,
//     timeMin: new Date().toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: "startTime",
//   })
//   .then((result) => {
//     console.log(result);
//   });
//   (error, result) => {
//     if (error) {
//       res.send(JSON.stringify({ error: error }));
//     } else {
//       if (result.data.items.length) {
//         res.send(JSON.stringify({ events: result.data.items }));
//       } else {
//         res.send(JSON.stringify({ message: "No upcoming events found." }));
//       }
//     }
//   }
// );
