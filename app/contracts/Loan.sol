pragma solidity ^0.4.8;
import "Mortal.sol";

//24.03
//added repay field and functions

contract Loan is Mortal {

	uint public amt;
	uint public rpy;
	address public borrower;
	bool public taken;

	function Loan (uint _amt, uint _rpy) payable {
		amt = _amt;
		rpy = _rpy;
		taken = false;
	}

	//24.03
	//seems its not required because of automagical public field
/*  function getAmt() constant returns (uint) {
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

	function setBorrower() returns (bool) {
		if (taken == false) {
			borrower = msg.sender;
			taken = true;
			return borrower.send(this.balance);
		}
		else return false;
	}

	//02.04 added as part of experimentation
	function sendToBorrower() returns (bool) {
		address target = msg.sender;
		return target.send(this.balance);
	}

}