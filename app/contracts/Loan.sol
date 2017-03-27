pragma solidity ^0.4.8;
import "Mortal.sol";

//24.03
//added repay field and functions

contract Loan is Mortal {

	uint public amt;
	uint public rpy;

	function Loan (uint _amt, uint _rpy) payable {
		amt = _amt;
		rpy = _rpy;
	}

	//24.03
	//seems its not required because of automagical public field
/*	function getAmt() constant returns (uint) {
		return amt;
	}*/

	function setAmt(uint _amt) {
		amt = _amt;
	}

	function setRpy(uint _rpy) {
		rpy = _rpy;
	}

	function() payable {
	}
}