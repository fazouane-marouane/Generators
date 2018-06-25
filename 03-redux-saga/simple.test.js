const { runSaga, delay } = require("redux-saga");
const { call, fork, join } = require("redux-saga/effects");
const { createMockTask } = require("redux-saga/utils");

function* program() {
  yield call(console.log, "Hello world");
  const ping = yield fork(function*() {
    yield call(delay, 10);
    yield call(console.log, "Ping");
    return 20;
  });
  const pong = yield fork(function*() {
    yield call(delay, 10);
    yield call(console.log, "Pong");
    return 22;
  });
  const [resultPing, resultPong] = yield join(ping, pong);
  yield call(console.log, "Bye 👋");
  return resultPing + resultPong;
}

describe("Simple redux-saga program", () => {
  let spy;
  beforeEach(function() {
    spy = jest.spyOn(global.console, "log");
  });
  afterEach(function() {
    spy.mockReset();
    spy.mockRestore();
  });
  it("should run fully the program", async () => {
    const result = await runSaga({}, program).done;
    expect(result).toBe(42);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith("Hello world");
    expect(spy).toHaveBeenCalledWith("Ping");
    expect(spy).toHaveBeenCalledWith("Pong");
    expect(spy).toHaveBeenCalledWith("Bye 👋");
  });

  it("should run the program step by step", async () => {
    const gen = program();
    expect(gen.next()).toEqual({
      done: false,
      value: call(console.log, "Hello world")
    });
    const firstForkEffect = gen.next();
    expect(firstForkEffect.value["@@redux-saga/IO"]).toBe(true);
    expect(firstForkEffect.value["FORK"]).toBeTruthy();
    const secondForkEffect = gen.next(createMockTask());
    expect(secondForkEffect.value["@@redux-saga/IO"]).toBe(true);
    expect(secondForkEffect.value["FORK"]).toBeTruthy();
    const joinEffect = gen.next(createMockTask());
    expect(joinEffect.value["@@redux-saga/IO"]).toBe(true);
    expect(joinEffect.value["ALL"]).toBeTruthy();
    expect(gen.next([10, 3])).toEqual({
      done: false,
      value: call(console.log, "Bye 👋")
    });
    expect(gen.next()).toEqual({
      done: true,
      value: 13
    });
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
