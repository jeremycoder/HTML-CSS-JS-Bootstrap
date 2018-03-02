$("button").on("click", function() {
	$("div").fadeOut(1600, function() {
		console.log("All Gone!");
		$(this).remove();
	});
});
