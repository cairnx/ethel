pragma solidity ^0.4.8;
import "Mortal.sol";
import "Loan.sol";

contract LoanDB {

	address[] loans;
	mapping(address => int) public creditScore;
	Loan l;

	function LoanDB() {
	}

	function getLen() constant returns (uint) {
		//return nums.length;
		return loans.length;
	}

	function pushLoan(address loan){
		loans.push(loan);
	}

	function getLoan(uint n) constant returns (address loan) {
		return loans[n];
	}

	function rmLoan(uint n) {
		address loanAddr = loans[n];
		l = Loan(loanAddr);
		address owner = l.owner();
		if (owner == msg.sender) {
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
	}

	function setCreditScore(uint n) private {
		address loanAddr = loans[n];
		l = Loan(loanAddr);
		address borrower = l.borrower();
		address owner = l.owner();
		bool repaid = l.repaid();
		bool taken = l.taken();
		uint deadline = l.deadline();
		uint repaidTime = l.repaidTime();
		if (repaid == true && repaidTime < deadline) {
		  creditScore[borrower] = creditScore[borrower] + 1;
		}
		else if (now > deadline && repaid == false && taken == true) {
			creditScore[borrower] = creditScore[borrower] - 1;
		}
	}

	function getCreditScore(address user) constant returns (int) {
		int score = creditScore[user];
		return creditScore[user];
	}
}