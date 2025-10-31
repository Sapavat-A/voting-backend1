// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool voted;
        address votedFor;
    }

    address public owner;
    bool public electionOpen;
    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidateCount;
    Candidate[] public candidateList;

    event CandidateAdded(uint indexed candidateId, string name);
    event VoteCasted(address indexed voter, uint indexed candidateId);
    event ElectionEnded();

    constructor() {
        owner = msg.sender;
        electionOpen = true;
        candidateCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier electionIsOpen() {
        require(electionOpen, "Election is closed");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
        candidateList.push(Candidate(candidateCount, _name, 0));
        emit CandidateAdded(candidateCount, _name);
    }

    function vote(uint _candidateId) public electionIsOpen {
        require(!voters[msg.sender].voted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        voters[msg.sender].voted = true;
        voters[msg.sender].votedFor = address(msg.sender);
        candidates[_candidateId].voteCount++;

        emit VoteCasted(msg.sender, _candidateId);
    }

    function getCandidate(uint _candidateId) public view returns (Candidate memory) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        return candidates[_candidateId];
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidateList;
    }

    function getResults() public view returns (Candidate[] memory) {
        return candidateList;
    }

    function endElection() public onlyOwner {
        electionOpen = false;
        emit ElectionEnded();
    }

    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter].voted;
    }
}
