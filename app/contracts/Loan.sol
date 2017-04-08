
pragma solidity ^0.4.8;
import "Mortal.sol";

//24.03
//added repay field and functions

contract Loan is Mortal {

	uint public amt;
	uint public rpy;
	address public borrower;
	bool public taken;
	bool public repaid;

	function Loan(uint _amt, uint _rpy) payable {
		taken = false;
		repaid = false;
		amt = _amt;
		rpy = _rpy;
	}

	function() payable {
	}

	//05.04
	function setBorrower() returns (bool) {
		if (taken == false) {
			borrower = msg.sender;
			taken = true;
			return borrower.send(this.balance);
		}
		else return false;
	}

	//08.04
	function repay() payable returns (bool) {
		if (repaid == false && msg.value == rpy && msg.sender == borrower) {
			repaid = true;
			return repaid;
		}
		else {
			bool refund = msg.sender.send(msg.value);
			return false;
		}
	}

	//02.04 added as part of experimentation
	function sendToBorrower() returns (bool) {
		address target = msg.sender;
		return target.send(this.balance);
	}

}