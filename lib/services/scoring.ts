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
  useLogScoring: boolean = false,
  C: number
) => {
  const SMAX = 10;
  const SMIN = -57.2689368388;
  const DELTA = 0.4;
  const EPSILON = 0.0000000001;
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
    lowerBound -= EPSILON;
    upperBound += EPSILON;
    let r = (lowerBound - answer) / C;
    let s = (upperBound - lowerBound) / C;
    let t = (answer - upperBound) / C;
    console.log("r: " + r);
    console.log("s: " + s);
    console.log("t: " + t);
    if (answer < lowerBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * r - (r / (1 + r)) * s);
    } else if (answer > upperBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * t - (t / (1 + t)) * s);
    }
    lowerBound -= DELTA;
    upperBound += DELTA;
    r = (lowerBound - answer) / C;
    s = (upperBound - lowerBound) / C;
    t = (answer - upperBound) / C;
    return ((4 * SMAX * r * t) / (s * s)) * (1 - s / (1 + s));
  } else {
    lowerBound /= 10 ** EPSILON;
    upperBound *= 10 ** EPSILON;
    let r = Math.log(lowerBound / answer) / Math.log(C);
    let s = Math.log(upperBound / lowerBound) / Math.log(C);
    let t = Math.log(answer / upperBound) / Math.log(C);
    console.log("r: " + r);
    console.log("s: " + s);
    console.log("t: " + t);
    if (answer < lowerBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * r - (r / (1 + r)) * s);
    } else if (answer > upperBound) {
      return Math.max(SMIN, (-2 / (1 - B)) * t - (t / (1 + t)) * s);
    }
    lowerBound /= 10 ** DELTA;
    upperBound *= 10 ** DELTA;
    r = Math.log(lowerBound / answer) / Math.log(C);
    s = Math.log(upperBound / lowerBound) / Math.log(C);
    t = Math.log(answer / upperBound) / Math.log(C);
    return ((4 * SMAX * r * t) / (s * s)) * (1 - s / (1 + s));
  }
};


export const challengeScore = (
  lowerBound: number,
  upperBound: number,
  answer: number,
) => {
  // todo - estimathon scoring rule from https://estimathon.com/how-to-play
  return answer >= lowerBound && answer <= upperBound ? 1 : -1;
}