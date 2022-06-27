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

export const valueToString = (value: string | number, hasDecimals: boolean) => {
  if (typeof value === "string") {
    return value;
  }
  if (hasDecimals) {
    return value.toFixed(3);
  }
  return value.toFixed(0);
};

export const truncateError = (error: number, median: number) => {
  const minVal = Math.min(median, error);
  const maxVal = Math.min(100 - median, error);
  return [minVal, maxVal];
};
