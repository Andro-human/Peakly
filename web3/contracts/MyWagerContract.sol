// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MyWagerContract {
    struct Wager {
        address owner;
        string title;
        string description;
        uint256 deadline;
        uint256 totalAmount;
        string image;
        address[] participants;
        uint256[] amount;
        uint256[] options;
        bool resolved;
    }

    mapping(uint256 => Wager) public wagers;
    uint256 public numberOfWagers = 0;

    function createWager(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(_deadline > 0, "Deadline must be greater than zero days.");

        Wager storage wager = wagers[numberOfWagers++];

        wager.owner = _owner;
        wager.title = _title;
        wager.description = _description;
        wager.deadline = block.timestamp + (_deadline * 1 days);
        wager.totalAmount = 0;
        wager.image = _image;
        wager.resolved = false;

        return numberOfWagers - 1;
    }

    function participateToWager(uint256 _id, uint256 _option) public payable {
        require(_id < numberOfWagers, "Invalid wager ID.");
        require(msg.value > 0, "You must send some Ether to participate.");

        Wager storage wager = wagers[_id];
        require(msg.sender != wager.owner, "Owner cannot participate in their own wager.");
        require(block.timestamp < wager.deadline, "The wager has expired.");
        require(!wager.resolved, "The wager has already been resolved.");

        for (uint256 i = 0; i < wager.participants.length; i++) {
            require(wager.participants[i] != msg.sender, "You have already participated in this wager.");
        }


        wager.participants.push(msg.sender);
        wager.amount.push(msg.value);
        wager.options.push(_option); 
        wager.totalAmount += msg.value;
    }

    function resolveWager(uint256 _id, uint256 winningOption) public {
        require(_id < numberOfWagers, "Invalid wager ID.");

        Wager storage wager = wagers[_id];
        require(msg.sender == wager.owner, "Only the wager owner can resolve the wager.");
        // require(block.timestamp >= wager.deadline, "Wager cannot be resolved before the deadline.");
        require(!wager.resolved, "The wager has already been resolved.");

        wager.resolved = true;

        address[] memory winners;
        uint256 winnerCount = 0;

        // Determine winners based on the winning option
        for (uint256 i = 0; i < wager.participants.length; i++) {
            if (wager.options[i] == winningOption) {
                winnerCount++;
            }
        }

        require(winnerCount > 0, "No participants chose the winning option.");
        winners = new address[](winnerCount);

        uint256 index = 0;
        for (uint256 i = 0; i < wager.participants.length; i++) {
            if (wager.options[i] == winningOption) {
                winners[index] = wager.participants[i];
                index++;
            }
        }

        // Distribute winnings to winners
        uint256 winnerShare = wager.totalAmount / winnerCount;

        for (uint256 i = 0; i < winners.length; i++) {
            (bool sent, ) = payable(winners[i]).call{value: winnerShare}("");
            require(sent, "Failed to send Ether to the winner.");
        }
    }

    function getParticipants(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory, uint256[] memory)
    {
        require(_id < numberOfWagers, "Invalid wager ID.");
        Wager storage wager = wagers[_id];
        return (wager.participants, wager.amount, wager.options);
    }

    function getWagerDetails(uint256 _id)
        public
        view
        returns (
            address owner,
            string memory title,
            string memory description,
            uint256 deadline,
            uint256 totalAmount,
            string memory image,
            bool resolved
        )
    {
        require(_id < numberOfWagers, "Invalid wager ID.");
        Wager storage wager = wagers[_id];
        return (
            wager.owner,
            wager.title,
            wager.description,
            wager.deadline,
            wager.totalAmount,
            wager.image,
            wager.resolved
        );
    }
}
