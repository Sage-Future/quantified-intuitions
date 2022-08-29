export const binaryScore = (
  binaryProbability: number,
  crowdForecast: number,
  binaryResolution: Boolean
) => {
  return binaryResolution
    ? Math.log(binaryProbability) - Math.log(crowdForecast)
    : Math.log(1 - binaryProbability) - Math.log(1 - crowdForecast);
};

export const calibrationScore = (
  lowerBound: number,
  upperBound: number,
  answer: number,
  confidenceInterval: number,
  useLogScoring: boolean = false
) => {
  const SMAX = 10;
  const SMIN = (-10 * Math.log(99 / 50)) / Math.log(50);
  const DELTA = 0.4;
  const C = 100;
  const B = confidenceInterval / 100;
  if (!useLogScoring) {
    const r = (lowerBound - answer) / C;
    const s = (upperBound - lowerBound) / C;
    const t = (answer - upperBound) / C;
    if (answer < lowerBound) {
      return (-2 / (1 - B)) * r - (r / (1 + r)) * s;
    } else if (answer > upperBound) {
      return (-2 / (1 - B)) * t - (t / (1 + t)) * s;
    }
    return ((4 * SMAX * r * t) / (s * s)) * (1 - s / (1 + s));
  } else {
    const r = Math.log(lowerBound - answer) / Math.log(C);
    const s = Math.log(upperBound - lowerBound) / Math.log(C);
    const t = Math.log(answer - upperBound) / Math.log(C);
    if (answer < lowerBound) {
      return (-2 / (1 - B)) * r - (r / (1 + r)) * s;
    } else if (answer > upperBound) {
      return (-2 / (1 - B)) * t - (t / (1 + t)) * s;
    }
    return ((4 * SMAX * r * t) / (s * s)) * (1 - s / (1 + s));
  }
};
