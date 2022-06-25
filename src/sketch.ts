export function preload() {}

export function setup(state) {
  createCanvas(720, 720);
  noFill();
}

export function update(state) {}

export function draw(state) {
  background(255);
  ellipse(mouseX, mouseY, 60, 60);
}

export function windowResized(state) {
  resizeCanvas(720, 720);
}
