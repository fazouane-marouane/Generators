class Oups extends Error {}

function* testThrow() {
  yield new Oups("I'm sowwy");
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
  it("Should throw an exception when calling throw()", () => {
    const gen = testThrow();
    // run the generator until the very first yield
    const { value } = gen.next();
    expect(value).toBeInstanceOf(Oups);
    expect(() => gen.throw(value)).toThrow(value);
  });
});
