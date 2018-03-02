//Check off specific todos by clicking
$("ul").on("click", "li", function() {
	$(this).toggleClass("completed");
} );

//Remove when X is clicked
$("ul").on("click", "span", function(event) {
  $(this).parent().fadeOut(400, function() {
     $(this).remove();
  } );
  event.stopPropagation();
});

$("input[type='text']").keypress(function(event) {
	if (event.which === 13) {
	  //grab new todo text from input	
		var todoText = $(this).val();
		//create new li and add to ul
		$("ul").append("<li><span><i class='fa fa-trash' aria-hidden='true'></i></span> " + todoText + "</li>");
		//clear input
		$(this).val("");
	}
});

$(".fa-plus").on("click", function() {
  $("input[type='text']").fadeToggle(50);
});

