// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract TokenSwap {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public conversionRate;

    constructor(
        address _tokenA,
        address _tokenB,
        uint256 _conversionRate
    ) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);

        conversionRate = _conversionRate * 10 ** 18;
    }

    function checkContractBalance()
    external
    view
    returns (uint256 tA, uint256 tB)
    {
        tA = tokenA.balanceOf(address(this));
        tB = tokenB.balanceOf(address(this));
    }

    function swapAB(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(
            tokenA.allowance(msg.sender, address(this)) >= _amount,
            "token A allowance too low"
        );
        require(
            tokenA.balanceOf(msg.sender) >= _amount,
            "you don't have enough tokens"
        );

        IERC20(tokenA).transferFrom(msg.sender, address(this), _amount);
        IERC20(tokenB).transfer(msg.sender, _amount * conversionRate);
    }

    function swapBA(uint256 _amount) external {
        require(msg.sender != address(0), "address zero detected");
        require(
            tokenB.allowance(msg.sender, address(this)) >= _amount,
            "token B allowance too low"
        );
        require(
            tokenB.balanceOf(msg.sender) >= _amount,
            "you don't have enough tokens"
        );

        IERC20(tokenB).transferFrom(msg.sender, address(this), _amount);
        IERC20(tokenA).transfer(msg.sender, _amount / conversionRate);
    }
}
