var DappToken = artifacts.require("./DappToken");

contract('DappToken', function(accounts){
    var tokenInstance;

    it('initialize the contact with the correct value', function(){})

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
});
