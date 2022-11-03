const { google } = require("googleapis");
const apiKey = process.env.GOOGLE_API_KEY;
const calendarId = process.env.GOOGLE_CALENDAR_ID;
const cal = google.calendar({
  version: "v3",
  auth: apiKey,
});

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

//--------------- Utility Functions --------------------
function lastDayInMonth(month, year) {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month == 1 && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
    ? daysInMonth[month] + 1 // account for leap year
    : daysInMonth[month];
}

//--------- Handler to call Google Calendar API ---------
const fetchEvents = async (month, year) => {
  console.log("secrets:", apiKey, calendarId);

  // retrieve the month and year
  // const { month, year } = JSON.parse(event.body)

  // set up the headers for the response
  var headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, X-Amz-Date, Authorization, X.Api-Key, X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
    "Access-Control-Allow-Origin": "*",
  };

  // set up the base response fields
  const response = {
    statusCode: 200,
    headers: headers,
    body: "",
  };

  // set the start date for the beginning of the of the first day of the month
  const startDate = new Date(year, month, 1, 0, 0, 0).toISOString();

  // set the start date for the end of the of the last day of the month
  const endDate = new Date(
    year,
    month,
    lastDayInMonth(month, year),
    23,
    59,
    59
  ).toISOString();

  // set the time zone
  const timeZone = "America/New_York";

  // set up the parameters for the call to the Google Calendar API
  const res_params = {
    timeMin: startDate,
    timeMax: endDate,
    timeZone: timeZone,
    calendarId: calendarId,
    singleEvents: true,
    orderBy: "startTime",
  };

  await cal.events
    .list(res_params)
    .then((result) => {
      response.body = JSON.stringify(result);
    })
    .catch((e) => {
      console.log(e);
      response.body = "Error in retrieving events";
    });

  console.log(response.body);

  return response;
};

fetchEvents(10, 2022);

module.exports = calendar;
