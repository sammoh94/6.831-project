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

	    $("#addMeter").click(function() {
	    	window.location="addMeterInformation.html"
	    });

	    $("#viewMeters").click(function() {
	    	window.location="officialListView.html"
	    });

	    $("#goback").click(function() {
	    	window.location="appStartView.html"
	    });  
	});
})();