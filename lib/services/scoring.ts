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
  const SMIN = -57.2689368388;
  const DELTA = 0.4;
  const C = 100;
  const B = confidenceInterval / 100;
  //log all variables to console
  console.log("lowerBound: " + lowerBound);
  console.log("upperBound: " + upperBound);
  console.log("answer: " + answer);
  console.log("confidenceInterval: " + confidenceInterval);
  console.log("useLogScoring: " + useLogScoring);
  console.log("SMAX: " + SMAX);
  console.log("SMIN: " + SMIN);
  console.log("DELTA: " + DELTA);
  console.log("C: " + C);
  console.log("B: " + B);
  if (!useLogScoring) {
    lowerBound -= DELTA;
    upperBound += DELTA;
    const r = (lowerBound - answer) / C;
    const s = (upperBound - lowerBound) / C;
    const t = (answer - upperBound) / C;
    console.log("r: " + r);
    console.log("s: " + s);
    console.log("t: " + t);
    if (answer < lowerBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * r - (r / (1 + r)) * s);
    } else if (answer > upperBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * t - (t / (1 + t)) * s);
    }
    return ((4 * SMAX * r * t) / (s * s)) * (1 - s / (1 + s));
  } else {
    lowerBound /= 10 ** DELTA;
    upperBound *= 10 ** DELTA;
    const r = Math.log(lowerBound / answer) / Math.log(C);
    const s = Math.log(upperBound / lowerBound) / Math.log(C);
    const t = Math.log(answer / upperBound) / Math.log(C);
    console.log("r: " + r);
    console.log(lowerBound / answer);
    console.log("s: " + s);
    console.log(upperBound / lowerBound);
    console.log("t: " + t);
    console.log(answer / upperBound);
    if (answer < lowerBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * r - (r / (1 + r)) * s);
    } else if (answer > upperBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * t - (t / (1 + t)) * s);
    }
    return ((4 * SMAX * r * t) / (s * s)) * (1 - s / (1 + s));
  }
};
