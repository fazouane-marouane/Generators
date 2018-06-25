const { take } = require("./utils");

function* fib() {
  let [a, b] = [0, 1];
  while (a < Number.MAX_SAFE_INTEGER) {
    yield a;
    [a, b] = [b, a + b];
  }
}

describe("fibonacci", () => {
  it("should yield the correct Fibonacci sequence", () => {
    const tenFirstFibonacci = Array.from(take(fib(), 10));
    expect(tenFirstFibonacci).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
  });
});
