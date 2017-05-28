var punchClock;
var owner;
var piEvent;
var poEvent;
var allMembers;
var allAdmins;

window.onload = function() {
    var accounts = getAllAccounts();
    // Note: the defaultAccount must be the owner of the contract, so that we can perform actions with this account
    web3.eth.defaultAccount = accounts[0];
    document.getElementById("allAccounts").innerHTML = printAddresses(accounts);

    // Note: we'll use the instance created by 'truffle migrate --reset' command
    // Alternatively, you can create a new one every time by using:
    // PunchClock.new({
    //    from: web3.eth.defaultAccount, 
    //    gas: 4712388,
    //    gasPrice: 100000000000
    // })
    PunchClock.deployed().then(function(pc) {
        punchClock = pc;
        return pc.getOwner();
    }).then(function(owner) {
        this.owner = owner;
        document.getElementById("owner").innerHTML = this.owner;
    }).then(function() {
        setupEventListeners();
    }).then(function() {
        getAllAdmins();
    })
}

function addAdmin() {
    var admin = document.getElementById("addAdmin").value;
    console.log("adding admin = " + admin);
    punchClock.addAdmin(admin).then(function() {
        getAllAdmins();
    })
}

function removeAdmin() {
    var admin = document.getElementById("removeAdmin").value;
    punchClock.removeAdmin(admin).then(function() {
        getAllAdmins();
    })
}

function addMember() {
    var member = document.getElementById("addMember").value;
    punchClock.addMember(member).then(function() {
        getAllMembers();
    })
}

function removeMember() {
    var member = document.getElementById("removeMember").value;
    punchClock.removeMember(member).then(function() {
        getAllMembers();
    })
}

function punchIn() {
    var member = document.getElementById("piMember").value;
    var ts = getCurrentTime();
    punchClock.punchIn(member, ts);
}

function punchOut() {
    var member = document.getElementById("poMember").value;
    var ts = getCurrentTime();
    punchClock.punchOut(member, ts);
}

function getAllAccounts() {
    return web3.eth.accounts;
}

function getCurrentTime() {
    return Math.floor(Date.now() / 1000);
}

function handlePunching(error, result) {
}

function setupEventListeners() {
    punchClock.PunchedIn(function(error, result) {
        if (error) {
            alert("Failed to punch in. Error = " + printAll(error));
        } else {
            alert("Punched in successfully. Result = " + printAll(result)); 
            getAllPunchCards();
        }
    });
    punchClock.PunchedOut(function(error, result) {
        if (error) {
            alert("Failed to punch out. Error = " + printAll(error));
        } else {
            alert("Punched out successfully. Result = " + printAll(result)); 
            getAllPunchCards();
        }
    });
    punchClock.AdminAdded(function(error, result) {
        if (error) {
            alert("Failed to add admin. Error = " + printAll(error));
        } else {
            alert("Add admin successfully. Result = " + printAll(result)); 
            getAllAdmins();
        }
    });
    punchClock.AdminRemoved(function(error, result) {
        if (error) {
            alert("Failed to remove admin. Error = " + printAll(error));
        } else {
            alert("Remove admin successfully. Result = " + printAll(result)); 
            getAllAdmins();
        }
    });
    punchClock.MemberAdded(function(error, result) {
        if (error) {
            alert("Failed to add member. Error = " + printAll(error));
        } else {
            alert("Add member successfully. Result = " + printAll(result)); 
            getAllMembers();
        }
    });
    punchClock.MemberRemoved(function(error, result) {
        if (error) {
            alert("Failed to remove member. Error = " + printAll(error));
        } else {
            alert("Remove member successfully. Result = " + printAll(result)); 
            getAllMembers();
        }
    });
}

function sanitize(members) {
    var sanitized = [];
    for (i = 0; i < members.length; i++) {
        if (members[i] != "0x0000000000000000000000000000000000000000") {
            sanitized.push(members[i]);
        }
    }
    return sanitized;
}


function getAllAdmins() {
    document.getElementById("admins").innerHTML = "";
    punchClock.getAllAdmins().then(function(admins) {
        this.allAdmins = sanitize(admins);
        document.getElementById("admins").innerHTML = printAddresses(this.allAdmins);
    }).then(function() {
        getAllMembers();
    })
}

function getAllMembers() {
    document.getElementById("members").innerHTML = "";
    punchClock.getAllMembers().then(function(members) {
        this.allMembers = sanitize(members); 
        document.getElementById("members").innerHTML = printAddresses(this.allMembers);
    }).then(function() {
        getAllPunchCards();
    })
}

function getAllPunchCards() {
    document.getElementById("punchCards").innerHTML = "";

    // Note: need to handle processing of a list of Promise properly. This causes bug!
    for (i = 0; i < this.allMembers.length; i++) {
        var member = this.allMembers[i];
        punchClock.getPunchCardsOf(member).then(function(cards) {
            var resTxt = "Member: " + member + "<br>"
                for (j = 0; j < cards.length; j++) {
                    var card = cards[j];
                    resTxt += "In time: " + card[0] + ", out time: " + card[1] + "<br>";
                }
            document.getElementById("punchCards").innerHTML += resTxt;
        });
    }
}

function printAddresses(accounts) {
    var allAccountTxt = "";
    for (i = 0; i < accounts.length; i++) { 
        allAccountTxt += accounts[i] + "<br>";
    }
    return allAccountTxt;
}

function printAll(p) {
    var res = "[";
    for (var key in p) {
        if (p.hasOwnProperty(key)) {
            res += key + " -> " + p[key] + ", ";
        }
    }
    return res + "]";
}
