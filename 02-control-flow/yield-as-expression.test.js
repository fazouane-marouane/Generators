function* helloWorld() {
  console.log(yield);
}

describe("yield as expression", () => {
  let spy;
  beforeEach(function() {
    spy = jest.spyOn(global.console, "log");
  });
  afterEach(function() {
    spy.mockReset();
    spy.mockRestore();
  });
  it("should write to console the message that has been passed to the generator", () => {
    const generator = helloWorld();
    // run the generator until the very first yield expression
    expect(generator.next()).toEqual({
      value: undefined,
      done: false
    });
    // provide the value to "yield"
    expect(generator.next("Hello world!")).toEqual({
      value: undefined,
      done: true
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("Hello world!");
  });
});
