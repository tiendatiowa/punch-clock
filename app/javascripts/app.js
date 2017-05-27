var punchClock;
var owner;
var piEvent;
var poEvent;

window.onload = function() {
    var accounts = getAllAccounts();
    // Note: the defaultAccount must be the owner of the contract, so that we can perform actions with this account
    web3.eth.defaultAccount = accounts[0];
    var allAccountTxt = "";
    for (i = 0; i < accounts.length; i++) { 
        allAccountTxt += accounts[i] + "<br>";
    }
    document.getElementById("allAccounts").innerHTML = allAccountTxt;

    PunchClock.new({
        from: web3.eth.defaultAccount, 
        gas: 4712388,
        gasPrice: 100000000000
    }).then(function(pc) {
        punchClock = pc;
        setupEventListeners();
        return pc.getOwner();
    }).then(function(owner) {
        this.owner = owner;
        document.getElementById("owner").innerHTML = this.owner;
    })
}

function punchIn() {
    var member = document.getElementById("piMember").value;
    var ts = getCurrentTime();
    console.log("punching member " + member + " in with time = " + ts);
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

function setupEventListeners() {
    piEvent = punchClock.PunchedIn();
    piEvent.watch(function(error, result) {
        if (error) {
            alert("Failed to punch in. Error = " + printAll(error));
        } else {
            alert("Punched in successfully. Result = " + printAll(result)); 
        }
    })
    poEvent = punchClock.PunchedOut();
    poEvent.watch(function(error, result) {
        if (error) {
            alert("Failed to punch out. Error = " + printAll(error));
        } else {
            alert("Punched out successfully. Result = " + printAll(result)); 
        }
    });
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
