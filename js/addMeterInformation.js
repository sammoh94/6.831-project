(function () {
	var officialDataRef = new Firebase("https://streetparkofficialdata.firebaseio.com/");
	var meters = officialDataRef.child("meters");

	$(document).ready(function () {
		$("#goback").click(function() {
	    	window.location="officialListView.html"
	    }); 

		$(".form-control").keyup(function () {
			var empty = false;
			$(".form-control").each(function () {
				if ($(this).val().length == 0) {
					empty = true
				}
			});
			if (!empty) {
				$("#submitCarInfo").attr("disabled", false);
			}
		})
		$("#submitCarInfo").click(function () {
			console.log('clicked');
			var lotName = $("#parkingLotName").val();
			var lotAddress = $("#parkingLotFullAddress").val();
			var meterNumber = $("#meterNumber").val();
			var licensePlateNumber = $("#licensePlateNumber").val();
			var timeRemaining = $("#timeRemaining").val();
			meters.push().set({
				name: lotName,
				address: lotAddress,
				meterNumber: meterNumber,
				licensePlateNumber: licensePlateNumber,
				timeRemaining: timeRemaining,
				createdAt: $.now()
			});
			window.location = "officialListView.html";
			return false;
		});
	});
})();