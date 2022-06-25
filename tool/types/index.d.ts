export {};

declare global {
  interface Window {
    tokenData: {
      hash: string;
    };
    setup: any;
    draw: any;
    preload: any;
    update: any;
  }

  let tokenData: {
    hash: string;
  };
}
