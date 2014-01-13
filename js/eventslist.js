var serviceURL = localStorage['serviceURL'];
var scroll = new iScroll('wrapper', {
    vScrollbar: true, 
    hScrollbar:false, 
    hScroll: false,
	snap: true
});
var item;
$(window).load(function() {
    setTimeout(getEventsList, 100);
});
$(document).ajaxError(function(event, request, settings) {
    $('#busy').hide();
    alert('Error accessing the server');
});
function getEventsList() {
    $('#busy').show();
    $.getJSON(serviceURL + 'api/rest/events/format/json', function(data) {
        $('#busy').hide();
        $('#eventsList li').remove();
        $.each(data, function(index, item) {
            $('#eventsList').append('<li><a href="eventdetails.html?id=' + item.id + '">' +
                '<h3 class="title">' + item.name + '</p>' +
                '<p><span>Location:</span> ' + item.location + '</p>' +
                '<p><span>Date:</span> ' + moment.unix(item.from).format('dddd do MMMM YYYY') + '</p>' +
                '<p><span>Time:</span> ' + moment.unix(item.from).format('HH:mm') + ' - ' + moment.unix(item.to).format('HH:mm') + '</p></li>');
        });
        setTimeout(function(){
            scroll.refresh();
        });
    });
}