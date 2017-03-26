pragma solidity ^0.4.8;
import "Owned.sol";
contract Mortal is Owned {
  //function to recover the funds on the contract 
  function kill() onlyOwner { selfdestruct(owner); }
}