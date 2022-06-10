import { MAX_PREDICTION_PROBABILITY, MIN_PREDICTION_PROBABILITY } from "./magicNumbers";

export const isValidBinaryForecast = (forecast: string) =>
  !(
    Number.isNaN(Number(forecast)) ||
    Number(forecast) > MAX_PREDICTION_PROBABILITY * 100.0 ||
    Number(forecast) < MIN_PREDICTION_PROBABILITY * 100.0
  );
