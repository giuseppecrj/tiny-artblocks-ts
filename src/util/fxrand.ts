let alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var fxhash = "oo1pKoCCJVDKxYcp2Zipfb4hfHN9Ry1Q2xYAQPhyiv4vCnQwP2d";
let b58dec = (str) =>
  str
    .split("")
    .reduce(
      (p, c, i) =>
        p + alphabet.indexOf(c) * Math.pow(alphabet.length, str.length - i - 1),
      0
    );
let fxhashTrunc = fxhash.slice(2);
let regex = new RegExp(".{" + ((fxhash.length / 4) | 0) + "}", "g");
let hashes = fxhashTrunc.match(regex).map((h) => b58dec(h));
let sfc32 = (...args) => {
  let [a, b, c, d] = args;

  return () => {
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    var t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

export const fxrand = () => sfc32(...hashes);
