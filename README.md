# Solidity Game - DEX Attack

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), Dex Level_

⚠️Do not try on mainnet!

## Task

The goal of this level is for you to hack the basic [DEX](https://en.wikipedia.org/wiki/Decentralized_exchange) contract below and steal the funds by price manipulation.

You will start with 10 tokens of `token1` and 10 of `token2`. The DEX contract starts with 100 of each token.

You will be successful in this game if you manage to drain all of at least 1 of the 2 tokens from the contract, and allow the contract to report a "bad" price of the assets.
 
**Quick note**

Normally, when you make a swap with an ERC20 token, you have to `approve` the contract to spend your tokens for you. To keep with the syntax of the game, we've just added the `approve` method to the contract itself. So feel free to use `contract.approve(contract.address, <uint amount>)` instead of calling the tokens directly, and it will automatically approve spending the two tokens by the desired amount. Feel free to ignore the `SwappableToken` contract otherwise.

_Hint:_

1. How is the price of the token calculated?
2. How does the `swap` method work?
3. How do you `approve` a transaction of an ERC20?

## What will you learn?

1. Solidity Security Consideration
2. **Underflow** and **Overflow** in use of unsigned integers

## What is the most difficult challenge?

**You won't get success to attack if the target contract has been complied in Solidity 0.8.0 or uppper** 🤔

> [**Solidity v0.8.0 Breaking Changes**](https://docs.soliditylang.org/en/v0.8.5/080-breaking-changes.html?highlight=underflow#silent-changes-of-the-semantics)
>
> Arithmetic operations revert on **underflow** and **overflow**. You can use `unchecked { ... }` to use the previous wrapping behaviour.
>
> Checks for overflow are very common, so we made them the default to increase readability of code, even if it comes at a slight increase of gas costs.

I had tried to do everything in Solidity 0.8.5 at first time, but it didn't work, as it reverted transactions everytime it met underflow.

Finally, I found that Solidity included those checks by defaults while using sliencely more gas.

So, don't you need to use [`SafeMath`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol)?

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Token {
  mapping(address => uint256) balances;
  uint256 public totalSupply;

  constructor(uint256 _initialSupply) public {
    balances[msg.sender] = totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }
}

```

## Configuration

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

## Test and Attack!💥

### Run Tests

```
truffle develop
test
```

You should take ownership of the target contract successfully.

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Hacker
    √ should steal countless of tokens (377ms)


  1 passing (440ms)

```
