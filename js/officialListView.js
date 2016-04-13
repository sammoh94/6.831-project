(function () {
	function populateTable() {
		var tableElements = [];
		if (sessionStorage.getItem('tableElements') === null) {
			var values = [
			{"address": "9 Beacon St.", "meternum": "Meter #2722"},
			{"address": "24 Tremont St.", "meternum": "Meter #336"},
			{"address": "36 Berkeley St.", "meternum": "Meter #712"},
			{"address": "117 A St.", "meternum": "Meter #1098"}
			];
			tableElements = JSON.stringify(values);
			sessionStorage.setItem('tableElements', tableElements);
		} else {
			tableElements = sessionStorage.getItem('tableElements');
		}
		// check if tableElements is empty or not
		var parsedTableElements = JSON.parse(tableElements);
		if (parsedTableElements.length === 0) {
			var h1 = $("<h1 id='emptyListHeading'>No Expired Meters</h1>");
			$("#expiredTableBody").append(h1);
		} else {
			for (var i=0; i<parsedTableElements.length; i++) {
				var row = $("<tr id="+i+" class='officialItem' data-href='expiredMeter.html'><td data-th='Address'>" + parsedTableElements[i].address +"</td><td data-th='Meter #'>" + parsedTableElements[i].meternum + "</td></tr>");
				$("#expiredTableBody").append(row);
			}
		}
	}
	$(document).ready(function () {
		populateTable();
		$(".officialItem").click(function (event) {
			var $id = event.currentTarget.id;
			var listOfItems = [{'a':2, 'b': 3}];
			sessionStorage.setItem('clickedRow', $id);
			window.location = $(this).data("href");
		});
	});
})();