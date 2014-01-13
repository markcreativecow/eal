localStorage['serviceURL'] = 'http://creativecowstaging.co.uk/ealserver/';
var serviceURL = localStorage['serviceURL'];
var scroll = new iScroll('wrapper', {
    vScrollbar: false, 
    hScrollbar:false, 
    hScroll: false
});
var item;
$(window).load(function() {
    setTimeout(getMoreList, 100);
    setTimeout(getShareList, 100);
    $('#wrapper, #header').click(function() {
        hideOverlays();
    });
});
$(document).ajaxError(function(event, request, settings) {
    $('#busy').hide();
    alert('Error accessing the server');
});
function openWindow(target) {
    window.open(encodeURI(target), '_system');
	return false;
}
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
function getMoreList() {
    $('#busy').show();
    $.getJSON(serviceURL + 'api/rest/info/format/json', function(data) {
        $('#busy').hide();
        $('#moreList li').remove();
        $.each(data, function(index, item) {
            $('#moreList').append(
                '<li class="icon ' + item.icon + '">' +
                '<a href="' + item.link + '" onclick="openWindow(\'' + item.link + '\');">' +
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
                '<a href="' + item.link + '" onclick="openWindow(\'' + item.link + '\');">' +
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