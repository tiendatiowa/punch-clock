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
  it("punch in the second account", function() {
      var pc;
      var ts = 1490196677; 
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
          pc.punchIn(accounts[1], ts);
      }).then(function() {
          return pc.getPunchCardsOf(accounts[1]);
      }).then(function(punchCards) {
          assert.equal(punchCards.length, 1, "There should be one punch card for the second account");
          return punchCards[0];
      }).then(function(card) {
          assert.equal(card[0], ts, "Time in should be correct");
          assert.equal(card[1], 0, "Time out should be zero");
      })
  });
  it("punch in the second account again will only change the in time", function() {
      var pc;
      var ts = 1490196678; 
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
          pc.punchIn(accounts[1], ts);
      }).then(function() {
          return pc.getPunchCardsOf(accounts[1]);
      }).then(function(punchCards) {
          assert.equal(punchCards.length, 1, "There should be one punch card for the second account");
          return punchCards[0];
      }).then(function(card) {
          assert.equal(card[0], ts, "Time in should be correct");
          assert.equal(card[1], 0, "Time out should be zero");
      })
  });
  it("punch out the second account", function() {
      var pc;
      var ts = 1490196680; 
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
          pc.punchOut(accounts[1], ts);
      }).then(function() {
          return pc.getPunchCardsOf(accounts[1]);
      }).then(function(punchCards) {
          assert.equal(punchCards.length, 1, "There should be one punch card for the second account");
          return punchCards[0];
      }).then(function(card) {
          assert.equal(card[1], ts, "Time out should be correct");
      })
  });
  it("punch in and out the second account two more times", function() {
      var pc;
      var ts = 1490196682; 
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
          pc.punchIn(accounts[1], ts);
      }).then(function() {
          pc.punchOut(accounts[1], ts);
      }).then(function() {
          pc.punchIn(accounts[1], ts);
      }).then(function() {
          pc.punchOut(accounts[1], ts);
      }).then(function() {
          return pc.getPunchCardsOf(accounts[1]);
      }).then(function(punchCards) {
          assert.equal(punchCards.length, 3, "There should be three punch cards for the second account");
      })
  });
  it("remove the second account", function() {
      var pc;
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
      }).then(function() {
          pc.removeAdmin(accounts[1]);
      }).then(function() {
          return pc.isAdmin(accounts[1]);
      }).then(function(isAdmin) {
          assert.equal(isAdmin, false, "The second account must not be an admin anymore");
      })
  });
  it("remove the third account", function() {
      var pc;
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
      }).then(function() {
          pc.removeMember(accounts[2]);
      }).then(function() {
          return pc.isMember(accounts[2]);
      }).then(function(isMember) {
          assert.equal(isMember, false, "The third account must not be a member anymore");
      })
  });
  it("remove admin via removeMember() method", function() {
      var pc;
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
      }).then(function() {
          pc.addAdmin(accounts[2]);
      }).then(function() {
          return pc.isAdmin(accounts[2]);
      }).then(function(isAdmin) {
          assert.equal(isAdmin, true, "The third account must be an admin");
      }).then(function() {
          pc.removeMember(accounts[2]);
      }).then(function() {
          return pc.isMember(accounts[2]);
      }).then(function(isMember) {
          assert.equal(isMember, false, "The third account must not be a member anymore");
      }).then(function() {
          return pc.isAdmin(accounts[2]);
      }).then(function(isAdmin) {
          assert.equal(isAdmin, false, "The third account must not be an admin anymore");
      })
  });
  it("getAllAdmins() after removeAdmin()", function() {
      var pc;
      return PunchClock.deployed().then(function(instance) {
          pc = instance;
      }).then(function() {
          pc.addAdmin(accounts[2]);
      }).then(function() {
          return pc.isAdmin(accounts[2]);
      }).then(function(isAdmin) {
          assert.equal(isAdmin, true, "The third account must be an admin");
      }).then(function() {
          pc.removeMember(accounts[2]);
      }).then(function() {
          return pc.isAdmin(accounts[2]);
      }).then(function(isAdmin) {
          assert.equal(isAdmin, false, "The third account must not be an admin anymore");
      }).then(function() {
          return pc.getAllAdmins();
      }).then(function(admins) {
          // The returned array will look somewhat like this:
          // [ '0x58678dcf1ce3d0744d1a24c3146b7d3cbddbd5ed',
          //   '0x0000000000000000000000000000000000000000',
          //   '0x0000000000000000000000000000000000000000',
          //   '0x0000000000000000000000000000000000000000' ]
          // All of the "0x000..00" represent remove admins
          var validAdmins = 0;
          for (var i = 0; i < admins.length; i++) {
              if (admins[i] != "0x0000000000000000000000000000000000000000") {
                  validAdmins++;
              }
          }
          assert.equal(validAdmins, 1, "There should be only one admin");
      }).then(function() {
          return pc.getAllMembers();
      }).then(function(members) {
          var validMembers = 0;
          for (var i = 0; i < members.length; i++) {
              if (members[i] != "0x0000000000000000000000000000000000000000") {
                  validMembers++;
              }
          }
          assert.equal(validMembers, 1, "There should be only one member");
      })
  });
  it("change owner", function(){
      var pc;
      return PunchClock.new().then(function(instance) {
          pc = instance;
          return pc.getOwner();
      }).then(function(owner) {
          assert.equal(owner, accounts[0], "the owner should be the first account");
          pc.changeOwner(accounts[1]);
      }).then(function() {
          return pc.getOwner();
      }).then(function(owner) {
          assert.equal(owner, accounts[1], "the owner should be the second account");
      }).then(function() {
          return pc.isAdmin(accounts[1]);
      }).then(function(isAdmin) {
          assert.equal(isAdmin, true, "the new owner should be an admin");
      })
  });
  it("destroy() should kill the contract", function(){
      var pc;
      return PunchClock.new().then(function(instance) {
          pc = instance;
          return pc.getOwner();
      }).then(function(owner) {
          assert.equal(owner, accounts[0], "the owner should be the first account");
          pc.destroy();
      }).then(function() {
          return pc.getOwner();
      }).then(function(owner) {
          assert.equal(owner, "0x", "the owner should be cleared");
      })
  });
});
