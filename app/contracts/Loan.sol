pragma solidity ^0.4.8;
import "Mortal.sol";
import "LoanDB.sol";

//24.03
//added repay field and functions

contract Loan is Mortal {

	uint public amt;  //loan amount in wei
	uint public rpy;  //repayable amount in wei (principal + interest)
  uint public duration; //11.04 maturity
	uint public start;  //11.04
	uint public deadline; //11.04
	uint public repaidTime; //11.04

	int public minScore; //12.04 minimum credit score required to take offer

	address public borrower;

	bool public taken;  //has the loan offer been taken/request been filled
	bool public repaid;  //has the loan been repaid
	bool public request;  //true = request, false = offer

	LoanDB ldb; //11.04

  //constructor
	function Loan(uint _amt, uint _rpy, bool _request, uint _duration, int _minScore, address dbAddr) payable {
		taken = false;  //initialised loan has not been taken
		repaid = false;  //initialised loan has not been repaid
		amt = _amt;  //loan amount
		rpy = _rpy;  //repayable amount
		request = _request;  //true if request, false if offer
		duration = _duration;  //duration in days from start until deadline
		
		//set borrower to instantiator of loan
	  //remains constant thru loan lifecycle if reques
		//changed when taken if loan is offer
		borrower = msg.sender;
		
		ldb = LoanDB(dbAddr);  //set LoanDB address - required to retrieve borrower credit rating
		
		if (request == false) {
			minScore = _minScore;
		}
	}

  //12.04 marked for deletion - unsure
	function() payable {
	}

	//05.04
	//take loan offer
	function takeLoan() constant returns (bool) {
		int borrowerScore = ldb.getCreditScore(msg.sender);
		if (taken == false && borrowerScore >= minScore) {  //if loan is available and borrower meets minScore
			borrower = msg.sender;  //set borrower to function invoker
			setDeadline();  //set the deadline
			return borrower.send(this.balance);  //send the loan amount to the borrower
		}
		else return false;  //else do nothing
	}

	//08.04
	//repay loan - payable denotes that ether can be sent to the contract
	function repay() payable returns (bool) {
		//loan hasn't been repaid + repayment amount was sent in function call + function caller is the borrower
		if (repaid == false && msg.value == rpy && msg.sender == borrower) {
			repaid = true;  //loan has been repaid
			repaidTime = now;  //set timestamp for repayment
			return repaid;
		}
		else {
			return msg.sender.send(msg.value);  //if conditions not met, refund caller
		}
	}

	//10.04
	//fill loan request
	function fillRequest() payable returns (bool) {
		//if loan is a request and lender has sent the amount to the contract
		if (taken == false && request == true && msg.value == amt) {
			transferToLender(msg.sender);  //transfer ownership of the loan to the lender
			request = false;  //set request to false - loan behaves as a typical loan offer from here on out
			setDeadline();  //set the deadline timestamp
			return borrower.send(this.balance);  //send the loan amount from contract to borrower
		}
		else return msg.sender.send(msg.value);  //else, refund the lender
	}

	//11.04
	//set the loan deadline - private - only accessible internally to Loan.sol
	function setDeadline() private {
		start = now;  //timestamp of loan being taken/request filled
		deadline = start + (duration * 1 days);  //set the deadline timestamp
		taken = true;  //set loan taken/unavailable
	}

	//11.04 - test method - deprecated - marked for deletion - unecessary as set in constructor
	function setLdb(address addr) {
		ldb = LoanDB(addr);
	}

	//11.04 - getter for ldb address
	function getLdbAddr() constant returns (address) {
		return ldb;
	}

	//12.04 - credit rating getter for ls - returns credit rating of borrower
	function getCreditScore() constant returns (int) {
		if (request == true) {
			return ldb.getCreditScore(borrower);
		}
		return;
	}

	//11.04
/*	function checkPayment() only {
		if (taken == true && now > deadline && repaid == false) {

		}
	}*/

	//02.04 added as part of experimentation - marked for deletion - included in fillRequest and takeLoan
	function sendToBorrower() returns (bool) {
		address target = msg.sender;
		return target.send(this.balance);
	}

}