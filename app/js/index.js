$(document).ready(function() {

	var curLoan;
	var curLoanIndex;
	var addrReg; //23.03 marked for deletion
	var loans = []; //24.03 marked for deletion - promises wont let me store loans in a JS variable

	//23.03
	//var dbAd = LoanDB.address;
	//dbAd unnecessary as var dbAddr created in index html

  //.accts
  $('#intro .accts button').click(function() {
  	web3.eth.getAccounts(function(err, accounts) {
  		for(var i = 0; i < accounts.length; i++) {
  			(function(i) {
  				var address = accounts[i];
  				var balance = web3.fromWei(web3.eth.getBalance(accounts[i]));
  				$('#intro .accts .result').append('<br />' + i + '&emsp;' + address + '&emsp;' + balance);
  			})(i);
  		}
  	});
  });

  //.loandb
	//show LoanDB address
	$('#intro .loandb .addr .result').html(dbAddr);


	$('#intro .loandb .len button').click(function() {
		LoanDB.getLen().then(function(len) {
			$('#intro .loandb .len .result').html('Length: ' + len);
		});
	});

	$('#intro .loandb .ls_ button').click(function() {
		LoanDB.getLen().then(function(len) {
			$('#intro .loandb .ls .result').html('');
			if (len == 0) {
				$('#intro .loandb .ls .result').html('No Loans found');
			}
			else {
				for (var i = 0; i < len; i++) {
					(function (i) {
						LoanDB.getLoan(i).then(function(addr) {
							$('#intro .loandb .ls .result').append('<br>' + i + ': ' + addr);
							//23.03 i am running into issues because of how promises work
//							loans[i] = addr;
//							$('#intro .loandb .ls .result').append('<br>' + loans[i]);
/*							curLoan= new EmbarkJS.Contract({
  	   			    abi: Loan.abi,
  	  			    address: addr
  						});
  						curLoan.getAmt().then(function(amt) {
  							$('#intro .loandb .ls .result').append(' (' + amt +') ');
  						});*/
						});
					})(i);
				}
			}
		});
	});

	//23.03
	//retrying the display loan content bit
	//24.03
	//added repay amount get
	$('#intro .loandb .ls button').click(function() {
		//first get the array length
		LoanDB.getLen().then(function(len) {
			$('#intro .loandb .ls .result').html('');
			if (len == 0 ) {
				$('#intro .loandb .ls .result').html('No Loans found');
			}
			else {
				for (var i = 0; i < len; i++) {
					(function (i) {
						LoanDB.getLoan(i).then(function(addr) {
							//$('#intro .loandb .ls .result').append('<br>' + i + ': ' + addr);
							curLoan = new EmbarkJS.Contract({
								abi: Loan.abi,
								address: addr
							});
							curLoan.amt().then(function(amt) {
								curLoan.rpy().then(function(rpy) {
								  $('#intro .loandb .ls .result').append('<br> '+ i + ': ' + addr + ': ' + amt + ', ' + rpy);
								});
							});
						});
					})(i);
				}
			}
		});
	});

	//23.03
	//a new handler to just display the balance of a loan at a give address
	//so i can successfully retrieve the loan in this way
	//but the balance appears to be 0


  //24.03
  //loan balance is better termed loan amount
  //modified to test automagically created public field getter
  //public uint amt amt()
  //basic getter =
  //take address -> set new EmbarkJS.Contract({ abi, addr }) -> newContract.myMethod().then(etc)
  //change to retrieve actual balance of a given address
  //could be account or contract
	$('#intro .loandb .lnbal button').click(function() {
		//take the input address
		//set the curLoan
		var addr = $('#intro .loandb .lnbal input').val();

		var bal = web3.eth.getBalance(addr);

		$('#intro .loandb .lnbal .result').html('' + bal);

		//pre 24.03 modification
/*		curLoan = new EmbarkJS.Contract({
			abi: Loan.abi,
			address: addr
		});

		curLoan.amt().then(function(amt) {
			$('#intro .loandb .lnbal .result').html('' + amt);
		});*/

/*		curLoan.getAmt().then(function(amt) {
			$('#intro .loandb .lnbal .result').html(''+ amt);
		});*/
	});

	//23.02
	//loans need to be deployed in parallel i.e. added to LoanDB address array
	//and actually deployed on the blockchain separately
	//24.03
	//updated handler to take more params
	//26.04
	//Loan contracts need to be funded from the creator account
	//web3.eth.sendTransaction({txObj})
	$('#intro .loandb .add button').click(function() {
		var amt = $('#intro .loandb .add input.amt').val();
		var rpy = $('#intro .loandb .add input.rpy').val();

		Loan.deploy([amt, rpy], {value: web3.fromWei(amt, ether)}).then(function(deployedLoan) {
			curLoan = deployedLoan;
			$('#intro .loandb .add .result').append('<br>Loan deployed: ' + deployedLoan.address + '(' + amt + ',' +' ' + rpy +')');

			ldb.addLoan(deployedLoan.address).then(function() {
				$('#intro .loandb .add .result').append(' added to db');

				//26.03 attempting to send funds to Loan
/*				web3.eth.sendTransaction({to: deployedLoan.address, value: amt * 1 ether}).then(function() {
					$('#intro .loandb .add .result').append('<br>Loan funded with ' + amt + ' ether');
				});*/
			});
		});
	});

	//24.03
	//modify rm
	//needs to remove Loan from the blockchain i.e. kill
	//initial implementation
	//error - rmLoan doesn't return an address
	//restructured to wrap rmLoan within kill
	//fortunately the two are independent
	$('#intro .loandb .rm button').click(function() {
		var index = $('#intro .loandb .rm input').val();

		LoanDB.getLoan(index).then(function(addr) {
			curLoan = new EmbarkJS.Contract({
				abi: Loan.abi,
				address: addr
			});
			curLoan.kill().then(function() {
				var rmAddr = addr.toString();
				LoanDB.rmLoan(index).then(function() {
					$('#intro .loandb .rm .result').html('removed loan: ' + rmAddr);
				});
			});
		});

/*		LoanDB.rmLoan(index).then(function(addr) {
			curLoan = new EmbarkJS.Contract({
				abi: Loan.abi,
				address: addr
			});
			curLoan.kill().then(function() {
				var rmAddr = addr.toString();
				$('#intro .loandb .rm .result').html('removed loan: ' + rmAddr);
			});
			//var address = addr.toString();
			//$('#intro .loandb .rm .result').html('removed loan: ' + addr);
		});*/
	});

	//23.03 better termed as set current loan
	$('#intro .loandb .inspect button').click(function() {
		var index = $('#intro .loandb .inspect input').val();
		LoanDB.getLoan(index).then(function(addr) {
			curLoanIndex = index;
			curLoan= new EmbarkJS.Contract({
  	    abi: Loan.abi,
  	    address: addr
  		});
		});
	});

	//23.03
	//spoke to phil watten re: structure of report
	//showed basic basic prototype
	//function returns the address of the current loan set in the handler above
	$('#intro .loandb .cur button').click(function() {
		var addr = curLoan.address;
		$('#intro .loandb .cur .result').html(addr);
	});

  //handlers for the modded loandb
  $('#sand .dbmod .mk button').click(function() {
  	LoanDB.mkLns().then(function() {
  		$('#sand .dbmod .mk result').html('added loans');
  	});
  });

  $('#sand .dbmod .get-amt button').click(function() {
  	var index = ('#sand .dbmod .get-amt input').val();
  	ldb.getLnAmt(index).then(function(amt) {
  		$('#sand .dbmod .get-amt .result').html(amt);
  	});
  });

});