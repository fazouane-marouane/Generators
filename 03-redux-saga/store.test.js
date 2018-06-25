const { createStore, applyMiddleware } = require("redux");
const { default: createSagaMiddleware } = require("redux-saga");
const { call, select, put } = require("redux-saga/effects");

function addTodo(text) {
  return {
    type: "ADD_TODO",
    text: text
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return state.concat([action.text]);
    default:
      return state;
  }
}

function* program() {
  yield call(console.log, "State [before]", yield select());
  yield put(addTodo("Read the docs"));
  yield call(console.log, "State [after]", yield select());
}

describe("redux-saga with a store", () => {
  let spy;
  beforeEach(function() {
    spy = jest.spyOn(global.console, "log");
  });
  afterEach(function() {
    spy.mockReset();
    spy.mockRestore();
  });
  it("should update the store", async () => {
    const sagaRuntime = createSagaMiddleware();
    const initialState = ["Use Redux"];
    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(sagaRuntime)
    );
    await sagaRuntime.run(program).done;
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith("State [before]", ["Use Redux"]);
    expect(spy).toHaveBeenCalledWith("State [after]", [
      "Use Redux",
      "Read the docs"
    ]);
  });
});
