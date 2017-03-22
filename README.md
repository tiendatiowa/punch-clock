# punch-clock

Punch clock ("Chấm công" in Vietnamese) is a simple smart contract to keep track of people in and out time.

# Usage and cost estimates 

(Note: gas price = 0.00000002 Ether, 1 ETH = $40 in these calculations)

* Deploy the contract
  
Running `truffle migrate` to deploy the contract, cost 1,037,583 gas (0.02075166 ETH, or $0.83)

* Create a new instance of the contract
  
Running `PunchClock.new("0xf6f80ec1af70453428615abb075b1b525bac17b6")` cost 1,037,583 gas (0.02075166 ETH, or $0.83)

* Add an admin to the contract
  
Running `pc.addAdmin("0x9fe37de4c8645ce7370009a016b35c946d05ccd2")` cost 114,305 gas (0.0022861 ETH, or $0.09)

* Add a member to the contract
  
Running `pc.addMember("0xf3da29ea01acbb909640bbb34dc90fbda3770d08")` cost 68,879 gas (0.00137758 ETH, or $0.06)

* Punch in and out a member
  
Running `pc.punchIn("0xf3da29ea01acbb909640bbb34dc90fbda3770d08", 1490196679)` cost 69,406 gas (0.00138812 ETH, or $0.06)
  
Running `pc.punchOut("0xf3da29ea01acbb909640bbb34dc90fbda3770d08", 1490196680)` cost 70,487 gas (0.00140974 ETH, or $0.06)

* At a summary: a company has 10 admins, 100 employees, working 26 days a month, each person punch in and out once a day, then the estimated cost:
    * to setup a contract:
        $0.83 (contract creation) + 10 * $0.09 (add one admin) + 100 * $0.06 (add one member) = $7.73
    * to punch in and out each month:
        110 * ($0.06 + $0.06) * 26 = $343.2
    * retrieving the data (i.e. invoking getter methods) is free

# Development

* Install [truffle](https://truffle.readthedocs.io/en/latest/) and [testrpc](https://github.com/ethereumjs/testrpc)
* Open Terminal and run `testrpc` in one console
* Open another console and:
    * Compile the code
        ```
        $ truffle compile
        ```
    * Run unit tests
        ```
        $ truffle test 
        ``` 
    * Deploy to test network
        ```
        $ truffle migrate
        ```
    * Test the code in truffle console
        ```
        $ truffle console
        $> var pc
        $> PunchClock.deployed().then(function(instance) { pc = instance; })
        $> var owner
        $> pc.getOwner().then(function(o) { owner = o; })
        $> pc.punchIn(owner, 1490196677).then(function() { pc.punchOut(owner, 1490196679); })
        $> var cards
        $> pc.getPunchCardsOf(owner).then(function(c) { cards = c; })
        $> cards
        ```
        You should see a result like this (Truffle v3.1.2 & TestRPC v3.0.3)
        ```
        [ [ { [String: '1490196677'] s: 1, e: 9, c: [Object] },
            { [String: '1490196679'] s: 1, e: 9, c: [Object] } ] ]
        ```
        Note: the output above looks weird, but it's expected. You can run these command to verify:
        ```
        $ cards[0][0] == 1490196677 // return true
        $ cards[0][1] == 1490196679 // return true
        ```

## License
Code released under the [Apache License 2.0](https://github.com/tiendatiowa/punch-clock/blob/master/LICENSE).
