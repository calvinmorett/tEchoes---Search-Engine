$(document).ready(function () {

	var query = getUrlParameter('query');
	var page = parseInt(getUrlParameter('page'));

	$("#search_text").val(query);

	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: 'http://localhost/action_page.php',
		data: {
			query: query,
			page: page
		},
		success: function (data) {
			console.log(data);
			make_results(data);
			generate_buttons(data);
		}
	});


	$(document).on('keypress', function (e) {
		if (e.which == 13)
			//console.log('?query=' + $("#search_text").val());
			$(location).attr('href', '?query=' + $("#search_text").val() + '&page=' + 1);
	});


	function make_results(data) {

		for (let i = 0; i < data.length; i++) {
			$("#results" + i).empty();
			for (let j = 0; j < data[i].length; j++)
				$('#results' + i).append('<li><a href="' + data[i][j]['url'] + '">' + data[i][j]['title'] + '</a></li>');
		}

	}

	function generate_buttons(data) {

		// Prev Button
		if (page > 1)
			$('#pages').append('<a class="navigate_button" href="?query=' + query + '&page=' + (page - 1) + '">Previous Page</a>');

		let show_next = false;
		for (let i = 0; i < data.length; i++) {
			console.log(data[i].length);
			if (data[i].length == 20) {
				show_next = true;
				break;
			}
		}
		// Next Button
		if (show_next)
			$('#pages').append('<a class="navigate_button" href="?query=' + query + '&page=' + (page + 1) + '">Next Page</a>');
	}


	/*
		found here: https://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js
	*/
	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
	};


});