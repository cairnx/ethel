pragma solidity ^0.4.8;
// adapted from https://www.ethereum.org/token
contract Owned {

  address public owner;
  bool transferred;

  function Owned() {
    owner = msg.sender;
    transferred = false;
  }

  function transferToLender(address lender) {
    if (transferred == false) {
      owner = lender;
      transferred = true;
    }
  }

  modifier onlyOwner {
    if (msg.sender != owner) throw;
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    owner = newOwner;
  }
}