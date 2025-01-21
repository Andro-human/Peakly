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
        string[] options;
        uint256 betAmount;
        string[] availableOptions;
        bool resolved;
    }

    mapping(uint256 => Wager) public wagers;
    uint256 public numberOfWagers = 0;

    function createWager(
        string memory _title,
        string memory _description,
        uint256 _deadline,
        string memory _image,
        uint256 _betAmount,
        string[] memory _availableOptions,
        string memory _ownerOption
    ) public payable returns (uint256) {
        require(_deadline > 0, "Deadline must be greater than zero days.");
        require(_betAmount > 0, "Bet amount must be greater than zero.");
        require(_availableOptions.length > 0, "There must be at least one available option.");
        require(msg.value == _betAmount, "Owner must send the correct bet amount.");

        bool validOwnerOption = false;
        for (uint256 i = 0; i < _availableOptions.length; i++) {
            if (keccak256(bytes(_availableOptions[i])) == keccak256(bytes(_ownerOption))) {
                validOwnerOption = true;
                break;
            }
        }
        require(validOwnerOption, "Owner's chosen option is invalid.");

        Wager storage wager = wagers[numberOfWagers++];

        wager.owner = msg.sender;
        wager.title = _title;
        wager.description = _description;
        wager.deadline = block.timestamp + (_deadline * 1 days);
        wager.totalAmount = msg.value;
        wager.image = _image;
        wager.betAmount = _betAmount;
        wager.availableOptions = _availableOptions;
        wager.resolved = false;

        wager.participants.push(msg.sender);
        wager.options.push(_ownerOption);

        return numberOfWagers - 1;
    }

    function participateToWager(uint256 _id, string memory _option) public payable {
        require(_id < numberOfWagers, "Invalid wager ID.");
        require(block.timestamp < wagers[_id].deadline, "The wager has expired.");
        require(!wagers[_id].resolved, "The wager has already been resolved.");

        Wager storage wager = wagers[_id];

        require(msg.value == wager.betAmount, "Incorrect bet amount.");
        
        for (uint256 i = 0; i < wager.participants.length; i++) {
            require(wager.participants[i] != msg.sender, "You have already participated.");
        }

        bool validOption = false;
        for (uint256 i = 0; i < wager.availableOptions.length; i++) {
            if (keccak256(bytes(wager.availableOptions[i])) == keccak256(bytes(_option))) {
                validOption = true;
                break;
            }
        }
        require(validOption, "Invalid option chosen.");

        wager.participants.push(msg.sender);
        wager.options.push(_option);
        wager.totalAmount += msg.value;
    }

    function resolveWager(uint256 _id, string memory winningOption) public {
        require(_id < numberOfWagers, "Invalid wager ID.");
        Wager storage wager = wagers[_id];
        require(msg.sender == wager.owner, "Only the wager owner can resolve the wager.");
        require(!wager.resolved, "The wager has already been resolved.");

        wager.resolved = true;

        address[] memory winners;
        uint256 winnerCount = 0;

        for (uint256 i = 0; i < wager.participants.length; i++) {
            if (keccak256(bytes(wager.options[i])) == keccak256(bytes(winningOption))) {
                winnerCount++;
            }
        }

        require(winnerCount > 0, "No participants chose the winning option.");
        winners = new address[](winnerCount);

        uint256 index = 0;
        for (uint256 i = 0; i < wager.participants.length; i++) {
            if (keccak256(bytes(wager.options[i])) == keccak256(bytes(winningOption))) {
                winners[index] = wager.participants[i];
                index++;
            }
        }

        uint256 winnerShare = wager.totalAmount / winnerCount;
        for (uint256 i = 0; i < winners.length; i++) {
            (bool sent, ) = payable(winners[i]).call{value: winnerShare}("");
            require(sent, "Failed to send Ether to the winner.");
        }
    }

    function getParticipants(uint256 _id)
        public
        view
        returns (address[] memory, string[] memory)
    {
        require(_id < numberOfWagers, "Invalid wager ID.");
        Wager storage wager = wagers[_id];
        return (wager.participants, wager.options);
    }

    function getWagerDetails(uint256 _id)
        public
        view
        returns (
            uint256 id,
            address owner,
            string memory title,
            string memory description,
            uint256 deadline,
            uint256 totalAmount,
            string memory image,
            bool resolved,
            uint256 betAmount,
            string[] memory availableOptions
        )
    {
        require(_id < numberOfWagers, "Invalid wager ID.");
        Wager storage wager = wagers[_id];
        return (
            _id,
            wager.owner,
            wager.title,
            wager.description,
            wager.deadline,
            wager.totalAmount,
            wager.image,
            wager.resolved,
            wager.betAmount,
            wager.availableOptions
        );
    }

    function getAllWagersExceptOwn() public view returns (uint256[] memory, Wager[] memory) {
        uint256 wagerCount = numberOfWagers;
        uint256 resultCount = 0;

        for (uint256 i = 0; i < wagerCount; i++) {
            if (wagers[i].owner != msg.sender) {
                resultCount++;
            }
        }

        uint256[] memory ids = new uint256[](resultCount);
        Wager[] memory result = new Wager[](resultCount);
        uint256 index = 0;
        for (uint256 i = 0; i < wagerCount; i++) {
            if (wagers[i].owner != msg.sender) {
                ids[index] = i;
                result[index] = wagers[i];
                index++;
            }
        }

        return (ids, result);
    }

    function getAllWagersCreatedByMe() public view returns (uint256[] memory, Wager[] memory) {
        uint256 wagerCount = numberOfWagers;
        uint256 resultCount = 0;

        for (uint256 i = 0; i < wagerCount; i++) {
            if (wagers[i].owner == msg.sender) {
                resultCount++;
            }
        }

        uint256[] memory ids = new uint256[](resultCount);
        Wager[] memory result = new Wager[](resultCount);
        uint256 index = 0;
        for (uint256 i = 0; i < wagerCount; i++) {
            if (wagers[i].owner == msg.sender) {
                ids[index] = i;
                result[index] = wagers[i];
                index++;
            }
        }

        return (ids, result);
    }
}
