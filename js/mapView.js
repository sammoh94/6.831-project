(function () {
	$(document).ready(function () {
		$(".btn").click(function () {
			var currentRadius = $("#radiusSelect").val();
			var currentAddress = $("#inputAddress").val();
			sessionStorage.setItem('originAddress', currentAddress);
			sessionStorage.setItem("radius", currentRadius);
		})
	});
})();