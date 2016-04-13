(function () {
	$(document).ready(function () {
		$(".ownerItem").click(function (event) {
			window.location = $(this).data("href");
		});
	});
})();