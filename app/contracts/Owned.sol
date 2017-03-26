pragma solidity ^0.4.8;
// https://www.ethereum.org/token
contract Owned {

  address internal owner;

  function Owned() {
    owner = msg.sender;
  }

  modifier onlyOwner {
    if (msg.sender != owner) throw;
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    owner = newOwner;
  }
}