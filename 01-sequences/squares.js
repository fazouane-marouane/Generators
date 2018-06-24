import { take, reverse, zip } from "./utils";

function* integers() {
  for (let n = 0; n < Number.MAX_SAFE_INTEGER; n++) {
    yield n;
  }
}

function* squares() {
  let max = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER));
  for (let n of integers()) {
    if (n > max) return;
    yield n * n;
  }
}

const tenFirstSquares = reverse(zip(integers(), take(squares(), 10)));

console.log("The ten first squares:", Array.from(tenFirstSquares));
