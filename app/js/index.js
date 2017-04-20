$(document).ready(function() {


	function formatDate(timestamp) {
		var timestampMilliseconds = timestamp * 1000;
		var date = new Date(timestampMilliseconds);

    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var meridiem = (date.getHours() > 12 ? 'pm' : 'am');
    var mins  = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var hours = (date.getHours() % 12 || 12);

    return hours + ':' + mins + ' ' + meridiem + ' on ' + day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

	var curLoan;
	var curLoanIndex;

	//02.04
	//curAcct = web3.eth.defaultAccount;
	$('#intro .cur-acct .result').html('current: ' + curAcct);

	//23.03
	//var dbAd = LoanDB.address;
	//dbAd unnecessary as var dbAddr created in index html

	//02.04
	//set current user account
	$('#intro .cur-acct button').click(function() {
	  curAcct = $('#intro .cur-acct .newAddr').val();
		if (curAcct === "") {
			curAcct = web3.eth.defaultAccount;
		}
		$('#intro .cur-acct .result').html('current: ' + curAcct);
	});

/*	//08.04
	//added indexed account switching
	$('#intro .cur-acct button').click(function() {
		var index = $('#intro .cur-acct .index').val();
		try {
			if (index > 9 || index < 0) throw "index must be between 0-9";
		}
		catch {
			$('#intro .cur-acct .result').html(err);
		}
		if (curAcct === "") {
			curAcct = web3.eth.defaultAccount[index];
		}
		$('#intro .cur-acct .result').html('selected account at index ' + index + '<br />current: ' + curAcct);
	})*/

  //.accts
  $('#intro .accts button').click(function() {
  	$('#intro .accts .result').html('');
  	web3.eth.getAccounts(function(err, accounts) {
  		for(var i = 0; i < accounts.length; i++) {
  			(function(i) {
  				var address = accounts[i];
  				var balance = web3.fromWei(web3.eth.getBalance(accounts[i]));
  				$('#intro .accts .result').append('<br />' + i + ': ' + address + ': ' + balance);
  			})(i);
  		}
  	});
  });

  //02.04
  //add default account setters and getters


  //26.03
  //tx from one address to another test
  //surprise: it works
  //for main accounts only
  // can't fund contracts
  //see below for attempt to fund contracts

  //02.04 experimentation
  $('#intro .tx button').click(function() {
  	var amt = web3.toWei($('#intro .tx .amt').val());
  	var tgt = $('#intro .tx .tgt').val();
  	//var frm = $('#intro .tx .frm').val();
  	//uses accounts[0] if frm is undefined
/*  	if (frm === "") {
  		alert('hello');
  		var accts = web3.eth.accounts;
  		frm = accts[0];
  	}*/
  	web3.eth.sendTransaction({from: curAcct, to: tgt, value: amt}, function(err, result) {
  		$('#intro .tx .result').html('sent: ' + web3.fromWei(amt, 'ether') + ' ether<br />from ' + frm + ' <br />tgt ' + tgt);
  	});
  });

  //02.04
  //integrated with curAcct
  $('#intro .send-brw button').click(function() {
  	var loan = $('#intro .send-brw .loan').val();
  	var tgt = $('#intro .send-brw .tgt').val();

  	if (tgt === "") {
  		tgt = curAcct;
  	}

 	  curLoan = new EmbarkJS.Contract({
			abi: Loan.abi,
			address: loan
		});

		var balance = web3.fromWei(web3.eth.getBalance(loan), 'ether');

		//first attempt
		//cahnged tgt to curAcct
 	  curLoan.sendToBorrower({from: tgt}).then(function(success) {
 	  	if (success) {
 	  		$('#intro .send-brw .result').html('' + balance + ' ether sent<br /> to account: ' + tgt + '<br />from Loan: ' + loan);

 	  		//$('#intro .send-brw .result').html('Loan ' + loan + ' sent ' + balance + ' to ' + tgt);
 	  	}
 	  	else {
 	  		$('#intro .send-brw .result').html('Something went wrong');
 	  	}
 	  });
  });

  //26.03
  //fund contracts
  //it turns out that this wasnt working because of i had .button instead of button
  //stupid
  
/*  $('#intro .fund button').click(function() {
  	var amt = web3.toWei($('#intro .fund .amt').val());
  	var tgt = $('#intro .fund .tgt').val();
		web3.eth.sendTransaction({to: tgt, value: amt}, function(err, result) {
			alert('is it working?');
		});
  });*/


  //.loandb
	//show LoanDB address
	$('#intro .loandb .addr .result').html(dbAddr);


	$('#intro .loandb .len button').click(function() {
		LoanDB.getLen({from:curAcct}).then(function(len) {
			$('#intro .loandb .len .result').html('Length: ' + len);
		});
	});

	//marked for deletion 26.03
	$('#intro .loandb .ls_ button').click(function() {
		LoanDB.getLen({from:curAcct}).then(function(len) {
			$('#intro .loandb .ls .result').html('');
			if (len == 0) {
				$('#intro .loandb .ls .result').html('No Loans found');
			}
			else {
				for (var i = 0; i < len; i++) {
					(function (i) {
						LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {
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

	//05.04
	$('#intro .loandb .ls button.available').click(function() {
		$('#intro .loandb .ls .result').html('No available loans found');

		//first get the array length
		LoanDB.getLen({from:curAcct}).then(function(len) {
			if (len == 0 ) {
				$('#intro .loandb .ls .result').html('No loans in database');
			}
			else {
				$('#intro .loandb .ls .result').html('');
				for (var i = 0; i < len; i++) {
					(function (i) {
						LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {
							//$('#intro .loandb .ls .result').append('<br>' + i + ': ' + addr);
							curLoan = new EmbarkJS.Contract({
								abi: Loan.abi,
								address: addr
							});

/*							curLoan.amt().then(function(amt) {
								amt = web3.fromWei(amt, 'ether');
								curLoan.rpy().then(function(rpy) {
								  $('#intro .loandb .ls .result').append('<br> '+ i + ': ' + addr + ': ' + amt + ', ' + rpy);
								});
							});*/

							curLoan.taken({from:curAcct}).then(function(tkn){
								if (!tkn) {
									Promise.all([
										curLoan.amt().then(function(amt) {return web3.fromWei(amt, 'ether')}),
									  curLoan.rpy().then(function(rpy) {return web3.fromWei(rpy, 'ether')})
										]).then(function(values) {
											$('#intro .loandb .ls .result').append('' + i + ': ' + addr + ': ' +
												' amt: ' + values[0] + ' rpy: ' + values[1]);
										});



/*									curLoan.rpy().then(function(rpy) {
										rpy = web3.fromWei(rpy,'ether');
								    var amt = web3.fromWei(web3.eth.getBalance(addr), 'ether');
  							    $('#intro .loandb .ls .result').append('<br> ' +  i + ': ' + addr + ': ' +
								    amt + ', ' + rpy);
							    });*/
								}
							});
						});
					})(i);
				}
			}
		});
	});

	//05.04
	//ls all loans
	//08.04 adapted to include repayment status
  $('#intro .loandb .ls button.all').click(function() {
		//first get the array length
		LoanDB.getLen({from:curAcct}).then(function(len) {
			$('#intro .loandb .ls .result').html('');
			if (len == 0 ) {
				$('#intro .loandb .ls .result').html('No loans in database');
			}
			else {
				for (var i = 0; i < len; i++) {
					(function (i) {
						LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {
							//$('#intro .loandb .ls .result').append('<br>' + i + ': ' + addr);
							curLoan = new EmbarkJS.Contract({
								abi: Loan.abi,
								address: addr
							});

/*							curLoan.amt().then(function(amt) {
								amt = web3.fromWei(amt, 'ether');
								curLoan.rpy().then(function(rpy) {
								  $('#intro .loandb .ls .result').append('<br> '+ i + ': ' + addr + ': ' + amt + ', ' + rpy);
								});
							});*/

							Promise.all([
								curLoan.amt({from:curAcct}).then(function(amt) {return web3.fromWei(amt, 'ether')}), //0 amt
								curLoan.rpy({from:curAcct}).then(function(rpy) {return web3.fromWei(rpy, 'ether')}), //1 rpy
								curLoan.taken({from:curAcct}).then(function(tkn) {  //2 availability
									if (tkn) return "Taken";
									else return "Available";
								  }),
								curLoan.repaid({from:curAcct}).then(function(repaid) {  //3 repayment status
									if (repaid) return "Repaid";
									else return "Awaiting repayment";
								}),
								curLoan.request({from:curAcct}).then(function(request) {  //4 request or offer
									if (request) return "Request";
									else return "Offer";
								}),
								curLoan.duration({from:curAcct}).then(function(dur) { return dur; }),  //5 duration
								curLoan.minScore({from:curAcct}).then(function(minScore) { return minScore; }) //6 minimum score
								]).then(function(values) {
									if(values[4] == "Request") values[6] = "N/A"; //minScore N/A for requests
									var bal = web3.fromWei(web3.eth.getBalance(addr), 'ether');
									$('#intro .loandb .ls .result').append('' + i + ': ' + addr + ': ' +
										' amt: ' + values[0] + ' rpy: ' + values[1] + ' dur: ' + values[5] + ' days ' +
										' bal: ' + bal + ' ' + values[2] + ' ' + values[3] + ' ' + values[4] +
										' minimum score: ' + values[6] + '<br />');
								});

/*							curLoan.rpy().then(function(rpy) {
								rpy = web3.fromWei(rpy,'ether');
						    var amt = web3.fromWei(web3.eth.getBalance(addr), 'ether');
						    $('#intro .loandb .ls .result').append('<br> ' +  i + ': ' + addr + ': ' +
						    amt + ', ' + rpy);
					    });*/
						});
					})(i);
				}
			}
		});
	});

	//05.04
	//ls promise test
  $('#intro .loandb .ls button.test').click(function() {
		//first get the array length
		LoanDB.getLen({from:curAcct}).then(function(len) {
			$('#intro .loandb .ls .result').html('');
			if (len == 0 ) {
				$('#intro .loandb .ls .result').html('No loans in database');
			}
			else {
				for (var i = 0; i < len; i++) {
					(function (i) {
						LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {
							//$('#intro .loandb .ls .result').append('<br>' + i + ': ' + addr);
							curLoan = new EmbarkJS.Contract({
								abi: Loan.abi,
								address: addr
							});

							Promise.all([
								  curLoan.amt().then(function(amt) {return web3.fromWei(amt,'ether')}), //0 amt
								  curLoan.rpy().then(function(rpy) {return web3.fromWei(rpy,'ether')}), //1 rpy
								  curLoan.taken().then(function(tkn) {	//2 availability
								  	if (tkn) return "Taken";
								  	else return "Available";
								  })
								]).then(function(values) {
									var bal = web3.fromWei(web3.eth.getBalance(addr),'ether');
									$('#intro .loandb .ls .result').append('' + i + ':  amt: ' + values[0] +
										'  rpy: ' + values[1] + '  ' + values[2] +'  bal: ' + bal + '<br />');
								});

/*							curLoan.amt().then(function(amt) {
								amt = web3.fromWei(amt, 'ether');
								curLoan.rpy().then(function(rpy) {
								  $('#intro .loandb .ls .result').append('<br> '+ i + ': ' + addr + ': ' + amt + ', ' + rpy);
								});
							});*/

/*							curLoan.rpy().then(function(rpy) {
						    var amt = web3.fromWei(web3.eth.getBalance(addr), 'ether');
						    $('#intro .loandb .ls .result').append('<br> ' +  i + ': ' + addr + ': ' +
						    amt + ', ' + rpy);
					    });*/
						});
					})(i);
				}
			}
		});
	});	

  //10.04 new ls request handler
	$('#intro .loandb .ls button.rq').click(function() {
		//first get the array length
		LoanDB.getLen({from:curAcct}).then(function(len) {
			$('#intro .loandb .ls .result').html('');
			if (len == 0 ) {
				$('#intro .loandb .ls .result').html('No loans in database');
			}
			else {
				for (var i = 0; i < len; i++) {
					(function (i) {
						LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {
							curLoan = new EmbarkJS.Contract({
								abi: Loan.abi,
								address: addr
							});
							Promise.all([
								curLoan.amt({from:curAcct}).then(function(amt) { return web3.fromWei(amt, 'ether'); }), //0 amt
								curLoan.rpy({from:curAcct}).then(function(rpy) { return web3.fromWei(rpy, 'ether'); }), //1 rpy
								curLoan.duration({from:curAcct}).then(function(dur) { return dur; }), //2 duration
								curLoan.request({from:curAcct}).then(function(request) { return request; }), //3 offer or request
								curLoan.getCreditScore({from:curAcct}).then(function(score) { return score; }) //4 score of borrower
								]).then(function(values) {
									if (values[3]) {	//if loan is a request display info
										var bal = web3.fromWei(web3.eth.getBalance(addr), 'ether');  //balance
										$('#intro .loandb .ls .result').append('' + i + ': ' + addr + ': ' +
											' amt: ' + values[0] + ' rpy: ' + values[1] + ' bal: ' + bal +
											' duration: ' + values[2] + ' days' +
											' borrower score: ' + values[4] + '<br />');
										$('#intro .loandb .ls .rq-result').html(i);
									}
									else $('#intro .loandb .ls  .rq-result').html(i);
								});
						});
					})(i);
				}
			}
		});
	});

	//05.04
	//take loan - add borrower addr to loan | set taken to true | transfer ether to borrower
	$('#intro .loandb .take-ln button').click(function() {
		var index = $('#intro .loandb .take-ln input').val();
		//alert(index);
		LoanDB.getLoan(index , {from: curAcct}).then(function(addr) {
			curLoan = new EmbarkJS.Contract({
				abi: Loan.abi,
				address: addr
			});

			curLoan.taken().then(function(tkn) {  //check if loan is avail
				if(!tkn) {													//if so
					Promise.all([
						curLoan.takeLoan({from: curAcct}).then(function(success) {  //0 take loan
							//return "success";
							if (success) {
								return true;
							}
							else return false;
						}),
						curLoan.amt({from:curAcct}).then(function(amt) {  //1 amt
							return web3.fromWei(amt,'ether');
						}),
						curLoan.rpy({from:curAcct}).then(function(rpy) {  //2 repayable
							return web3.fromWei(rpy, 'ether');
						}),
						curLoan.minScore({from:curAcct}).then(function(minScore) { //3 minScore
							return minScore.toNumber();
						}),
						LoanDB.getCreditScore(curAcct, {from:curAcct}).then(function(brwScore) { //4 borrower credit score
							return brwScore.toNumber();
						})
						]).then(function(values) {
							if (!values[0]) { //if loan couldn't be taken
								$('#intro .loandb .take-ln .result').html('Couldn\'t take loan' +
								  '<br />Your credit score: ' + values[4] +
								  '<br />Required minimum credit score: ' + values[3]);
							}
							else {  //loan successfully taken
								$('#intro .loandb .take-ln .result').html('Success - loan taken!<br />' +
									'Loan address: ' + addr +
									'<br />amount: ' + values[1] + ' <br />repayable: ' + values[2] +
									'<br />taken by: ' + curAcct);
							}
						});
/*					curLoan.setBorrower({from: curAcct}).then(function(brw) {
						curLoan.amt().then(function(amt) {
							amt = web3.fromWei(amt, 'ether');
							curLoan.rpy().then(function(rpy) {
								//rpy = web3.fromWei(rpy, 'ether');
							  $('#intro .loandb .take-ln .result').html('Loan: ' + addr +
						    '<br />amt: ' + amt +
						    '<br />rpy: ' + rpy +
							  '<br />borrower: ' + curAcct);
							});
						});
					});*/
				}
				else {
					$('#intro .loandb .take-ln .result').html('Loan at index <code>'+ index +'</code> already taken');
				}
			});
		});
	});

	//06.04
/*	$('#intro .loandb .test button').click(function() {
		//$('#intro .loandb .test .result').html('hellooo');
		var addr = $('#intro .loandb .test input').val();
		curLoan = new EmbarkJS.Contract({
			abi: Loan.abi,
			address: addr
		});

		curLoan.rpy().then(function(rpy) {
			var rpy = web3.fromWei(rpy,'ether');
			alert(rpy);
			$('#intro .loandb .test .result').html('' + rpy);
		});		
		//$('#intro .loandb .test .result').html(' yo');
	});*/

	//06.04
  $('#intro .loandb .rpy-ln button').click(function() {
  	var index = parseInt($('#intro .loandb .rpy-ln input').val());

  	//first get the loan
  	LoanDB.getLoan(index, {from: curAcct}).then(function(addr) {
  		curLoan = new EmbarkJS.Contract({
  			abi: Loan.abi,
  			address:  addr
  		});

	  	Promise.all([
				curLoan.rpy().then(function(rpy) {return parseFloat(web3.fromWei(rpy,'ether'));}),
				curLoan.borrower().then(function(brw) {return brw;}),
				curLoan.amt().then(function(amt) {return amt;}),
				curLoan.repaid().then(function(repaid) {return repaid;})
				]).then(function(values) {
					if (curAcct != values[1]) {
						alert('you are not the borrower for this loan');
						$('#intro .loandb .rpy-ln .result').html('Error: you aren\'t the borrower for this loan');
					}
					else if(values[3]) {
						alert('Error: loan has already been repaid');
					}
					else if (values[0] > parseFloat(web3.fromWei(web3.eth.getBalance(curAcct),'ether'))) {
						alert('Error: you don\'t have enough ether');
					}
					else {
						curLoan.repay({from: curAcct, value: web3.toWei(values[0],'ether')}).then(function() {
							alert ('repaid loan: ' + values[0] + ' ether');
							$('#intro .loandb .rpy-ln .result').html("<font color = 'green'><b>Successfully repaid loan</b></font>" +
								'<br />' + values[0] + ' ether sent' +
								'<br />from: ' + curAcct +
								'<br />loan: ' + addr);
						});
					}
				});
  	});


		//$('#intro .loandb .rpy-ln .result').html('hello');
/*		Promise.all([
			curLoan.rpy().then(function(rpy) {return rpy})]).then(function(values) {
				$('#intro .loandb .rpy-ln .result').html("HELLO");
			});*/


/*		(curLoan.rpy().then(function(rpy) {
			alert(rpy);
			web3.eth.sendTransaction({to: addr, from: curAcct, })
		});  	*/
  });

	//05.04
	$('#intro .loandb .get-br button').click(function() {
		var index = $('#intro .loandb .get-br input').val();
		LoanDB.getLoan(index , {from: curAcct}).then(function(addr) {
			curLoan = new EmbarkJS.Contract({
				abi: Loan.abi,
				address: addr
			});
			curLoan.borrower().then(function(br) {
				var brAddr = br.toString();
				alert(brAddr);
			});
		});
	});



  //05.04
	$('#intro .loandb .get-taken button').click(function() {
		var index = $('#intro .loandb .get-taken input').val();
		//alert(index);
		LoanDB.getLoan(index , {from: curAcct}).then(function(addr) {
			curLoan = new EmbarkJS.Contract({
				abi: Loan.abi,
				address: addr
			});
			curLoan.taken().then(function(result) {
				if (result) {
					alert("loan unavailable - already taken");
				  $('#intro .loandb .get-taken .result').html("Loan: " + addr + "<br />" +
					  "borrower: " + curAcct);
				}
				else {
					//alert("this loan is available");
					$('#intro .loandb .get-taken .result').html("loan is available");
				}
			});
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
  //26.03
  //funding functionality added in .add
  //check balance with this
	$('#intro .loandb .lnbal button').click(function() {
		//take the input address
		//set the curLoan
		var addr = $('#intro .loandb .lnbal input').val();

		var bal = web3.fromWei(web3.eth.getBalance(addr),'ether');

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
	//06.04 having difficulties with
	//adding amount and repay values of loans
	//11.04 duration
	$('#intro .loandb .add button').click(function() {
		//var amt = web3.toWei($('#intro .loandb .add input.amt').val());
		//amt = web3.toWei(amt, 'ether');
		//var rpy = web3.toWei($('#intro .loandb .add input.rpy').val());

		var amt = $('#intro .loandb .add input.amt').val();
		var rpy = $('#intro .loandb .add input.rpy').val();
		var score = $('#intro .loandb .add input.score').val();
		var dur = $('#intro .loandb .add input.duration').val();

		var amtWei = web3.toWei(amt, 'ether');
		var rpyWei = web3.toWei(rpy, 'ether');

		//26.03
		//added Loan.deploy([args],{txOptions})
		Loan.deploy([amtWei, rpyWei, dur, score, false, dbAddr], {from: curAcct, value: amtWei}).then(function(deployedLoan) {
			curLoan = deployedLoan; //marked for deletion

			$('#intro .loandb .add .result').html('Loan deployed: ' + deployedLoan.address + ' (' + amt +
				', ' + rpy +')');


			/*deployedLoan.initLoan(amt, rpy, {from: curAcct}).then(function(success) {
				if(success) {
					$('#intro .loandb .add .result').append('<br>Loan deployed: ' + deployedLoan.address + '(' + amt +
				  ', ' + rpy +')');
				}
				else $('#intro .loandb .add .result').append('Error: loan amt and rpy not initialised');
			});
*/
			LoanDB.pushLoan(deployedLoan.address, {from: curAcct}).then(function() {
				$('#intro .loandb .add .result').append('<br />Added to LoanDB');

				web3.eth.sendTransaction({from: curAcct, to: deployedLoan.address, value: amtWei});
			});
		});
	});

	//10.04 - loan requests
	//11.04 - added duration
	$('#intro .loandb .rq button').click(function() {
		var amt = $('#intro .loandb .rq input.amt').val();
		var rpy = $('#intro .loandb .rq input.rpy').val();
		var dur = $('#intro .loandb .rq input.duration').val();

		var amtWei = web3.toWei(amt, 'ether');
		var rpyWei = web3.toWei(rpy, 'ether');

		Loan.deploy([amtWei, rpyWei, 0, dur, true, dbAddr], {from: curAcct, value: amtWei}).then(function(deployedLoan) {
			curLoan = deployedLoan; //marked for deletion

			$('#intro .loandb .rq .result').html('Loan request deployed: ' + deployedLoan.address + '(' + amt +
				', ' + rpy + ')');

			LoanDB.pushLoan(deployedLoan.address, {from: curAcct}).then(function() {
				$('#intro .loandb .rq .result').append('<br />Added to LoanDB');
			});
		});
	});

	//10.04 - fill loan request
	$('#intro .loandb .fill-rq button').click(function() {
		var index = $('#intro .loandb .fill-rq input').val();

		LoanDB.getLoan(index, {from:curAcct}).then(function(addr) {
			curLoan = new EmbarkJS.Contract({
				abi: Loan.abi,
				address: addr
			});
			Promise.all([
				curLoan.amt({from:curAcct}).then(function(amt) { return amt }),
				curLoan.borrower({from:curAcct}).then(function(brw) { return brw})
				]).then(function(values) {
					curLoan.fillRequest({from:curAcct, value:values[0]}).then(function(success) {
						var bal = web3.fromWei(values[0],'ether');
						$('#intro .loandb .fill-rq .result').html("<font color='green'><b>Successfully filled loan request</b></font>" +
							'<br />Loaned ' + bal + ' ether' + '<br />To borrower' + values[1] + 
							'<br />Address:' + addr
							);
					});
				});
		});
	});

	//10.04 get owner of loan
	$('#intro .loandb .get-owner button').click(function() {
		var addr = $('#intro .loandb .get-owner input').val();

		curLoan = new EmbarkJS.Contract({
			abi: Loan.abi,
			address: addr
		});

		curLoan.owner().then(function(owner) {
			$('#intro .loandb .get-owner .result').html('owner ' + owner);
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

		LoanDB.getLen({from:curAcct}).then(function(len) {
			var len = parseInt(len);
			if (index < 0 || index > len) {
				alert('Loan not found at index');
			}
			else {
				LoanDB.getLoan(index, {from:curAcct}).then(function(addr) {
					curLoan = new EmbarkJS.Contract({
						abi: Loan.abi,
						address: addr
					});

					curLoan.owner.call({from: curAcct}).then(function(owner) {
						if (curAcct == owner) {
							LoanDB.rmLoan(index, {from:curAcct}).then(function() {
								curLoan.kill({from:curAcct}).then(function() {
									$('#intro .loandb .rm .result').html('removed loan: ' + addr);
								});
							});
						}
						else {
							$('#intro .loandb .rm .result').html('You must be the owner to remove a loan');
						}
/*						if (curAcct == owner) {
							Promise.all([
								curLoan.kill({from:curAcct}).then(function() {
									return "Loan removed from blockchain";
								}),
								LoanDB.rmLoan()
								]).then(function(values) {

								});
						}
						else $('#intro .loandb .rm .result').html('curAcct != owner');*/
					}).catch(function(e){
						console.log('curAcct.owner.call error -- check curAcct');
					});

/*					curLoan.kill({from:curAcct}).then(function() {
						var rmAddr = addr.toString();
						LoanDB.rmLoan(index, {from:curAcct}).then(function() {
							$('#intro .loandb .rm .result').html('removed loan: ' + rmAddr);
						}).catch('LoanDB.rmLoan promise rejection');
					}).catch(function() {
						console.log('curLoan.kill promise rejection. Could not remove loan');
					});*/
				});
			}
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
	//06.04 altered to actually inspect the values i.e.
	//return amt rpy and taken
	//11.04 comprehensive info display functionality added
	$('#intro .loandb .inspect button.ins').click(function() {

		var index = $('#intro .loandb .inspect input').val();

		//11.04 index validator - consider turning into a function
		if (index < 0 || isNaN(index)) {
			alert('invalid index: enter a positive integer');
		}

		LoanDB.getLen({from:curAcct}).then(function(len) {
			len = parseInt(len);
			if (len == 0) { alert('no loans in database'); }
			else if (index > len) { alert('index out of bounds'); };
		}).catch('LoanDB.getLen promise rejection');

		LoanDB.getLoan(index, {from: curAcct}).then(function(addr) {
			curLoanIndex = index; //marked for deletion
			curLoan = new EmbarkJS.Contract({
  	    abi: Loan.abi,
  	    address: addr
  		});

			Promise.all([
				curLoan.amt({from:curAcct}).then(function(amt) { return web3.fromWei(amt, 'ether'); }), //0 amount
				curLoan.rpy({from:curAcct}).then(function(rpy) { return web3.fromWei(rpy, 'ether'); }), //1 repayment
				curLoan.duration({from:curAcct}).then(function(dur) { return dur; }), //2 duration
				curLoan.start({from:curAcct}).then(function(start) { return start; }), //3 start timestamp
				curLoan.request({from:curAcct}).then(function(rq) { //4 request or offer
				  if (rq) return 'request';
				  else return 'offer';
				}),
				curLoan.taken({from:curAcct}).then(function(tkn) { //5 taken or available
					if (tkn) return 'taken';
					else return 'available';
				}),
				curLoan.repaid({from:curAcct}).then(function(repaid) { //6 repaid or awaiting repayment
					if (repaid) return 'complete';
					else return 'pending';
				}),
				curLoan.owner({from:curAcct}).then(function(owner) {return owner.toString(); }), //7 owner
				curLoan.borrower({from:curAcct}).then(function(brw) {return brw.toString(); }), //8 borrower
				curLoan.deadline({from:curAcct}).then(function(dead) { return dead; }) ///9 deadline
				]).then(function(values) {
					//if loan is available then repayment status, start time and deadline are N/A
					if (values[5] == 'available') {
						values[6] = 'N/A'; //repayment status
						values[3] = 'N/A'; //start time 
						values[9] = 'N/A'; //deadline
					}
					else { //else if the loan is taken
						values[3] = formatDate(values[3]);
						values[9] = formatDate(values[9]);
					}
					$('#intro .loandb .inspect .result').html('Inspecting loan: ' + addr +
						'<br />Amount: ' + values[0] + ' ether' +
						'<br />Repayment: ' + values[1] + ' ether' +
						'<br />Balance: ' + web3.fromWei(web3.eth.getBalance(addr),'ether') + ' ether' +
						'<br />Duration: ' + values[2] + ' days' +
						'<br />Start: ' + values[3] + //formatDate(values[3]) + 
						'<br />Deadline: ' + values[9] + //formatDate(values[9]) +
						'<br />Type: ' + values[4] +
						'<br />Status: ' + values[5] +
						'<br />Repayment: ' + values[6] +
						'<br />Owner: ' + values[7] +
						'<br />Borrower: ' + values[8]  
						);
				});
		}).catch('LoanDB.getLoan promise rejection');
	});

	$('#intro .loandb .inspect button.clr').click(function() {
		$('#intro .loandb .inspect .result').html('');
	});

	$('#intro .loandb .set-LoanDB button.set').click(function() {
		var index = $('#intro .loandb .set-LoanDB input.index').val();
		LoanDB.getLoan(index, {from: curAcct}).then(function(addr) {
			curLoanIndex = index; //marked for deletion
			curLoan = new EmbarkJS.Contract({
  	    abi: Loan.abi,
  	    address: addr
  		});
  		curLoan.setLoanDB(dbAddr, {from: curAcct}).then(function() {
  			$('#intro .loandb .set-LoanDB .result').html('Set LoanDB for loan at <code>' + index + '</code>');
  		}).catch('setLoanDB promise rejection');
  	});
/*  	var loanAddr = $('#intro .loandb .set-LoanDB input.loanAddr').val();
  	var loanDBAddr = $('#intro .loandb .set-LoanDB input.loanDBAddr').val();
  	curLoan = new EmbarkJS.Contract({
  		abi: Loan.abi,
  		address: loanAddr
  	});
  	curLoan.setLoanDB(dbAddr, {from: curAcct}).then(function() {
  		$('#intro .loandb .set-LoanDB .result').html('Set LoanDB');
  		$('#intro .loandb .set-LoanDB .result').append('<br />input db addr: ' + loanDBAddr +
  			'<br />default db addr: ' + dbAddr);
  	});*/
	});

	//11.04 marked for deletion - refactor to provide all loans with db addr thru constructor
	$('#intro .loandb .set-LoanDB button.get').click(function() {
		var index = $('#intro .loandb .set-LoanDB input').val();
		LoanDB.getLoan(index, {from: curAcct}).then(function(addr) {
			curLoanIndex = index; //marked for deletion
			curLoan = new EmbarkJS.Contract({
  	    abi: Loan.abi,
  	    address: addr
  		});
  		curLoan.getLoanDBAddr({from: curAcct}).then(function(LoanDBAddr) {
  			LoanDBAddr = LoanDBAddr.toString();
  			$('#intro .loandb .set-LoanDB .result').html('LoanDB address: ' + LoanDBAddr );
  		});
    });
	});

	//11.04
	$('#intro .loandb .credit button.get').click(function() {
		var userAddr = $('#intro .loandb .credit input.user-addr').val();

		//LoanDB.getCreditScore(userAddr, {from:curAcct}).then(function(score) {
		LoanDB.getCreditScore(userAddr,{from:curAcct}).then(function(score) {
			$('#intro .loandb .credit .result').html('score: ' + score);
		});
/*		$('#intro .loandb .credit .result').html('user: ' + userAddr + ' score: ' + LoanDB.creditScore[userAddr] +
			'<br />LoanDB.getCreditScore: ' + LoanDB.getCreditScore());*/
	});

	$('#intro .loandb .credit button.set').click(function() {
		var index = $('#intro .loandb .credit input.user-addr').val();

		LoanDB.setCreditScore(index, {from:curAcct}).then(function() {
			$('#intro .loandb .credit .result').html('set score for loan at  ' + index);
		});
	});

	$('#intro .loandb .get-b button').click(function() {
		var index = $('#intro .loandb .get-b input.index').val();
		LoanDB.getBorrower(index, {from:curAcct}).then(function(brw) {
			brw = brw.toString();
			$('#intro .loandb .get-b .result').html(brw);
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

	//###########################
	//      Ethel main tab
	//###########################

	//***************************
  //******* functions *********
  //***************************

	//12.04 function => ls accts and balances
	function lsAccts() {
		$('#user .ls-accts .result').html('');
  	web3.eth.getAccounts(function(err, accounts) {
  		for(var i = 0; i < accounts.length; i++) {
  			(function(i) {
  				var address = accounts[i];
  				var balance = web3.fromWei(web3.eth.getBalance(accounts[i]));
  				$('#user .ls-accts .result').append(i + ': <code>' + address + '</code> ' + balance + ' ETH<br />');
  			})(i);
  		}
  	});
	}

	function getEtherBalance(addr) {
		return web3.fromWei(web3.eth.getBalance(addr));
	}

	//12.04 function => get web3.eth.defaultAccount and display it
	function displayLoginInfo() {
		if (curAcct == "") {
			curAcct = web3.eth.defaultAccount;
		}
	
		if (curAcct == "0") {
			$('#user .login .result').html('<b>Logged out</b>' +
				'<br />Enter Ethereum address to login');
		}
		else {
			$('#user .login .result').html('<b>Your account info</b> <br />' +
				'Currently logged in as: <code>' + curAcct + '</code>' +
				'<br />Account balance: ' + getEtherBalance(curAcct) + ' ETH' +
				'<br />Credit score: ');
			LoanDB.getCreditScore(curAcct, {from:curAcct}).then(function(score) { 
			  $('#user .login .result').append(score.toNumber());
		  });			
		}
	}	

	function validateIndex(index) {
		index = parseInt(index);
		if(isNaN(index) || index < 0) {
			alert('Error: index must be a positive integer');
			return false;
		}
		else return true;
	}

	function validateScore(score) {
		score = parseFloat(score);
		if(isNaN(score) || score < 0) {
			alert('Error: score must be >= 0');
			return false;
		}
		else return true;
	}

	function indexOutOfBounds(index) {
		console.log('Error: index out of array bounds');
		alert('Error: index out of bounds');
	}

	function validateInputs(inputs) {
		var invalidInput = 0;
		for (i = 0; i < inputs.length; i++) {
			if (isNaN(parseFloat(inputs[i])) || parseFloat(inputs[i]) <= 0 ) {
				invalidInput = invalidInput + 1;
			}
		}
		if (invalidInput > 0) {
			alert('amount, repayable and duration must be > 0');
			return false;
		}
		else return true;
	}

	function loggedIn() {
		if (curAcct == 0) {
			alert('Error: please log in');
			return false;
		}
		else return true;
	}

  function foo() {
  	alert('bar');
  };

  //helper functions for promises
  function takenPromise(curLoan) {return curLoan.taken({from:curAcct}).then(function(tkn) {return tkn;})}

  function requestPromise(curLoan) {return curLoan.request({from:curAcct}).then(function(rq) {return rq;})}

  function amtPromise(curLoan) {return curLoan.amt({from:curAcct}).then(function(amt) {return web3.fromWei(amt, 'ether');})}

  function rpyPromise(curLoan) {return curLoan.rpy({from:curAcct}).then(function(rpy)
  	{return web3.fromWei(rpy, 'ether');})}

  function durPromise(curLoan) {return curLoan.duration({from:curAcct}).then(function(dur) {return dur;})}

  function minScorePromise(curLoan) {return curLoan.minScore({from:curAcct}).then(function(minScore) {return minScore;})}

  function borrowerPromise(curLoan) {return curLoan.borrower({from:curAcct}).then(function(brw) {return brw;})}

  function ownerPromise(curLoan) {return curLoan.owner({from:curAcct}).then(function(owner) {return owner.toString();})}

  function borrowerScorePromise(curLoan) {return curLoan.getCreditScore({from:curAcct}).then(function(score)
  	{return parseInt(score);})}

  function deadlinePromise(curLoan) {return curLoan.deadline({from:curAcct}).then(function(deadline)
  	{return formatDate(deadline);})}

  function repaidPromise(curLoan) {return curLoan.repaid({from:curAcct}).then(function(repaid)
  	{return repaid;})}

  //*****************************
	//******* docment.ready *******
	//*****************************

	lsAccts();	//ls accounts and balances
	displayLoginInfo();	//log in and display accounts[0]

	//*****************************
	//****** misc   handlers ******
	//*****************************

	//12.04 - accounts and balances button handler
	$('#user .ls-accts button').click(function() {
		lsAccts();
  });

  //12.04 - foo
  $('#user .foo button').click(function() {
  	//$('#ethel .test-display .result').append('bar');
  	foo();
  });

	//12.04
	//Login on Ethel screen - no validation to check address format/length yet
	$('#user .login button.login').click(function() {
	  curAcct = $('#user .login .addr').val();
		displayLoginInfo();
	  $('#user .cp .result').html("");
		$('#user .repay-loan .result').html("");
		$('#user .rm-loan .result').html("");
		$('#user .lend .view-rq-result').html("");
		$('#user .lend .fill-rq-result').html("");
		$('#user .lend .make-of-result').html("");
		$('#user .borrow .view-of-result').html("");
		$('#user .borrow .take-of-result').html("");
		$('#user .borrow .make-rq-result').html("");
	});

	//Log out
	$('#user .login button.logout').click(function() {
		curAcct = 0;
		$('#user .login .result').html('<b>Logged out</b><br />Enter Ethereum account to log in');
	  $('#user .cp .result').html("");
		$('#user .repay-loan .result').html("");
		$('#user .rm-loan .result').html("");
		$('#user .lend .view-rq-result').html("");
		$('#user .lend .fill-rq-result').html("");
		$('#user .lend .make-of-result').html("");
		$('#user .borrow .view-of-result').html("");
		$('#user .borrow .take-of-result').html("");
		$('#user .borrow .make-rq-result').html("");
	});

	//12.04 - Clear login
	$('#user .login button.clear').click(function() {
		$('#user .login .addr').val('');
	});

	//++++++++++++++++++++++++++++
	//13.04 ++++ User CP +++++++++
	//++++++++++++++++++++++++++++

	//13.04 - View all loans and offers for this user
	$('#user .cp button.all').click(function() {
		if (loggedIn()) {
			LoanDB.getLen({from:curAcct}).then(function(len) {
				if (len == 0 ) {  //if no loans in LoanDB
					$('#user .cp .result').html('No loans in database');
				}
				else {
					$('#user .cp .result').html('<b>All loans lent, loans taken, requests and offers:</b> <br />');  //reset output
					for (var i = 0; i < len; i++) {		//iterate over array in JS not in solidity to contract out of gas
						(function (i) {									//js closure
							LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {		//get loan at loop index i
								curLoan = new EmbarkJS.Contract({
									abi: Loan.abi,
									address: addr
								});
								Promise.all([	//get all the loan data
									takenPromise(curLoan),  //0 taken/avail
									requestPromise(curLoan),  //1 request/offer
									amtPromise(curLoan),  //2 amount ether
									rpyPromise(curLoan),  //3 repayment ether
									durPromise(curLoan),  //4 duration days
									ownerPromise(curLoan),  //5 owner
									borrowerPromise(curLoan),	//6 borrower
									deadlinePromise(curLoan),	//7 deadline
									repaidPromise(curLoan)		//8 repaid true/false
									]).then(function(values){
										var displayToUser = false;
										var typeString = '';
											if (values[0] && values[5] == curAcct) {	//taken = true, owner = lender = cur
												typeString = '<b>LENT</b> ';
												values[6] = '<br />Borrower: <code>' + values[6] + '</code>';
												values[5] = '<br>Owner: <code>' + values[5] + '</code>';
												displayToUser = true;
												if (values[8]) { values[8] = " // <font color='green'><b>REPAYMENT COMPLETE</b></font>"; }
												else if (!values[8]) { values[8] = " // <font color='crimson'><b>AWATING REPAYMENT</b></font>"; }
											}
											else if (values[0] && values[6] == curAcct) {
												typeString = '<b>BORROWED</b> ';
												values[6] = '<br />Borrower: <code>' + values[6] + '</code>';
												values[5] = '<br />Owner: <code>' + values[5] + '</code>';
												displayToUser = true;
												if (values[8]) { values[8] = " // <font color='green'><b>REPAID</b></font>"; }
												else if (!values[8]) { values[8] = " // <font color='crimson'><b>UNPAID</b></font>"; }
											}
											else if (!values[0] && !values[1] && values[5] == curAcct) {
												typeString = '<b>OFFERING</b> ';
												values[7] = 'N/A';				//7 deadline n/a
												values[6] = 'N/A';				//borrower N/A for offer
												displayToUser = true;
												values[8] = '';						//8 repaid n/a
												values[5] = ''; values[6] = '';
											}
											else if (!values[0] && values[1] && values[5] == curAcct) { //if avail & request & owner
												typeString = '<b>REQUESTING</b> ';
												values[7] = 'N/A';				//7 deadline n/a
												values[6] = 'N/A';				//borrower N/A for viewing own requests
												displayToUser = true;
												values[8] = '';						//8 repaid n/a
												values[5] = ''; values[6] = '';
											}
											else if (values[5] == curAcct || values[6] == curAcct) {
												typeString = '<b>ERROR UNKNOWN TYPE</b>';
												displayToUser = true;
											}
											if (displayToUser) {
												var interest = ((parseFloat(values[3]) - parseFloat(values[2])) / parseFloat(values[2]) * 100).toFixed(2);
												$('#user .cp .result').append(i + ': ' +  typeString + ' // ' +
													values[2]  + ' ETH // Repay ' + values[3] + ' ETH // ' + values[4] +
													' days // Interest: ' + interest + '% // Deadline: ' + values[7] + values[8] + 
													values[5] + values[6] + '<br />');
											}
									});
							});
						})(i);
					}
				}
			});	
		}
	});

	//User cp - View all loans lent by this user
	$('#user .cp button.lent').click(function() {
		if(loggedIn()){
			LoanDB.getLen({from:curAcct}).then(function(len) {
				if (len == 0 ) {  //if no loans in LoanDB
					$('#user .cp .result').html('No loans in database');
				}
				else {
					$('#user .cp .result').html('<b>Loans you\'ve lent:</b> <br />');  //reset output
					for (var i = 0; i < len; i++) {		//iterate over array in JS not in solidity to contract out of gas
						(function (i) {									//js closure
							LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {		//get loan at loop index i
								curLoan = new EmbarkJS.Contract({
									abi: Loan.abi,
									address: addr
								});
								Promise.all([	//get all the loan data
									takenPromise(curLoan),  //0 taken/avail
									requestPromise(curLoan),  //1 request/offer
									amtPromise(curLoan),  //2 amount ether
									rpyPromise(curLoan),  //3 repayment ether
									durPromise(curLoan),  //4 duration days
									ownerPromise(curLoan),  //5 owner
									deadlinePromise(curLoan),	//6 deadline
									borrowerPromise(curLoan),	//7 borrower
									repaidPromise(curLoan)		//8 repaid true/false
									]).then(function(values){
											if (values[8]) { values[8] = " // <font color = 'green'><b>REPAYMENT COMPLETE</b></font>"; }
												else { values[8] = " // <font color='crimson'><b>AWAITING REPAYMENT</b></font>"; }
											if (values[0] && values[5] == curAcct) {		//if loan is taken and user is owner
												//and belongs to logged in user
												//output loan params
												var interest = ((parseFloat(values[3]) - parseFloat(values[2])) / parseFloat(values[2]) * 100).toFixed(2);
												$('#user .cp .result').append(i + ': ' +  //index
													' <b>LENT</b> // Lent ' + values[2]  + ' ETH // Repayment ' + values[3] + ' ETH // ' + values[4] +
													' days // Interest: ' + interest + '% // Deadline: ' + values[6] + values[8] + 
													//'<br />Owner: <code>' + values[5] + '</code>' +
													'<br />Borrower: <code>' + values[7] + '</code><br />');
											}
										});
							});
						})(i);
					}
				}
			});	
		}
	});

	//13.04 - View all loans taken by this user
	$('#user .cp button.taken').click(function() {
		if (loggedIn()) {
			LoanDB.getLen({from:curAcct}).then(function(len) {
				if (len == 0 ) {  //if no loans in LoanDB
					$('#user .cp .result').html('No loans in database');
				}
				else {
					$('#user .cp .result').html('<b>Loans you\'ve taken:</b> <br />');  //reset output
					for (var i = 0; i < len; i++) {		//iterate over array in JS not in solidity to contract out of gas
						(function (i) {									//js closure
							LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {		//get loan at loop index i
								curLoan = new EmbarkJS.Contract({
									abi: Loan.abi,
									address: addr
								});
								Promise.all([	//get all the loan data
									takenPromise(curLoan),  //0 taken/avail
									requestPromise(curLoan),  //1 request/offer
									amtPromise(curLoan),  //2 amount ether
									rpyPromise(curLoan),  //3 repayment ether
									durPromise(curLoan),  //4 duration days
									borrowerPromise(curLoan),  //5 borrower
									deadlinePromise(curLoan),	//6 deadline
									ownerPromise(curLoan),		//7 owner
									repaidPromise(curLoan)		//8 repaid true/false
									]).then(function(values){
										if (values[8]) { values[8] = "<font color='green'><b>REPAID</b></font>"; }
											else { values[8] = "<font color='crimson'><b>UNPAID</b></font>"; }
										if (values[0] && values[5] == curAcct) {		//if loan is taken and user is borrower
											//and belongs to logged in user
											//output loan params
											var interest = ((parseFloat(values[3]) - parseFloat(values[2])) / parseFloat(values[2]) * 100).toFixed(2);
											$('#user .cp .result').append(i + ': ' +  //index
												' <b>TAKEN</b> // Borrowed ' + values[2]  +
												' ETH // Repay ' + values[3] + ' ETH // '+
												values[4] + ' days // ' +
												'Interest: ' + interest + '% // ' +
												'Deadline: ' + values[6] + ' // ' +
												values[8] + '<br />Lender: <code>' + values[7] + '</code><br />' );
										}
									});
							});
						})(i);
					}
				}
			});	
		}
	});

	//13.04 - View all loan offers from this user
	$('#user .cp button.offers').click(function() {
		if (loggedIn()){
				LoanDB.getLen({from:curAcct}).then(function(len) {
				if (len == 0 ) {  //if no loans in LoanDB
					$('#user .cp .result').html('No loans in database');
				}
				else {
					$('#user .cp .result').html('<b>Your loan offers:</b> <br />');  //reset output
					for (var i = 0; i < len; i++) {		//iterate over array in JS not in solidity to contract out of gas
						(function (i) {									//js closure
							LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {		//get loan at loop index i
								curLoan = new EmbarkJS.Contract({
									abi: Loan.abi,
									address: addr
								});
								Promise.all([	//get all the loan data
									takenPromise(curLoan),  //0 taken/avail
									requestPromise(curLoan),  //1 request/offer
									amtPromise(curLoan),  //2 amount ether
									rpyPromise(curLoan),  //3 repayment ether
									durPromise(curLoan),  //4 duration days
									minScorePromise(curLoan),  //5 minimum score
									ownerPromise(curLoan)  //6 owner
									]).then(function(values){
											if (!values[0] && !values[1] && values[6] == curAcct) {		//if loan is avail and is offer
												//and belongs to logged in user
												//output loan params
												var interest = ((parseFloat(values[3]) - parseFloat(values[2])) / parseFloat(values[2]) * 100).toFixed(2);
												$('#user .cp .result').append(i + ':' +  //index
													' <b>OFFER</b> // Offering ' + values[2]  + ' ETH // Repay ' + values[3] + ' ETH // ' + values[4] +
													' days // Interest: ' + interest + '% // Minimum score ' + values[5] + '<br />');
											}
										});
							});
						})(i);
					}
				}
			});
		}
	});

	//13.04 - View all loan requests from this user
	$('#user .cp button.requests').click(function() {
		if (loggedIn()) {
			LoanDB.getLen({from:curAcct}).then(function(len) {
				if (len == 0 ) {  //if no loans in LoanDB
					$('#user .cp .result').html('No loans in database');
				}
				else {
					$('#user .cp .result').html('<b>Your loan requests:</b> <br />');  //reset output
					for (var i = 0; i < len; i++) {		//iterate over array in JS not in solidity to contract out of gas
						(function (i) {									//js closure
							LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {		//get loan at loop index i
								curLoan = new EmbarkJS.Contract({
									abi: Loan.abi,
									address: addr
								});
								Promise.all([	//get all the loan data
									takenPromise(curLoan),  //0 taken/avail
									requestPromise(curLoan),  //1 request/offer
									amtPromise(curLoan),  //2 amount ether
									rpyPromise(curLoan),  //3 repayment ether
									durPromise(curLoan),  //4 duration days
									ownerPromise(curLoan)  //5 owner
									]).then(function(values){
											if (values[1] && values[5] == curAcct) {		//if loan is request and owned by logged in user
												//output loan params
												var interest = ((parseFloat(values[3]) - parseFloat(values[2])) / parseFloat(values[2]) * 100).toFixed(2);
												$('#user .cp .result').append(i + ': ' +  //index
													' <b>REQUEST</b> Requesting ' + values[2]  + ' ETH // Repay ' + values[3] +
													' ETH // ' + values[4] + ' days // Interest: ' + interest + '% <br />');
											}
										});
							});
						})(i);
					}
				}
			});
		}
	});	

	//14.04 User CP - Repay loan
	$('#user .repay-loan button.repay').click(function() {
		if (loggedIn()){
			var index = $('#user .repay-loan input.index').val();

			if(validateIndex(index)) {
				LoanDB.getLoan(index, {from:curAcct}).then(function(addr) {
					curLoan = new EmbarkJS.Contract({
						abi: Loan.abi,
						address: addr
					});
					Promise.all([												//values
						rpyPromise(curLoan),							//0 rpy
						borrowerPromise(curLoan),					//1 borrower
						amtPromise(curLoan),							//2 amt
						repaidPromise(curLoan),						//3 is repaid true/false
						ownerPromise(curLoan)							//4 owner/lender
						]).then(function(values) {
							if(values[3]) {
								$('#user .repay-loan .result').html('<b>ERROR:</b> this loan has already been repaid');
							}
							else if (values[0] > parseFloat(web3.fromWei(web3.eth.getBalance(curAcct), 'ether'))){
								$('#user .repay-loan .result').html('<b>ERROR:</b> you don\'t have enough ETH' +
									'<br />Repayment amount: ' + web3.fromWei(values[0],'ether') +
									'<br />Your account balance: ' + getEtherBalance(curAcct)
									);
							}
							else if (values[1] != curAcct) {
								$('#user .repay-loan .result').html('<b>ERROR:</b> you aren\'t the borrower for this loan');
							}
							else {
								curLoan.repay({from: curAcct, value: web3.toWei(values[0], 'ether'), gas: 4700000}).then(function() {
									$('#user .repay-loan .result').html("<font color = 'green'><b>Successfully repaid loan</b></font>" +
										'<br />Repaid ' + values[0] + ' ETH' + 
										//'<br />Loan: <code>' + addr + '</code>' + 
										'<br />Borrower: <code>' + values[1] + '</code>' +
										'<br />Lender: <code>' +  values[4] + '</code>'
										);
								});
							}
						});
				});//.catch(indexOutOfBounds());
			}		
		}
	});

	//14.04 USER CP - Remove loan - Withdraw repayment
	$('#user .rm-loan button').click(function() {
		if (loggedIn()) {
		  var index = $('#user .rm-loan input.index').val();

			if(validateIndex(index)) {
				LoanDB.getLoan(index, {from:curAcct}).then(function(addr) {
					curLoan = new EmbarkJS.Contract({
						abi: Loan.abi,
						address: addr
					});

					var bal = getEtherBalance(addr);

					Promise.all([
						ownerPromise(curLoan),																															//0 owner
						borrowerPromise(curLoan),																														//1 borrower
						curLoan.deadline({from:curAcct}).then(function(deadline) { return deadline; }),			//2 deadline
						curLoan.repaidTime({from:curAcct}).then(function(repaidTime) {return repaidTime;}),	//3 repaidTime
						takenPromise(curLoan),																															//4 taken true/false
						repaidPromise(curLoan),																															//5 repaid true/false
						requestPromise(curLoan)																															//6 request / offer
						]).then(function(values) {
							var outStr = '';
							var lenderStr = '';
							var borrowerStr = '';
							if (values[4]) { 
								if ( parseInt(values[3]) > parseInt(values[2]) && values[5]) {
									outStr = "<font color='crimson'>Loan was repaid after deadline - credit score penalty applied to borrower</font>";
								}
								else if ( parseInt(values[3]) > parseInt(values[2]) && !values[5] ) {
									outStr = "<font color='crimson'>Loan unpaid after deadline - credit score penalty applied to borrower</font>";
								}
								else if ( parseInt(values[3]) < parseInt(values[2]) && values[5] ) {
									outStr = "<font color='green'>Loan was repaid before deadline - borrower credit score increased</font>";
								}
								else if( parseInt(values[3]) < parseInt(values[2]) && !values[5] ) {
									outStr = "<font color='burgundy'>Loan removed before repayment deadline - borrower credit score unaffected</font>";
								}
								lenderStr = '<br />Lender: <code>' + values[0] + '</code>';
								borrowerStr = '<br />Borrower: <code>' + values[1] + '</code>';
								outStr += "<br />Deadline: " + values[2] + "<br />Repayment timestamp: " + values[3];
							}
							else if (!values[4]) {
							 	if(values[6]) { outStr = "<font color='blue'>Loan request was not filled</font>";	}
							 	else if (!values[6]) { outStr = "<font color='blue'>Loan offer was not taken</font>"; }
							 	lenderStr = '';
							 	borrowerStr = '';
							}
							else { outStr = "<b>Uncategorised loan type</b>" ;}
							if(values[0] == curAcct) {
								LoanDB.rmLoan(index, {from:curAcct, gas:4700000}).then(function() {
									curLoan.kill({from:curAcct}).then(function() {
										$('#user .rm-loan .result').html("<font color = 'green'><b>Successfully removed loan</b></font>" +
											'<br />' + outStr + 
											'<br />Withdrew ' + bal + ' ETH' +
											//'<br />Loan: <code>' + addr + '</code>' +
											lenderStr + borrowerStr
											);
									})
								});
							}
							else {
								$('#user .rm-loan .result').html('<b>ERROR: Couldn\'t remove loan - check index</b>');
							}
						});//.catch(console.log('Promise.all rejection'));
						//alert(addr + ' bal: ' + bal);
				});//.catch(indexOutOfBounds());//.catch(console.log('LoanDB.getLoan rejection'));
			}			
		}
	});


	//++++++++++++++++++++++++++++
	//13.04 ++++ Lend ETH ++++++++
	//++++++++++++++++++++++++++++

	//13.04 - Lend ETH - view requests
	$('#user .lend button.view-rq').click(function() {
		if(loggedIn()){
			//first get the array length
			LoanDB.getLen({from:curAcct}).then(function(len) {
				if (len == 0 ) {  //if no loans in LoanDB
					$('#user .lend .view-rq-result').html('No loans in database');
				}
				else {
					$('#user .lend .view-rq-result').html('<b>Requests found:</b> <br />');  //reset output
					for (var i = 0; i < len; i++) {		//iterate over array in JS not in solidity to contract out of gas
						(function (i) {									//js closure
							LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {		//get loan at loop index i
								curLoan = new EmbarkJS.Contract({
									abi: Loan.abi,
									address: addr
								});

								Promise.all([	//get all the loan data
									takenPromise(curLoan),  //0 taken/avail
									requestPromise(curLoan),		//1 request/offer
									amtPromise(curLoan), //2 loan amount in ether
									rpyPromise(curLoan), //3 repayment amt in ether
									durPromise(curLoan),		//4 loan duration in days
									//borrowerScorePromise(curAcct) //5 borrower/requester credit score
									borrowerScorePromise(curLoan) //5 borrower/requester credit score
									]).then(function(values){
											if (values[1] && !values[0]) {		//if loan is REQUEST & taken is false i.e. avail = true
												//output loan params
												var interest = ((parseFloat(values[3]) - parseFloat(values[2])) / parseFloat(values[2]) * 100).toFixed(2);
												$('#user .lend .view-rq-result').append(i + ': <b>REQEUST</b>' +  //index
													' Borrow ' + values[2]  + ' ETH // Repay ' + values[3] + ' ETH // ' + values[4] +
													' days // Interest: ' + interest +'% // Requester credit score: ' + values[5] + '<br />');
											}
											else { //note implemented yet on front-end
												//marked for deletion
												var numAvail = (len + 1) - (i + 1);;
												$('#user .lend .total-rq').html(numAvail + ' requests found');
											}
										});
							});
						})(i);
					}
				}
			});
		}
	});	

	//13.04 - Lend ETH - fill request - validation and error catching complete
	$('#user .lend button.fill-rq').click(function() {
		if (loggedIn()) {
			var index = $('#user .lend input.fill-rq-index').val();

			if (validateIndex(index)) {
				LoanDB.getLoan(index, {from:curAcct}).then(function(addr) {
					curLoan = new EmbarkJS.Contract({
						abi: Loan.abi,
						address: addr
					});
					Promise.all([
						amtPromise(curLoan), 			//0 amt
						borrowerPromise(curLoan), //1 borrower
						durPromise(curLoan),			//2 duration
						rpyPromise(curLoan),				//3 rpy
						requestPromise(curLoan)		//4 true = request, false = offer
						]).then(function(values) {
							if (!values[4]) {
								alert('Error: enter the index of a request');
							}
							else if (values[1] == curAcct) {
								alert('Error: You can\'t fill your own request');
								//$('#user .lend .fill-rq-result').html('<b>ERROR: You can\'t fill your own request</b>');
							}
							else {
								var bal = parseFloat(web3.toWei(values[0]));
								var rpy = web3.fromWei(values[3], 'ether');
								var interest = ((parseFloat(values[3]) - parseFloat(values[0])) / parseFloat(values[0]) * 100).toFixed(2);
								curLoan.fillRequest({from:curAcct, value: bal, gas:4700000}).then(function(success) {
									$('#user .lend .fill-rq-result').html("<font color='green'><b>Filled loan request</b></font>" + 
										'<br />Loaned ' + values[0] + ' ETH ' + ' for ' + values[2] + ' days at ' + interest + '%' +
										'<br />Repayment amount: ' + values[3] + ' ETH' +
										'<br />Borrower: <code>' + values[1]  + '</code>' +
										'<br />Loan: <code>' + addr + '</code>');
								}).catch(function() { console.log('curLoan.fillRequest rejection')});
							}
						}).catch(function() {console.log('Promise.all rejection')});
				});//.catch(indexOutOfBounds(index));/*catch(function() {
					/*console.log('LoanDB.getLoan rejection - index out of bounds');
					alert('Error: index ' + index + ' out of bounds');
				});	*/		
			}			
		}

	});

	//13.04 - Lend ETH - make offer
	$('#user .lend button.make-of').click(function() {
		if (loggedIn()){
			var amt = $('#user .lend input.amt').val();
			var rpy = $('#user .lend input.rpy').val();
			var minScore = $('#user .lend input.min-score').val();
			var dur = $('#user .lend input.dur').val();

			if (validateInputs([amt, rpy, dur]) && validateScore(minScore) ){
				var amtWei = web3.toWei(amt, 'ether');
				var rpyWei = web3.toWei(rpy, 'ether');

				//deploy params: amount, repayment, duration, minScore, isRequest, dbAddr
				Loan.deploy([amtWei, rpyWei, dur, minScore, false, dbAddr], {from:curAcct, value: amtWei, gas:4700000}).then(function(deployedLoan) {
					LoanDB.pushLoan(deployedLoan.address, {from:curAcct, gas:4700000}).then(function() {
						//web3.eth.sendTransaction({from:curAcct, to: deployedLoan.address, value: amtWei});
						//var bal = getEtherBalance(deployedLoan.address);
						var interest = (( parseFloat(rpyWei) - parseFloat(amtWei )) / parseFloat(amtWei) * 100).toFixed(2);
						$('#user .lend .make-of-result').html(
							"<font color='green'><b>Successfully created loan offer</b></font>" +
							'<br />Offering ' + amt + ' ETH for ' + dur + ' days at ' + interest +
							'% to borrowers with score ' + minScore + ' or greater' +
							'<br />Loan: <code>' + deployedLoan.address + '</code>'
							);
					});
				});
			}			
		}
	});

	//Lend ETH - clear make offer text input boxes
	$('#user .lend button.clear').click(function() {
		$('#user .lend input').val('');
	});

	//++++++++++++++++++++++++++++
	//13.04 ++ Borrow ETH ++++++++
	//++++++++++++++++++++++++++++

	//13.04 - Borrow ETH - view offers
	$('#user .borrow button.view-of').click(function() {
		if (loggedIn()) {
			//first get the array length
			LoanDB.getLen({from:curAcct}).then(function(len) {
				if (len == 0 ) {  //if no loans in LoanDB
					$('#user .borrow .view-of-result').html('No loans in database');
				}
				else {
					$('#user .borrow .view-of-result').html('<b>Offers found:</b> <br />');  //reset output
					for (var i = 0; i < len; i++) {		//iterate over array in JS not in solidity to contract out of gas
						(function (i) {									//js closure
							LoanDB.getLoan(i, {from:curAcct}).then(function(addr) {		//get loan at loop index i
								curLoan = new EmbarkJS.Contract({
									abi: Loan.abi,
									address: addr
								});

								Promise.all([	//get all the loan data
									takenPromise(curLoan),  //0 taken/avail
									requestPromise(curLoan),		//1 request/offer
									amtPromise(curLoan), //2 loan amount in ether
									rpyPromise(curLoan), //3 repayment amt in ether
									durPromise(curLoan),		//4 loan duration in days
									minScorePromise(curLoan)  //5 min borrower credit score
									]).then(function(values){
											if (!values[0] && !values[1]) {		//if loan is avail and is offer
												//output loan params
												var interest = ((parseFloat(values[3]) - parseFloat(values[2])) / parseFloat(values[2]) * 100).toFixed(2);
												$('#user .borrow .view-of-result').append(i + ': <b>OFFER</b>' +  //index
													' Borrow ' + values[2]  + ' ETH // Repay ' + values[3] + ' ETH // ' + values[4] +
													' days // Interest: ' + interest + '% // Minimum credit score: ' + values[5] + '<br />');
											}
										}).catch('Promise.all rejection');
							});
						})(i);
					}
				}
			});			
		}
	});

	//14.04 - Borrow ETH - take loan offer
	$('#user .borrow button.take-of').click(function() {
		if (loggedIn()) {
			var index = $('#user .borrow input.index').val();
			if(validateIndex(index)) {

					LoanDB.getLoan(index, {from: curAcct}).then(function(addr) {
					curLoan = new EmbarkJS.Contract({
						abi: Loan.abi,
						address: addr
					});

					curLoan.taken().then(function(tkn) {  //check if loan is avail
						if(!tkn) {													//if so
							Promise.all([																														//values
								curLoan.takeLoan({from: curAcct, gas:4700000}).then(function(success) { //0 take loan
									console.log(success);
									console.log(success.name);
									return success;
								}),
								amtPromise(curLoan),																									//1 amt
								rpyPromise(curLoan),																									//2 rpy
								minScorePromise(curLoan),																							//3 minscore
								LoanDB.getCreditScore(curAcct, {from:curAcct}).then(function(brwScore) { //4 borrower credit score
									return brwScore.toNumber();
								}),
								durPromise(curLoan)																										//5 duration
								]).then(function(values) {
									Promise.all([										//innerValues
										takenPromise(curLoan),				//0 success/failure
										deadlinePromise(curLoan),			//1 deadline
										ownerPromise(curLoan),				//2 owner promise
										borrowerPromise(curLoan)			//3 borrower promise
										]).then(function(innerValues) {
											if(innerValues[0]) {	//if taken i.e. success
												var interest = ((parseFloat(values[2]) - parseFloat(values[1])) / parseFloat(values[1]) * 100).toFixed(2);
												$('#user .borrow .take-of-result').html("<font color = 'green'><b>Took loan offer</b></font>" +
													'<br />Borrowed ' + values[1] + ' ETH for ' + values[5] + ' days at ' + interest + '%' +
													'<br />Repay ' + values[2] + ' ETH by ' + innerValues[1] +
													'<br />Lender: <code>' + innerValues[2] + '</code>' +
													'<br />Loan: <code>' + addr + '</code>');
											}
											else if (!innerValues[0] && innerValues[2] == curAcct){ //if loan not taken & trying to take own offer
												$('#user .borrow .take-of-result').html('<b>ERROR: You can\'t take your own loan offer</b>' +
													'<br />This is a mechanism to prevent you from gaming the credit score system');
											}
											else if (!innerValues[0] && values[4] < values[3]) { //if credit score too low
												$('#user .borrow .take-of-result').html("<font color='red'><b>DENIED: Your credit score is too low</b></font>" +
													'<br />Your credit score: ' + values[4] +
													'<br />Minimum required score: ' + values[3]);
											}
											else {	//generic failure case
												$('#user .borrow .take-of-result').html('<b>ERROR: Something went wrong</b>');
											}
										});
								});
						}
					});
				});
			}			
		}
	});

	//13.04 - Borrow ETH - make request
	$('#user .borrow button.make-rq').click(function() {
		if (loggedIn()) {
			var amt = $('#user .borrow input.amt').val();
			var rpy = $('#user .borrow input.rpy').val();
			var dur = $('#user .borrow input.dur').val();

			if (validateInputs([amt, rpy, dur])) {
				var amtWei = web3.toWei(amt, 'ether');
				var rpyWei = web3.toWei(rpy, 'ether');
				//deploy params: amount, repayment, duration, minScore, isRequest, dbAddr
				Loan.deploy([amtWei, rpyWei, dur, 0, true, dbAddr], {from:curAcct})
				.then(function(deployedLoan) {
					LoanDB.pushLoan(deployedLoan.address).then(function() {
						//var bal = getEtherBalance(deployedLoan.address);
						var interest = ((parseFloat(rpyWei) - parseFloat(amtWei)) / parseFloat(amtWei) * 100).toFixed(2);
						$('#user .borrow .make-rq-result').html(
							"<font color='green'><b>Successfully created loan request</b></font>" +
							'<br />Requesting ' + amt + ' ETH for ' + dur + ' days at ' + interest + '%' +
							'<br />Repayment amount: ' + rpy + 'ETH' +
							'<br />Borrower: <code>' + curAcct + '</code>' +
							'<br />Loan: <code>' + deployedLoan.address + '</code>');
					});
				});
			}
		}
	});

	$('#user .borrow button.clear').click(function() {
		$('#user .borrow input').val('');
	});


	//## marked for deletion 12.04 #############x`
  //handlers for the modded loandb
  $('#sand .dbmod .mk button').click(function() {
  	LoanDB.mkLns({from:curAcct}).then(function() {
  		$('#sand .dbmod .mk result').html('added loans');
  	});
  });

  $('#sand .dbmod .get-amt button').click(function() {
  	var index = ('#sand .dbmod .get-amt input').val();
  	LoanDB.getLnAmt(index, {from:curAcct}).then(function(amt) {
  		$('#sand .dbmod .get-amt .result').html(amt);
  	});
  });

});