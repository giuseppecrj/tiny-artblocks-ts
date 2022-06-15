export {};

declare global {
  interface Window {
    tokenData: {
      hash: string;
    };
  }
  let tokenData: {
    hash: string;
  };
}
