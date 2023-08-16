var DappToken = artifacts.require('./DappToken.sol');
var DappTokenSale = artifacts.require('./DappTokenSale.sol');

contract('DappTokenSale', function(accounts){
    var tokenInstance;
    var tokenSaleInstance;
    var admin = accounts[0];
    var buyer = accounts[1]; 
    var tokenPrice;
    var tokenPrice = 1000000000000000; // in wei
    var tokensAvailable = 750000;
    var numberOfTokens;
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
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return DappTokenSale.deployed();
        }).then(function(instance){
            tokenSaleInstance = instance;
            //Provision 75% of all tokens to the token sale
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
        }).then(function(receipt){
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice  });
        }).then(function(receipt){
            return tokenSaleInstance.tokenSold();
        }).then(function(amount){
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of token sold');
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance){
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message, 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice  });
        }).then(assert.fail).catch(function(error){
            assert(error.message, 'cannot purchase more tokens than available');
        });
    });

    it('end token sale', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return DappTokenSale.deployed();
        }).then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.endSale({ from: buyer });
        }).then(assert.fail).catch(function(error){
            assert(error.message, 'must be admin to end sale');
            return tokenSaleInstance.endSale({ from: buyer });
        }).then(function(receipt){
            return tokenInstance.balanceOf(admin);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 999990, 'returns all unsold dapp tokens to admin ');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price){
            assert.equal(price.toNumber(), 0, 'token price was reset');
        });
    });
});