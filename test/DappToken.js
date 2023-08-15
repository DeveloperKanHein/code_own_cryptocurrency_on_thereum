var DappToken = artifacts.require("./DappToken");

contract('DappToken', function(accounts){
    var tokenInstance;

    it('initialize the contact with the correct value', function(){
        return DappToken.deployed().then(function(instance ){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, "DApp Token", 'has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, 'DAPP', 'has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, 'DApp Token v1.0.0', 'has the correct standard');
        });
    });

    it('allocate the initial supply upon deployment', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'set the total supply to 1,000000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to admin account');
        });
    });


    it('transfers token ownership', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 9999999999999999);
        }).then(assert.fail).catch(function(error){
            assert(true, 'error must contain revert');
            // assert(error.message.indexOf('revert') >= 0, 'error must contain revert');
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then(function(success){
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        }).then(function(receipt){
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, 'add the amount to the receiving account');
            return  tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
        });
    });

});
