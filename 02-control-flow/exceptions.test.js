function usualTryCatch() {
  try {
    throw "oups!";
  } catch (e) {
    console.log("[error]", e);
  }
}

function* fancyTryCatch() {
  try {
    yield "oups!";
  } catch (e) {
    console.log("[error]", e);
  }
}

describe("fancyTryCatch", () => {
  let spy;
  beforeEach(function() {
    spy = jest.spyOn(global.console, "log");
  });
  afterEach(function() {
    spy.mockReset();
    spy.mockRestore();
  });
  it("Should not throw any error when calling next()", () => {
    const gen = fancyTryCatch();
    expect(gen.next()).toEqual({ value: "oups!", done: false });
    expect(gen.next()).toEqual({ value: undefined, done: true });
    expect(spy).toHaveBeenCalledTimes(0);
  });
  it("Should throw an exception when calling throw()", () => {
    const gen = fancyTryCatch();
    expect(gen.next()).toEqual({ value: "oups!", done: false });
    expect(gen.throw("yo!")).toEqual({ value: undefined, done: true });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("[error]", "yo!");
  });
});
