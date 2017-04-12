pragma solidity ^0.4.8;
import "Mortal.sol";
import "LoanDB.sol";

//24.03
//added repay field and functions

contract Loan is Mortal {

	uint public amt;
	uint public rpy;
	address public borrower;
	bool public taken;
	bool public repaid;
	bool public request;
	uint public duration; //11.04 maturity
	uint public start;  //11.04
	uint public deadline; //11.04
	uint public repaidTime; //11.04
	LoanDB ldb; //11.04

	function Loan(uint _amt, uint _rpy, bool _request, uint _duration) payable {
		taken = false;
		repaid = false;
		amt = _amt;
		rpy = _rpy;
		request = _request;
		duration = _duration;
		borrower = msg.sender;
	}

	function() payable {
	}

	//05.04
	function takeLoan() returns (bool) {
		if (taken == false) {
			borrower = msg.sender;
			//taken = true;
			//start = now;
			setDeadline();
			return borrower.send(this.balance);
		}
		else return false;
	}

	//08.04
	function repay() payable returns (bool) {
		if (repaid == false && msg.value == rpy && msg.sender == borrower) {
			repaid = true;
			repaidTime = now;
			return repaid;
		}
		else {
			return msg.sender.send(msg.value);
		}
	}

	//10.04
	function fillRequest() payable returns (bool) {
		if (request == true && msg.value == amt) {
			transferToLender(msg.sender);
			request = false;
			//taken = true;
			//start = now;
			setDeadline();
			return borrower.send(this.balance);
		}
		else return msg.sender.send(msg.value);
	}

	//11.04
	function setDeadline() private {
		if (taken == false) {
			start = now;
			deadline = start + (duration * 1 days);
			taken = true;
		}
	}

	//11.04
	function setLdb(address addr) {
		ldb = LoanDB(addr);
	}

	//11.04
	function getLdbAddr() constant returns (address) {
		return ldb;
	}

	//11.04
/*	function checkPayment() only {
		if (taken == true && now > deadline && repaid == false) {

		}
	}*/

	//02.04 added as part of experimentation
	function sendToBorrower() returns (bool) {
		address target = msg.sender;
		return target.send(this.balance);
	}

}