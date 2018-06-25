const { take, last } = require("./utils");

function isPrime(n, primesList) {
  // n is a prime number if no prime number less than its square root divides it
  const max = Math.sqrt(n);
  for (const p of primesList) {
    if (p > max) {
      // All prime numbers < sqrt(n) don't divide n. So it must be a prime number
      return true;
    }
    if (n % p === 0) {
      // Found a proper divisor! n isn't prime.
      return false;
    }
  }
}

function* primes() {
  yield 2;
  yield 3;
  const oddPrimesList = [3];
  for (let n = 5; n < Number.MAX_SAFE_INTEGER; n += 2) {
    if (isPrime(n, oddPrimesList)) {
      oddPrimesList.push(n);
      yield n;
    }
  }
}

describe("primes", () => {
  it("should compute the 100 000th prime number correctly", () => {
    const hugePrimesSequence = take(primes(), 100000);
    const hundredThousandthPrime = last(hugePrimesSequence);
    expect(hundredThousandthPrime).toBe(1299709);
    // Verification
    // 100 thousandth prime: https://www.bigprimes.net/cruncher/1299709/
  });
});
