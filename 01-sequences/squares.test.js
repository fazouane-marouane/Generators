const { take, reverse, zip } = require("./utils");

function* integers() {
  for (let n = 0; n < Number.MAX_SAFE_INTEGER; n++) {
    yield n;
  }
}

function* squares() {
  let max = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER));
  for (const n of integers()) {
    if (n > max) return;
    yield n * n;
  }
}

describe("squares", () => {
  it("should manipulate sequences", () => {
    const tenFirstSquares = take(squares(), 10);
    const indexedTenFirstSquares = zip(integers(), tenFirstSquares);
    const reversed = reverse(indexedTenFirstSquares);
    expect(Array.from(reversed)).toEqual([
      [9, 81],
      [8, 64],
      [7, 49],
      [6, 36],
      [5, 25],
      [4, 16],
      [3, 9],
      [2, 4],
      [1, 1],
      [0, 0]
    ]);
  });
});
