const Dex = artifacts.require("Dex");
const SwappableToken = artifacts.require("SwappableToken");
module.exports = function (_deployer, _network, [_owner, _hacker]) {
  // Use deployer to state migration tasks.
  let token1, token2;
  _deployer
    .deploy(SwappableToken, "Token 1", "TKN1", 110)
    .then(function (token) {
      token1 = token;
      return _deployer.deploy(SwappableToken, "Token 2", "TKN2", 110);
    })
    .then(function (token) {
      token2 = token;
      return _deployer.deploy(Dex, token1.address, token2.address);
    })
    .then(async function (dex) {
      // initialize game environment
      await token1.approve(dex.address, 100);
      await token2.approve(dex.address, 100);
      await dex.add_liquidity(token1.address, 100);
      await dex.add_liquidity(token2.address, 100);
      await token1.transfer(_hacker, 10);
      await token2.transfer(_hacker, 10);
    });
};
