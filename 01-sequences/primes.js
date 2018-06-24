import { take, last } from "./utils";

function isPrime(n, primesList) {
  // n is a prime number if no prime number less than its square root divides it
  const max = Math.sqrt(n);
  for (let p of primesList) {
    if (p > max) break;
    if (n % p === 0) {
      return false;
    }
  }
  return true;
}

function* primes() {
  const primesList = [3];
  yield 2;
  yield 3;
  for (let n = 5; n < Number.MAX_SAFE_INTEGER; n += 2) {
    if (isPrime(n, primesList)) {
      primesList.push(n);
      yield n;
    }
  }
}

const hugePrimesList = take(primes(), 100000);
const hundredThousandthPrime = last(hugePrimesList);
console.log("The 100 000th prime number:", hundredThousandthPrime);
// Verification
// 100 thousandth prime: https://www.bigprimes.net/cruncher/1299709/
