localStorage['serviceURL'] = 'http://creativecowstaging.co.uk/ealserver/';
var serviceURL = localStorage['serviceURL'];
var scroll = new iScroll('wrapper', {
    vScrollbar: false,
    hScrollbar: false,
    hScroll: false
});
$(window).load(function() {
    setTimeout(getMoreList, 100);
    setTimeout(getShareList, 100);
	$('#wrapper, #header').click(function(e) {
		if ($('.overlay').is(':visible')) {
			e.preventDefault();
			hideOverlays();
			return false;
		}
	});
});
$(document).on('click', '.external', function(e) {
	e.preventDefault();
	var targetURL = $(this).attr("href");
	window.open(targetURL, "_system");
});
$(document).ajaxError(function(event, request, settings) {
    $('#busy').hide();
    alert('Error accessing the server');
});
function hideOverlays() {
    $('.overlay').hide();
}
function showMoreOverlay() {
    hideOverlays();
    $('#moreOverlay').show();
}
function showShareOverlay() {
    hideOverlays();
    $('#shareOverlay').show();
}
var item;
function getMoreList() {
    $('#busy').show();
    $.getJSON(serviceURL + 'api/rest/info/format/json', function(data) {
        $('#busy').hide();
        $('#moreList li').remove();
        $.each(data, function(index, item) {
            $('#moreList').append(
                '<li class="icon ' + item.icon + '">' +
				'<a href="' + item.link + '" class="external">' +
                '<h2>' + item.name + '</h2>' +
                '<div class="clearfix"></div>' +
                '</a></li>'
            );
        });
        setTimeout(function(){
            scroll.refresh();
        });
    });
}
function getShareList() {
    $('#busy').show();
    $.getJSON(serviceURL + 'api/rest/social/format/json', function(data) {
        $('#busy').hide();
        $('#shareList li').remove();
        $.each(data, function(index, item) {
            $('#shareList').append(
                '<li class="icon ' + item.icon + '">' +
				'<a href="' + item.link + '" class="external">' +
                '<h2>' + item.name + '</h2>' +
                '<div class="clearfix"></div>' +
                '</a></li>'
            );
        });
        setTimeout(function(){
            scroll.refresh();
        });
    });
}