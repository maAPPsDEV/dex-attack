const Hacker = artifacts.require("Hacker");
const { expect } = require("chai");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Hacker", function ([_owner, _hacker]) {
  it("should assert true", async function () {
    const hackerContract = await Hacker.deployed();
    return assert.isTrue(true);
  });
});
