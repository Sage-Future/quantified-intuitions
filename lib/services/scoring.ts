export const binaryScore = (
  binaryProbability: number,
  binaryResolution: Boolean
) => {
  return binaryResolution
    ? Math.log(binaryProbability)
    : Math.log(1 - binaryProbability);
};
