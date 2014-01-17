var serviceURL = localStorage['serviceURL'];
var scroll = new iScroll('wrapper', {
    vScrollbar: false,
    hScrollbar: false,
    hScroll: false,
	snap: false
});
$(window).load(function() {
    setTimeout(getEventsList, 100);
});
$(document).ajaxError(function(event, request, settings) {
    $('#busy').hide();
    alert('Error accessing the server');
});
var item;
function getEventsList() {
    $('#busy').show();
    $.getJSON(serviceURL + 'api/rest/events/format/json', function(data) {
        $('#busy').hide();
        $('#eventsList li').remove();
        $.each(data, function(index, item) {
            $('#eventsList').append('<li><a href="eventdetails.html?id=' + item.id + '">' +
                '<h3 class="title">' + item.name + '</p>' +
                '<p><span>Location:</span> ' + item.location + '</p>' +
                '<p><span>Date:</span> ' + moment.unix(item.from).format('Do MMMM YYYY') + '</p>' +
                '<p><span>Time:</span> ' + moment.unix(item.from).format('HH:mm') + ' - ' + moment.unix(item.to).format('HH:mm') + '</p></li>');
        });
        setTimeout(function(){
            scroll.refresh();
        });
    });
}