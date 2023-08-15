pragma solidity ^0.4.2;

contract DappToken{
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf; 

    function DappToken(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}