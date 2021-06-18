const Hacker = artifacts.require("Hacker");

module.exports = function (_deployer, _network, _accounts) {
  const [owner, hacker] = _accounts;
  // Use deployer to state migration tasks.
  _deployer.deploy(Hacker, { from: hacker });
};
