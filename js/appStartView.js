(function () {
	$(document).ready(function() {
    	var backgroundColor=$(".button").css('background-color');
    	var textColor=$(".button").css('color');
	    $(".button").hover(
	    function() {
	        //mouse over
	        $(this).css('background', '#76a3d6')
	        // $(this).css('color', backgroundColor)
	    }, function() {
	        //mouse out
	        $(this).css('background', backgroundColor)
	        // $(this).css('color', textColor)
	    });

	    $("#car_owner").click(function() {
	    	window.location="mapView.html"
	    });

	    $("#parking_official").click(function() {
	    	window.location="officialLogin.html"
	    });


    });	
})();