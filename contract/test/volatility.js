contract('Volatility',function(sendRate) {
	it ("should add eurusd rate",function() {
		var volatility = Volatility.deployed();
		volatility.sendRate("eurusd",10599);
		volatility.sendRate("eurusd",10475);
		volatility.getRates.call("eurusd").then(console.log);
		volatility.calcVolatility.call("eurusd").then(function(volatility) {
			console.log(volatility.valueOf()/100.0);
		});
		volatility.sendRate("eurusd",10415);
		volatility.getRates.call("eurusd").then(console.log);
		volatility.calcVolatility.call("eurusd").then(function(volatility) {
			console.log(volatility.valueOf()/100.0);
		});
		volatility.sendRate("eurusd",10553);
		volatility.getRates.call("eurusd").then(console.log);
		volatility.calcVolatility.call("eurusd").then(function(volatility) {
			console.log(volatility.valueOf()/100.0);
		});
	});	
});