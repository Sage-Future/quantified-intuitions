const { DateTime } = require("luxon");

export const booleanToString = (boolean: boolean) => {
  return boolean ? "true" : "false";
};

export const dateMed = (date: Date) => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
};

export const floatToPercent = (float: number) => {
  return `${Math.round(float * 100)}%`;
};

export const numToTwoDigits = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`;
};

export const dateToObject = (date: Date) => {
  return {
    month: numToTwoDigits(date.getMonth() + 1),
    day: numToTwoDigits(date.getDay()),
    year: date.getFullYear(),
  };
};

export const valueToString = (value: string | number) => {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    if (value % 1 === 0) {
      return value.toString();
    }
    return value.toFixed(3);
  }
  return "";
};
