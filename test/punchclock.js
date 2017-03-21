var PunchClock = artifacts.require("./PunchClock.sol");

contract('PunchClock', function(accounts) {
  it("should have the first account as the owner", function() {
    return PunchClock.deployed().then(function(instance) {
      return instance.getOwner();
    }).then(function(owner) {
      assert.equal(owner, accounts[0], "Should have the first account as the owner");
    });
  });
  it("should be able to add the second account as an admin", function() {
    var pc;
    return PunchClock.deployed().then(function(instance) {
        pc = instance;
        pc.addAdmin(accounts[1]);
    }).then(function() {
        return pc.getAllAdmins();
    }).then(function(admins) {
        assert.equal(admins.length, 2, "There should be two admins");
    })
  });
  it("adding second account as admin again won't increase the number of admins", function() {
    var pc;
    return PunchClock.deployed().then(function(instance) {
        pc = instance;
        pc.addAdmin(accounts[1]);
    }).then(function() {
        return pc.getAllAdmins();
    }).then(function(admins) {
        assert.equal(admins.length, 2, "There should still be only two admins");
    })
  });

  it("should be able to add the third account as a member", function() {
    var pc;
    return PunchClock.deployed().then(function(instance) {
        pc = instance;
        pc.addMember(accounts[2]);
    }).then(function() {
        return pc.getAllMembers();
    }).then(function(members) {
        assert.equal(members.length, 3, "There should be three members");
    })
  });
  
  it("adding the third account again won't increase the number of members", function() {
    var pc;
    return PunchClock.deployed().then(function(instance) {
        pc = instance;
        pc.addMember(accounts[2]);
    }).then(function() {
        return pc.getAllMembers();
    }).then(function(members) {
        assert.equal(members.length, 3, "There should still be only three members");
    })
  });
  /*
  it("punch in the second account", function() {
      var pc;
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
          var ts = Math.round((new Date()).getTime() / 1000);
          return pc.punchIn(accounts[1], ts);
      }).then(function(cards) {
          //return pc.getPunchCardsOf(accounts[1]);
          console.log(cards);
          return pc.punchClock
      }).then(function(punchCards) {
          var tmp = punchCards[accounts[1]];
          console.log(tmp.length);
          //assert.equal(punchCards.length, 1, "There should be one punch card for the second account");
      })
  });
  */
});
