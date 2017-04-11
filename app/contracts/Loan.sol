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
	bool public request;

	function Loan(uint _amt, uint _rpy, bool _request) payable {
		taken = false;
		repaid = false;
		amt = _amt;
		rpy = _rpy;
		request = _request;
		borrower = msg.sender;
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

	//10.04
	function fillRequest() payable returns (bool) {
		if(request == true && msg.value == amt) {
			transferToLender(msg.sender);
			request = false;
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