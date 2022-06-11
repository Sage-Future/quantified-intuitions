export const binaryScore = (
  binaryProbability: number,
  crowdForecast: number,
  binaryResolution: Boolean
) => {
  return binaryResolution
    ? Math.log(binaryProbability) - Math.log(crowdForecast)
    : Math.log(1 - binaryProbability) - Math.log(1 - crowdForecast);
};
