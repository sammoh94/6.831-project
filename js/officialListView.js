(function () {
	var meterListings = new Firebase("https://streetparkofficialdata.firebaseio.com/");
	var listOfExpiredMeters = [];
	var listOfWarningMeters = [];

	function retrieveDataAndPopulate() {
		var listOfMeters = [], 
			parkingLotAddresses = [];
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
					listOfExpiredMeters = [], listOfWarningMeters = [];
					var origin = response.originAddresses;
					var destination = response.destinationAddresses;
					var responseList = response.rows[0].elements;
					for (var i=0; i < responseList.length; i++) {
						var currentItem = responseList[i];
						listOfMeters[i].distance = parseFloat(currentItem.distance.text);
						if (Math.floor(($.now() - listOfMeters[i].createdAt)/ 60000) >= parseInt(listOfMeters[i].timeRemaining)) {
							// meter has expired
							listOfExpiredMeters.push(listOfMeters[i]);
						} else {
							listOfWarningMeters.push(listOfMeters[i]);
						}
					}
					populateExpiredTable(listOfExpiredMeters);
					populateWarningTable(listOfWarningMeters);
					sortByExpirationTime();
				}
			});
		});
	}

	function populateExpiredTable(expiredMeters) {
		$("#expiredList tr").remove();
		if (expiredMeters.length === 0) {
			var h1 = $("<h1 class='emptyListHeading'>No Expired Meters</h1>");
			$("#expiredTableBody").append(h1);
		} else {
			for (var i=0; i<expiredMeters.length; i++) {
				var row = $("<tr class='officialItem' data-href='expiredMeter.html'><td class=addressTD data-th='Address'>" + expiredMeters[i].name +"</td><td class=distanceTD data-th='distance'>" + expiredMeters[i].distance + " mi</td></tr>");
				$("#expiredTableBody").append(row);
				addSwipeTo();
			}
		}
	}

	function populateWarningTable(warningMeters) {
		$("#warningList tr").remove();
		if (warningMeters.length === 0) {
			var h1 = $("<h1 class='emptyListHeading'>No Warning Meters</h1>");
			$("#warningTableBody").append(h1);
		} else {
			for (var i=0; i<warningMeters.length; i++) {
				var row = $("<tr class='officialItem' data-href='warningMeter.html'><td class=addressTD data-th='Address'>" + warningMeters[i].name +"</td><td class=distanceTD data-th='distance'>" + warningMeters[i].distance + " mi</td></tr>");
				$("#warningTableBody").append(row);
			}
		}
	}

	function sortByExpirationTime() {
		var currentTimestamp = $.now()
		listOfExpiredMeters.sort(function (a, b) {
			var a_remainingTimeInMS = parseInt(a.timeRemaining) * 60000
			var b_remainingTimeInMS = parseInt(b.timeRemaining) * 60000
			var keyA = currentTimestamp - (a.createdAt + a_remainingTimeInMS),
				keyB = currentTimestamp - (b.createdAt + b_remainingTimeInMS);
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});

		listOfWarningMeters.sort(function (a, b) {
			var a_remainingTimeInMS = parseInt(a.timeRemaining) * 60000
			var b_remainingTimeInMS = parseInt(b.timeRemaining) * 60000
			var keyA = (a.createdAt + a_remainingTimeInMS) - currentTimestamp,
				keyB = (b.createdAt + b_remainingTimeInMS) - currentTimestamp;
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		populateExpiredTable(listOfExpiredMeters);
		populateWarningTable(listOfWarningMeters);
	}

	function sortByDistance() {
		listOfExpiredMeters.sort(function (a, b) {
			var keyA = a.distance,
				keyB = b.distance;
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		listOfWarningMeters.sort(function (a, b) {
			var keyA = a.distance,
				keyB = b.distance;
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		populateExpiredTable(listOfExpiredMeters);
		populateWarningTable(listOfWarningMeters);
	}

	function addSwipeTo() {
		$(".officialItem").swipe("destroy");
		$(".officialItem").swipe({
			swipe: function (event, direction, distance, duration, fingerCount) {
				switch(direction) {
					case "left":
						var $index = $(this).index();
						sessionStorage.setItem('selectedExpiredMeter', JSON.stringify(listOfExpiredMeters[$index]));
						window.location = "ticket.html";
						break;
				}
			}
		});
	}

	$(document).ready(function () {
		retrieveDataAndPopulate();
		setInterval(retrieveDataAndPopulate, 60000);
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

		$("#sort-distance").click(function () {
			sortByDistance();
			$("#sort-distance").css("border","2px solid #000");
			$("#sort-distance").css("color","black");
			$("#sort-distance").css("background-color","white");
			$("#sort-time").css("border","2px solid #fff");
			$("#sort-time").css("color","white");
			$("#sort-time").css("background-color","black");
		});

		$("#sort-time").click(function () {
			sortByExpirationTime();
			$("#sort-distance").css("border","2px solid #fff");
			$("#sort-distance").css("color","white");
			$("#sort-distance").css("background-color","black");
			$("#sort-time").css("border","2px solid #000");
			$("#sort-time").css("color","black");
			$("#sort-time").css("background-color","white");
		});

		$("#goback").click(function() {
		    window.location="officialActionSelection.html"
		});  
	});
})();