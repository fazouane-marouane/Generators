const faker = require("faker");
faker.seed(42); // for consistent results;

faker.locale = "fr";
const emptyArray = Array.apply(null, Array(10));
console.log(
  emptyArray.map(v => ({
    name: faker.name.firstName(),
    phone: faker.phone.phoneNumber("+33 6########"),
    bio: faker.lorem.sentence()
  }))
);
