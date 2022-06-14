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
