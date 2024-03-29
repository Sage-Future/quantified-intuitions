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

  return greenbergScoring(
    lowerBound,
    upperBound,
    answer,
    useLogScoring,
    C,
    SMAX,
    SMIN,
    DELTA,
    EPSILON,
    B,
  )
}

export const challengeScore = (
  lowerBound: number,
  upperBound: number,
  answer: number,
  confidenceInterval: number,
  useLogScoring: boolean = false,
  C: number
) => {
  const SMAX = 10;
  const SMIN = -10; // higher lower bound for challenge questions to be more forgiving
  const DELTA = 0.4;
  const EPSILON = 0.0000000001;
  const B = confidenceInterval / 100;

  return greenbergScoring(lowerBound,
    upperBound,
    answer,
    useLogScoring,
    C,
    SMAX,
    SMIN,
    DELTA,
    EPSILON,
    B,
  )
}

const greenbergScoring = (
  lowerBound: number,
  upperBound: number,
  answer: number,
  useLogScoring: boolean = false,
  C: number,
  SMAX: number,
  SMIN: number,
  DELTA: number,
  EPSILON: number,
  B: number
) => {
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


export const logBinaryScore = (
  estimate: number,
  resolution: boolean,
) => {
  const likelihoodAssignedToOutcome = resolution ? estimate : 1 - estimate;
  return (Math.log(likelihoodAssignedToOutcome) - Math.log(0.5)) * 10;
};


export const estimathonScore = (
  questions: {
    lowerBound: number,
    upperBound: number,
    answer: number,
  }[],
) => {
  if (questions.length === 0) {
    return 0;
  }

  // estimathon scoring rule from https://estimathon.com/how-to-play
  let score = 10;
  let incorrectCount = 0;
  questions.forEach(q => {
    const correct = q.answer >= q.lowerBound && q.answer <= q.upperBound;
    if (correct) {
      // sum max/min for each good interval
      score += q.upperBound / q.lowerBound;
    } else {
      incorrectCount++;
    }
  })

  // multiply by 2^[incorrectCount]
  score *= Math.pow(2, incorrectCount);

  console.log({ score, incorrectCount, questions });

  return score;
};