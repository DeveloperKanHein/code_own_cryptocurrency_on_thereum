pragma solidity ^0.4.2;

import "./DappToken.sol";

contract DappTokenSale{
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell( address _buyer, uint256 _amount );

    function DappTokenSale(DappToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    //multiply
    function multiply(uint x, uint y) internal returns (uint z){
        return x * y;
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        if(msg.value == multiply(_numberOfTokens, tokenPrice)){
            if(tokenContract.balanceOf(this) >= _numberOfTokens){
                if(tokenContract.transfer(msg.sender, _numberOfTokens)){
                    tokenSold += _numberOfTokens;
                    Sell(msg.sender, _numberOfTokens);
                }
                
            }
        }
    }

    function endSale() public{
        if(msg.sender == admin){
            tokenContract.transfer(admin, tokenContract.balanceOf(this));
            selfdestruct(admin);
            
        }
    }
}