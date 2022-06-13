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
