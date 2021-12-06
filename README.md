# Solidity Game - DEX Attack

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), Dex Level_

Please see [DexTwo](https://github.com/maAPPsDEV/dex-two-attack) for another Dex game.

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

1. ERC20
2. SWAP

## What is the most difficult challenge?

### DEX 🤑

The idea of this game is that flash loan attacks are rampant in the DeFi world, and having some experience with some of the price issues is going to be a must for up and coming solidity developers.

Basically, the Dex is a really crappy uniswap. It reports a price based on liquidity pools, and a user can use this to flip back and forth and eventually drain the dex of the liquidity pools.

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Dex {
  using SafeMath for uint256;
  address public token1;
  address public token2;

  constructor(address _token1, address _token2) public {
    token1 = _token1;
    token2 = _token2;
  }

  function swap(
    address from,
    address to,
    uint256 amount
  ) public {
    require((from == token1 && to == token2) || (from == token2 && to == token1), "Invalid tokens");
    require(IERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
    uint256 swap_amount = get_swap_price(from, to, amount);
    IERC20(from).transferFrom(msg.sender, address(this), amount);
    IERC20(to).approve(address(this), swap_amount);
    IERC20(to).transferFrom(address(this), msg.sender, swap_amount);
  }

  function add_liquidity(address token_address, uint256 amount) public {
    IERC20(token_address).transferFrom(msg.sender, address(this), amount);
  }

  function get_swap_price(
    address from,
    address to,
    uint256 amount
  ) public view returns (uint256) {
    return ((amount * IERC20(to).balanceOf(address(this))) / IERC20(from).balanceOf(address(this)));
  }

  function approve(address spender, uint256 amount) public {
    SwappableToken(token1).approve(spender, amount);
    SwappableToken(token2).approve(spender, amount);
  }

  function balanceOf(address token, address account) public view returns (uint256) {
    return IERC20(token).balanceOf(account);
  }
}

contract SwappableToken is ERC20 {
  constructor(
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) public ERC20(name, symbol) {
    _mint(msg.sender, initialSupply);
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

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Hacker
    √ should check game state (482ms)
Start price manipulating...
Swap price: TKN2 -> TKN1 - 10
Balances: TKN1/DEX - 90, TKN2/DEX - 110, TKN1/HACKER - 20, TKN2/HACKER - 0
Swap price: TKN1 -> TKN2 - 24
Balances: TKN1/DEX - 110, TKN2/DEX - 86, TKN1/HACKER - 0, TKN2/HACKER - 24
Swap price: TKN2 -> TKN1 - 30
Balances: TKN1/DEX - 80, TKN2/DEX - 110, TKN1/HACKER - 30, TKN2/HACKER - 0
Swap price: TKN1 -> TKN2 - 41
Balances: TKN1/DEX - 110, TKN2/DEX - 69, TKN1/HACKER - 0, TKN2/HACKER - 41
Swap price: TKN2 -> TKN1 - 65
Balances: TKN1/DEX - 45, TKN2/DEX - 110, TKN1/HACKER - 65, TKN2/HACKER - 0
Swap price: TKN1 -> TKN2 - 110
Balances: TKN1/DEX - 90, TKN2/DEX - 0, TKN1/HACKER - 20, TKN2/HACKER - 110
    √ should drain the dex (8265ms)


  2 passing (9s)

```
