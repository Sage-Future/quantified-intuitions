const { DateTime } = require("luxon");

export const booleanToString = (boolean: boolean) => {
  return boolean ? "true" : "false";
};

export const dateMed = (date: Date) => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
};

export const dateToObject = (date: Date) => {
  return {
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear(),
  };
};
