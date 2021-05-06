// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2 <0.8.0;


import "./Dependencies.sol";
import "./Ticket.sol";

contract TicketFactory {
    using Counters for Counters.Counter;

    event EventCreated(uint indexed id, string eventName);

    Counters.Counter private _eventsIds;
    Counters.Counter private _contractsIds;

    address payable public owner;

    struct PublicEvent {
        address eventAddress;
        string eventName;
        string eventDescription;
        string eventPosterURI;
        string ticketSymbol;
        uint ticketPrice;
        uint startAt;
        uint eventDuration;
        uint maxTickets;
        bool isExists;
    }

    PublicEvent[] public eventsList;
    mapping (uint => TicketOffice) public ticketOffices;
    mapping (address => bool) members;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner only");
        _;
    }

    modifier eventExists(uint _eventID) {
        require(eventsList[_eventID].isExists, "Event not found");
        _;
    }
    
    modifier onlyBy(address _account) {
        require(
            msg.sender == _account,
            "Sender not authorized."
        );
        // Do not forget the "_;"! It will
        // be replaced by the actual function
        // body when the modifier is used.
        _;
    }

    function addEvent(
        string memory _eventName,
        string memory _eventDescription,
        string memory _eventPosterURI,
        string memory _ticketSymbol,
        uint _ticketPrice,
        uint _startAt,
        uint _eventDuration,
        uint _maxTickets
    ) public onlyOwner {
        uint eventID = _eventsIds.current();
        address factory = address(this);
        TicketOffice _ticketOffice = new TicketOffice(
            owner, factory, _eventName, _ticketSymbol, _ticketPrice, _maxTickets, eventID
        );
        ticketOffices[eventID] = _ticketOffice;
        PublicEvent memory newEvent = PublicEvent(
            address(_ticketOffice),
            _eventName,
            _eventDescription,
            _eventPosterURI,
            _ticketSymbol,
            _ticketPrice,
            _startAt,
            _eventDuration,
            _maxTickets,
            true
        );
        if (block.timestamp < _startAt && _eventDuration != 0) {
            eventsList.push(newEvent);
        }
        emit EventCreated(eventID, _eventName);
        _eventsIds.increment();
    }

    function changeOwner(address payable _newOwner) public onlyBy(owner) {
        owner = _newOwner;
    }

    function countEvents() public view returns (uint) {
        return eventsList.length;
    }


}



