export function* take(sequence, count) {
  if (count <= 0) return;
  for (let item of sequence) {
    yield item;
    count--;
    if (count === 0) return;
  }
}

export function* reverse(sequence) {
  const cachedValues = Array.from(sequence).reverse();
  yield* cachedValues;
}

export function* zip(sequence_left, sequence_right) {
  while (true) {
    const iteration_left = sequence_left.next();
    if (iteration_left.done) return;
    const iteration_right = sequence_right.next();
    if (iteration_right.done) return;
    yield [iteration_left.value, iteration_right.value];
  }
}

export function first(sequence) {
  return sequence.next().value;
}

export function last(sequence) {
  let result = undefined;
  while (true) {
    let iteration = sequence.next();
    if (iteration.done) {
      return result;
    }
    result = iteration.value;
  }
}
