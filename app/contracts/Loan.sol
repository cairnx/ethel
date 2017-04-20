pragma solidity ^0.4.8;
import "Mortal.sol";
import "LoanDB.sol";

contract Loan is Mortal {

	uint public amt;  //loan amount in wei
	uint public rpy;  //repayable amount in wei (principal + interest)
  uint public duration; //duration in days
	uint public start;  //unix timestamp of loan being taken
	uint public deadline; //start + duration * 1 days = unix timestamp
	uint public repaidTime; //timestamp of loan repayment

	int public minScore; //minimum credit score required to take offer

	address public borrower; //borrower address

	bool public taken;  //true = taken, false = availa
	bool public repaid;  //true = repaid, false = unpaid
	bool public request;  //true = request, false = offer

	LoanDB ldb; //reference to LoanDB contract

  //constructor
	function Loan(uint _amt, uint _rpy, uint _duration, int _minScore, bool _request, address dbAddr) payable {

		taken = false;  //initialised loan has not been taken
		repaid = false;  //initialised loan has not been repaid
		amt = _amt;  //loan amount
		rpy = _rpy;  //repayable amount
		request = _request;  //true if request, false if offer
		duration = _duration;  //duration in days from start until deadline
		
		//defaults to creator of offer / request
	  //set to borrower when taken
		borrower = msg.sender;
		
		ldb = LoanDB(dbAddr);  //set LoanDB address - required to retrieve borrower credit rating
		
		if (request == false) {		//if loan is offer
			minScore = _minScore;		//set minimum credit score
		}
	}

	//take loan offer - sets borrower and deadline - funds transferred from contract to borrower
	function takeLoan() returns (bool) {

		//put score in var. basically casting. won't compile if function is in if statement
		int borrowerScore = ldb.getCreditScore(msg.sender);

		//if loan is available & is request & borrower meets score & is not the offerer
		if (taken == false && request == false && borrowerScore >= minScore && msg.sender != owner) {

			borrower = msg.sender;  							//set borrower
			setDeadline();  											//set the deadline
			return borrower.send(this.balance);		//send the loan amount to the borrower

		}
		else return false;  										//else do nothing
	}

	//repay loan - payable denotes that ether can be sent to the contract - sets repaid, repaidtime
	//funds transferred from borrower to contract
	function repay() payable returns (bool) {

		//loan hasn't been repaid + repayment amount was sent in function call + function caller is the borrower
		if (repaid == false && msg.value == rpy && msg.sender == borrower) {

			repaid = true;												//loan has been repaid
			repaidTime = now;											//set timestamp for repayment
			return repaid;
		}

		else {
			return msg.sender.send(msg.value);		//if conditions not met, refund caller
		}
	}

	//fill loan request - sets deadline - funds transferred from lender to contract to borrower
	function fillRequest() payable returns (bool) {
		//if loan is a request and lender has sent the amount to the contract
		if (taken == false && request == true && msg.value == amt) {

			transferToLender(msg.sender);  			//transfer ownership of the loan to the lender
			request = false;  									//set request to false - loan behaves as a typical loan offer from here on out
			setDeadline();											//set the deadline timestamp
			return borrower.send(this.balance);	//send the loan amount from contract to borrower
		}

		else return msg.sender.send(msg.value);  //else, refund the lender
	}

	//set the loan deadline - private - only accessible internally to Loan.sol
	function setDeadline() private {
		start = now;																	//timestamp of loan being taken/request filled
		deadline = start + (duration * 1 days);				//set the deadline timestamp
		taken = true;																	//set loan taken
	}

	//credit rating getter for ls - returns credit rating of borrower
	function getCreditScore() constant returns (int) {
		if (request == true) {
			return ldb.getCreditScore(borrower);
		}
		return;
	}	
}