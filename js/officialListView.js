(function () {
	$(document).ready(function () {
		$(".officialItem").click(function (event) {
			var $id = event.currentTarget.id;
			localStorage.setItem('clickedRow', $id);
			window.location = $(this).data("href");
		});
		console.log(localStorage.getItem('clickedRow'));
	});
})();