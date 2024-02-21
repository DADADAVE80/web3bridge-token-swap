// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenB is ERC20 {
    constructor(string memory _name, string memory _symbol, address _recipient, uint _totalSupply) ERC20(_name, _symbol) {
        _mint(_recipient, _totalSupply);
    }

    function mint(address _to, uint _amount) external {
        _mint(_to, _amount);
    }

    function approveSpender(address _spender, uint256 _amount) external {
        _approve(msg.sender, _spender, _amount);
    }
}