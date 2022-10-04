import { MAX_PREDICTION_PROBABILITY, MIN_PREDICTION_PROBABILITY } from "./magicNumbers";

export const isValidBinaryForecast = (forecast: string) =>
  !(
    Number.isNaN(Number(forecast)) ||
    Number(forecast) > MAX_PREDICTION_PROBABILITY * 100.0 ||
    Number(forecast) < MIN_PREDICTION_PROBABILITY * 100.0
  );

export const isValidBinaryProbability = (probability: number) =>
  !(
    Number.isNaN(probability) ||
    probability > MAX_PREDICTION_PROBABILITY + 1e-4 ||
    probability < MIN_PREDICTION_PROBABILITY - 1e-4
  );

export const isWaybackUrl = (url: string) => {
  const regex = /^https?:\/\/web\.archive\.org\/web\/[0-9]{14}\/.*$/;
  // url is wikipedia oldid url
  const regex2 = /^https?:\/\/en\.wikipedia\.org\/.*\?oldid=[0-9]+$/;
  return regex.test(url) || regex2.test(url);
};
