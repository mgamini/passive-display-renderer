require("dotenv").config();
const { google } = require("googleapis");

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

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

calendar.events
  .list({
    calendarId: GOOGLE_CALENDAR_ID,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  })
  .then((result) => {
    console.log(result);
  });
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
