pragma solidity ^0.4.8;
// https://www.ethereum.org/token
contract Owned {

  address public owner;
  bool transferred; //10.04

  function Owned() {
    owner = msg.sender;
    transferred = false; //10.04
  }
  
  //10.04
  // modifier onlyLender {
  //   if (requestFilled = true) throw;
  //   _;
  // }

  //10.04
  function transferToLender(address lender) {
    owner = lender;
    transferred = true;
  }

  modifier onlyOwner {
    if (msg.sender != owner) throw;
    _;
  }

  function transferOwnership(address newOwner) onlyOwner {
    owner = newOwner;
  }
}