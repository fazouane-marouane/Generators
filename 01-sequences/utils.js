exports.take = function*(sequence, count) {
  if (count <= 0) return;
  for (const item of sequence) {
    yield item;
    count--;
    if (count === 0) return;
  }
};

exports.reverse = function*(sequence) {
  const cachedValues = Array.from(sequence).reverse();
  yield* cachedValues;
};

exports.zip = function*(sequence_left, sequence_right) {
  while (true) {
    const iteration_left = sequence_left.next();
    if (iteration_left.done) return;
    const iteration_right = sequence_right.next();
    if (iteration_right.done) return;
    yield [iteration_left.value, iteration_right.value];
  }
};

exports.first = function(sequence) {
  return sequence.next().value;
};

exports.last = function(sequence) {
  let result = undefined;
  while (true) {
    let iteration = sequence.next();
    if (iteration.done) {
      return result;
    }
    result = iteration.value;
  }
};
