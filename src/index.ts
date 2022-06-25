import { preload, setup, update, draw, windowResized } from "./sketch";

/**
 * State
 */

let state = {};

/**
 * Lifecycle
 */

window.preload = preload;
window.update = update;

window.setup = () => {
  setup(state);
};

window.draw = () => {
  update(state);
  draw(state);
};

window.windowResized = () => {
  windowResized(state);
};
