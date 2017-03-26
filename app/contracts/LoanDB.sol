pragma solidity ^0.4.8;
import "Mortal.sol";
import "Loan.sol";

//stub class
contract LoanDB {

	address[] loans;


	//23.03
	//a new branch

	//24.03
	//have opted not to manage Loans thru LoanDB
	//reason - out of gas exceptions
	Loan[] lns;

	function mkLns() {

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
				delete loans[n];
				loans.length--;
			}
		}
		else {
			loans[n] = loans[loans.length -1];
			delete loans[loans.length -1];
			loans.length--;
		}
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