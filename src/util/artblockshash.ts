import * as random from "../util/random";

export const artblocksHash = () => {
  return typeof tokenData !== "undefined"
    ? typeof tokenData === "string"
      ? tokenData
      : tokenData.hash
    : random.getRandomHash();
};
