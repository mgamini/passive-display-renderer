const LOCALE = process.env.LOCALE;
const timeZone = process.env.TIMEZONE;

// format defaults
const weekday = "long";
const month = "short";
const day = "numeric";
const hour = "numeric";
const minute = "2-digit";

const formatters = {
  longDate: new Intl.DateTimeFormat(LOCALE, { weekday, month, day, timeZone })
    .format,
  shortDate: new Intl.DateTimeFormat(LOCALE, {
    weekday: "short",
    month,
    day,
    timeZone,
  }).format,
  time12: new Intl.DateTimeFormat(LOCALE, {
    hour,
    minute,
    hour12: true,
    timeZone,
  }).format,
  time24: new Intl.DateTimeFormat(LOCALE, {
    hour: "2-digit",
    minute,
    hour12: false,
    timeZone,
  }).format,
};

module.exports = {
  get now() {
    return new Date();
  },
  get today() {
    return this.getDayStart();
  },
  getDayStart: function (days = 0) {
    return new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() + days
    );
  },
  getDayEnd: function (days = 0) {
    return new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() + days,
      23,
      59,
      59,
      999
    );
  },
  print: {
    date: {
      long: (date) => formatters.longDate(date),
      short: (date) => formatters.shortDate(date),
    },
    time: {
      hr12: (date) => formatters.time12(date),
      hr24: (date) => formatters.time24(date),
    },
  },
};
