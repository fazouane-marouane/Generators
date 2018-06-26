// Number -> Promise
function delay(ms) {
  return new Promise(resolve => {
    if (ms <= 0) return resolve();
    setTimeout(resolve, ms);
  });
}

async function fetchMessageById(id) {
  const data = [
    {
      id: 0,
      message: `Hello world`
    },
    {
      id: 1,
      message: "😕+🍪=😊"
    }
  ];
  // simulate network/process delay
  await delay(2000);
  return data[id];
}

function* testYieldAsAwait() {
  const { message: first } = yield fetchMessageById(0);
  console.log(first);
  const { message: second } = yield fetchMessageById(1);
  console.log(second);
}

function* testEdgeCases() {
  try {
    // try to cause an exception to be thrown
    yield Promise.resolve().then(() => undefined.undefined);
  } catch (e) {
    console.log("hehe. nice try.");
  }
}

function runUsingPlainPromises(generator) {
  function iterate(nextValue, exception) {
    const result = exception
      ? generator.throw(exception)
      : generator.next(nextValue);
    if (result.value instanceof Promise) {
      return result.value
        .then(value => {
          return iterate(value);
        })
        .catch(e => iterate(undefined, e));
    }
  }
  return iterate();
}

async function runUsingAsyncAwait(generator) {
  let continuation = {};
  while (true) {
    const result = continuation.exception
      ? generator.throw(continuation.exception)
      : generator.next(continuation.nextValue);
    continuation = {};
    if (result.done) {
      return;
    }
    if (result.value instanceof Promise) {
      try {
        continuation.nextValue = await result.value;
      } catch (e) {
        continuation.exception = e;
      }
    }
  }
}

describe("yield as await", () => {
  let spy;
  beforeEach(function() {
    spy = jest.spyOn(global.console, "log");
  });
  afterEach(function() {
    spy.mockReset();
    spy.mockRestore();
  });

  it("Pilot the generator using async await", async () => {
    const start = performance.now();
    const generator = testYieldAsAwait();
    await runUsingAsyncAwait(generator);
    const stop = performance.now();
    // delays have been honored
    expect(stop - start).toBeGreaterThanOrEqual(2 * 2000);
    // the generator has been run into completion
    expect(generator.next()).toEqual({ value: undefined, done: true });
    // console.log has been called with the correct values
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("Hello world");
    expect(spy).toHaveBeenCalledWith("😕+🍪=😊");
  });

  it("Pilot the generator using plain promises", async () => {
    const start = performance.now();
    const generator = testYieldAsAwait();
    await runUsingPlainPromises(generator);
    const stop = performance.now();
    // delays have been honored
    expect(stop - start).toBeGreaterThanOrEqual(2 * 2000);
    // the generator has been run into completion
    expect(generator.next()).toEqual({ value: undefined, done: true });
    // console.log has been called with the correct values
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("Hello world");
    expect(spy).toHaveBeenCalledWith("😕+🍪=😊");
  });

  it("Should handle exceptions when piloting the generator using async await", async () => {
    const generator = testEdgeCases();
    await runUsingAsyncAwait(generator);
    // the generator has been run into completion
    expect(generator.next()).toEqual({ value: undefined, done: true });
    // console.log has been called with the correct values
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("hehe. nice try.");
  });

  it("Should handle exceptions when piloting the generator using plain promises", async () => {
    const generator = testEdgeCases();
    await runUsingPlainPromises(generator);
    // the generator has been run into completion
    expect(generator.next()).toEqual({ value: undefined, done: true });
    // console.log has been called with the correct values
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("hehe. nice try.");
  });
});
