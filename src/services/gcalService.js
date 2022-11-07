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

  return data;
};

gcalService.getEvents = async (dayCount = 1, maxResults = null) => {
  const calendarIds = GOOGLE_CALENDAR_IDS.split(",");

  return Promise.all(
    calendarIds.map(async (calendarId) => {
      return await fetchEvents(calendarId, dayCount - 1, maxResults);
    })
  );
};

module.exports = gcalService;
