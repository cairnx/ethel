pragma solidity ^0.4.8;
import "Mortal.sol";
import "Loan.sol";

contract LoanDB {

	address[] loans;
	mapping(address => int) public creditScore;
	Loan l;

	//23.03
	//a new branch

	//24.03
	//have opted not to manage Loans thru LoanDB
	//reason - out of gas exceptions
	Loan[] lns;

	function mkLns() { //marked for deltion

	}

	function getLn(uint index) constant returns (address) {
		return lns[index];
	}

	function getLnAmt(uint index) constant returns(uint) {
		return lns[index].amt();
	}

	//uint[] nums;

	event Debug (
		string str
		);

	function LoanDB() {

	}

	function getLen() constant returns (uint) {
		//return nums.length;
		return loans.length;
	}

	function addLoan(address loan){
		//nums.push(n);
		loans.push(loan);
	}

	function setLoan(uint index) {

	}

	function getLoan(uint n) constant returns (address loan) {
		return loans[n];
	}

	function rmLoan(uint n) {
		if (loans.length <=0 || n > loans.length) {
			return;
		}
		else if (loans.length == 1) {
			if (n == 0) {
				setCreditScore(n);
				delete loans[n];
				loans.length--;
			}
		}
		else {
			setCreditScore(n);
			loans[n] = loans[loans.length -1];
			delete loans[loans.length -1];
			loans.length--;
		}
	}

	//11.04  test method
	//it is possible to retrieve params from Loans like so
	function getBorrower(uint n) constant returns (address) {
		address loanAddr = loans[n];
		l = Loan(loanAddr);
		address borrower = l.borrower();
		return borrower;
	}

	//11.04
	function setCreditScore(uint n) private {
		address loanAddr = loans[n];
		l = Loan(loanAddr);
		address borrower = l.borrower();
		address owner = l.owner();
		bool repaid = l.repaid();
		bool taken = l.taken();
		uint deadline = l.deadline();
		uint repaidTime = l.repaidTime();
		//might need to put creditScore in an int to perform calcs
		if (repaid == true && repaidTime < deadline) {
		  creditScore[borrower] = creditScore[borrower] + 1;
		}
		else if (now > deadline && repaid  == false && taken == true) {
			creditScore[borrower] = creditScore[borrower] - 1;
		}
	}

	function getCreditScore(address user) constant returns (int) {
		int score = creditScore[user];
		return creditScore[user];
	}
/*		address loanAddr = loans[n];
		l = Loan(loanAddr);
		address borrower = l.borrower();
		//l = Loan(loans[n]);
		//address addr = l.borrower();
		creditScore[borrower] = 100;
	}

	function getCreditScore(address borrower) constant returns (int) {
		return creditScore[borrower];
	}

/*	function getLen() constant returns (uint) {
		return loans.length;
	}

	function addLoan(address loan) {
		loans.push(loan);
	}

	function getLoan(uint index) constant returns (address) {
		return loans[index];
	}

	function rmLn(uint index) constant returns (address) {
		address addr = loans[index];
		delete loans[index];
		return addr;
	}

	function removeLoan(uint index) constant returns (address) {
		address addr;
		if (loans.length == 0) {
			Debug('0 loans found');
		}
		else if (loans.length == 1) {
			addr = loans[0];
			delete loans[0];
		}
		else {
			address lastElem = loans[loans.length -1];
			addr = loans[index];
			loans[index] = lastElem;
			delete loans[loans.length -1];
		}
		return addr;
	}*/
}