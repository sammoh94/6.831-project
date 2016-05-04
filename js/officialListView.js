(function () {
	var meterListings = new Firebase("https://streetparkofficialdata.firebaseio.com/");
	var meters = meterListings.child("meters");
	var listOfExpiredMeters = [];
	var listOfWarningMeters = [];

	function retrieveDataAndPopulate() {
		var listOfMeters = [], parkingLotAddresses = [];
		var dMatrix = new google.maps.DistanceMatrixService();
		// get all meters from firebase
		meterListings.on("value", function (snapshot) {
			for (var meter in snapshot.val().meters) {
				var meterObj = snapshot.val().meters[meter];
				meterObj.id = meter;
				listOfMeters.push(meterObj);
			}
			// list of parking lot addresses
			listOfMeters.forEach(function (element) {
				parkingLotAddresses.push(element.address);
			});
			var officialOriginAddress = sessionStorage.getItem("officialOriginAddress");
			dMatrix.getDistanceMatrix({
				origins: [officialOriginAddress],
				destinations: parkingLotAddresses,
				travelMode: google.maps.TravelMode.DRIVING,
				unitSystem: google.maps.UnitSystem.IMPERIAL,
				avoidHighways: false,
				avoidTolls: false 
			}, function (response, status) {
				if (status === google.maps.DistanceMatrixStatus.OK) {
					var origin = response.originAddresses;
					var destination = response.destinationAddresses;
					var responseList = response.rows[0].elements;
					for (var i=0; i < responseList.length; i++) {
						var currentItem = responseList[i];
						listOfMeters[i].distance = parseFloat(currentItem.distance.text);
						if (Math.floor(($.now() - listOfMeters[i].createdAt)/ 60000) > parseInt(listOfMeters[i].timeRemaining)) {
							// meter has expired
							listOfExpiredMeters.push(listOfMeters[i]);
						} else {
							listOfWarningMeters.push(listOfMeters[i]);
						}
					}
					console.log(listOfExpiredMeters, listOfWarningMeters);
					populateExpiredTable(listOfExpiredMeters);
					populateWarningTable(listOfWarningMeters)
				}
			});
		});
	}

	function populateExpiredTable(expiredMeters) {
		// check if expiredtableElements is empty or not
		if (expiredMeters.length === 0) {
			var h1 = $("<h1 class='emptyListHeading'>No Expired Meters</h1>");
			$("#expiredTableBody").append(h1);
		} else {
			for (var i=0; i<expiredMeters.length; i++) {
				var row = $("<tr class='officialItem' data-href='expiredMeter.html'><td data-th='Address'>" + expiredMeters[i].name +"</td><td data-th='distance'>" + expiredMeters[i].distance + " mi</td></tr>");
				$("#expiredTableBody").append(row);
			}
		}
	}

	function populateWarningTable(warningMeters) {
		if (warningMeters.length === 0) {
			var h1 = $("<h1 class='emptyListHeading'>No Warning Meters</h1>");
			$("#warningTableBody").append(h1);
		} else {
			for (var i=0; i<warningMeters.length; i++) {
				var row = $("<tr class='officialItem' data-href='warningMeter.html'><td data-th='Address'>" + warningMeters[i].name +"</td><td data-th='distance'>" + warningMeters[i].distance + " mi</td></tr>");
				$("#warningTableBody").append(row);
			}
		}
	}

	$(document).ready(function () {
		retrieveDataAndPopulate();
		// setInterval(retrieveDataAndPopulate, 60000);
		$("#expiredTableBody").on('click', '.officialItem', function (event) {
			var $index = $(this).index();
			sessionStorage.setItem('selectedExpiredMeter', JSON.stringify(listOfExpiredMeters[$index]));
			window.location = $(this).data("href");
		});

		$("#warningTableBody").on('click', '.officialItem', function (event) {
			var $index = $(this).index();
			sessionStorage.setItem('selectedWarningMeter', JSON.stringify(listOfWarningMeters[$index]));
			window.location = $(this).data("href");
		});

		$("#goback").click(function() {
		    window.location="officialActionSelection.html"
		});  
	});
})();