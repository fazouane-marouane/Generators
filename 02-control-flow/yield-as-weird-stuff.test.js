function* cummulativeSum() {
  let sum = 0;
  while (true) {
    // return the cummulative sum and
    // wait for a new item to add to the current sum
    const nextItem = yield sum;
    sum += nextItem;
  }
}

// 😱
function weirdSum(array) {
  const generator = cummulativeSum();
  // start
  generator.next();
  for (const item of array) {
    generator.next(item);
  }
  return generator.next(0).value;
}

describe("Yield as return", () => {
  it("should compute the sum of the input", () => {
    const result = weirdSum([3, 4, 2, 16]);
    expect(result).toBe(25);
  });
});
