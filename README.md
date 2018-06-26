# Generators

[TODO after the rehearsal talk: add links to code files]

## Usual usages of Generators

### Generators as iterators
Generators are re-entering functions; meaning that execution can be resumed after returning a value. This gives you the possibility to write any sequence of values in a very declarative fashion.

To do this, you usually need an infinite loop and each time you compute an element of your sequence, you « return » it to the caller. Once the generator is called again, execution can be resumed at the same location it originally halted; giving you the opportunity to compute the next element of the sequence and so on.

### Generators as control flow mechanism
Two remarks about the behaviour of the yield keyword open new doors to how we can use(misuse 🤔?) generators.
1. First of all `yield ...;` is an expression and its value is given by whatever code calls `.next()` on the generator.
2. Also up the the generator’s caller, `yield ...;` can behave as a `return` instruction or a `throw`. 

We can for example fully simulate async/await using `Promises` and  `yield` or even cooperative threads to name a few.

## Redux-Saga
Redux-saga is an example of a runtime implementing many coding patterns that take advantage of `yield`. When combined with a redux store, you obtain an easy way of manipulating the program’s state without actually running the side effects.
