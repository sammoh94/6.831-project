(function () {
	$(document).ready(function () {
		$(".btn").click(function () {
			var currentRadius = $("#radiusSelect").val();
			var currentAddress = $("#inputAddress").val();
			sessionStorage.setItem('currentAddress', currentAddress);
			sessionStorage.setItem("radius", currentRadius);
		})
	});
})();