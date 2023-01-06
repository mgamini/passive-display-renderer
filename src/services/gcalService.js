const { google } = require("googleapis");

const { time } = require("../util");

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

class GcalService {
  constructor({ PRIVATE_KEY, CLIENT_EMAIL, PROJECT_NUMBER, CALENDAR_IDS }) {
    const jwtClient = new google.auth.JWT(
      CLIENT_EMAIL,
      null,
      PRIVATE_KEY,
      SCOPES
    );

    this.client = google.calendar({
      version: "v3",
      project: PROJECT_NUMBER,
      auth: jwtClient,
    });

    this.calendarIds = CALENDAR_IDS.split(",");
  }

  async fetchEvents({ calendarId, endDayIdx, maxResults }) {
    const params = {
      calendarId,
      timeMin: time.today.toISOString(),
      timeMax: time.getDayEnd(endDayIdx).toISOString(),
      singleEvents: true,
    };

    if (maxResults) {
      params.maxResults = maxResults;
    }

    const { data } = await this.client.events.list(params);

    return data;
  }

  async getEvents(dayCount, maxResults = null) {
    return Promise.all(
      this.calendarIds.map(async (calendarId) => {
        return await this.fetchEvents({
          calendarId,
          endDayIdx: dayCount - 1,
          maxResults,
        });
      })
    );
  }
}

module.exports = GcalService;
