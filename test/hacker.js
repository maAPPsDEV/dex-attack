const Hacker = artifacts.require("Hacker");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Hacker", function (/* accounts */) {
  it("should assert true", async function () {
    await Hacker.deployed();
    return assert.isTrue(true);
  });
});
