var DappTokenSale = artifacts.require('./DappTokenSale.sol');

contract('DappTokenSale', function(accounts){
    var tokenSaleInstance;
    var tokenPrice;
    var tokenPrice = 1000000000000000; // in wei
    var buyer = accounts[1]; 
    var numberOfTokens = 10;
    it('initialize the contract with the correct values', function(){
        return DappTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address){
            assert.notEqual(address, 0x0, 'has the contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address){
            assert.notEqual(address,0x0, 'has the correct contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price.toNumber(), tokenPrice, 'token price is correct');
        });
    });

    it('facilitates', function(){
        return DappTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice  });
        }).then(function(receipt){
            return tokenSaleInstance.tokenSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of token sold');
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message, 'msg.value must equal number of tokens in wei');
        });
    });
});