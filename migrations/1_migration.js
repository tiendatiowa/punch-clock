var PunchClock = artifacts.require("./PunchClock.sol");


module.exports = function(deployer) {
    deployer.deploy(PunchClock);
};
