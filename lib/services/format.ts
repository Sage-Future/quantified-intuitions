const { DateTime } = require("luxon");

export const booleanToString = (boolean: boolean) => {
  return boolean ? "true" : "false";
};

export const dateMed = (date: Date) => {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
};

export const floatToPercent = (float: number, decimals: number) => {
  return `${(float * 100).toFixed(decimals)}%`;
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
export const valueToString = (
  value: string | number,
  hasDecimals: boolean,
  showDecimals: boolean = false
) => {
  if (typeof value === "string") {
    return value;
  }
  if (hasDecimals) {
    if (showDecimals) {
      return value.toFixed(2);
    }
    return (value * 1000).toFixed(0);
  }
  return value.toFixed(0);
};
export const convertNumber = (value: number, isExponential: boolean) => {
  if (isExponential) {
    return 10 ** value;
  }
  return value;
};
//returns string
export const numberToHumanReadableString = (value: number): string => {
  if (value < 0) {
    return "-" + numberToHumanReadableString(-value);
  }
  if (value < 0.001) {
    return value.toExponential();
  }
  if (value < 1e15) {
    // return value with commas
    return value.toLocaleString("en-US");
  }
  //value is not infinity
  if (value < Infinity) {
    return value.toExponential();
  }
  return "Infinity";
};

export const formatInput = (value: number, prefix: string, postfix: string) => {
  if (postfix.match(/(AD|BCE|BC|CE)/)) {
    return `${prefix}${value} ${postfix}`;
  }
  return `${prefix.includes("$") ? "$" : ""}${numberToHumanReadableString(
    convertNumber(value, prefix.includes("10^"))
  )}${postfix === "%" ? postfix : " " + postfix}`;
};

export const formatResult = (
  value: number,
  prefix: string,
  postfix: string
) => {
  if (postfix.match(/(AD|BCE|BC|CE)/)) {
    return `${prefix}${value} ${postfix}`;
  }
  return `${prefix.includes("$") ? "$" : ""}${numberToHumanReadableString(
    convertNumber(value, false)
  )}${postfix === "%" ? postfix : " " + postfix}`;
};

export const truncateError = (error: number, median: number) => {
  const minVal = Math.min(median, error);
  const maxVal = Math.min(100 - median, error);
  return [minVal, maxVal];
};

export const secondsToTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}:${numToTwoDigits(minutes)}:${numToTwoDigits(secondsLeft)}`;
  } else {
    return `${minutes}:${numToTwoDigits(secondsLeft)}`;
  }
};
