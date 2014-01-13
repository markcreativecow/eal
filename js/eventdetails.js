var serviceURL = localStorage['serviceURL'];
var scroll = new iScroll('wrapper', {
    vScrollbar: false, 
    hScrollbar:false, 
    hScroll: false
});
var item;
var id = getUrlVars()["id"];
$(window).load(function() {
    setTimeout(getEvent, 100);
});
$(document).ajaxError(function(event, request, settings) {
    $('#busy').hide();
    alert("Error accessing the server");
});
function getEvent() {
    $('#busy').show();
    $.getJSON(serviceURL + 'api/rest/event/id/' + id + '/format/json', function(data) {
        $('#busy').hide();
        $.each(data, function(index, item) {
            $('#eventDetails').append('<div class="event"><h3 class="title">Event Details:</h3>' +
                '<p><span>Location:</span> ' + item.name + '</p>' +
                '<p><span>Date:</span> ' + moment.unix(item.from).format('Do MMMM YYYY') + '</p>' +
                '<p><span>Time:</span> ' + moment.unix(item.from).format('HH:mm') + ' - ' + moment.unix(item.to).format('HH:mm') + '</p>' +
                '<p><span>Event Description:</span> ' + item.description + '</p></div>' +
				'<a href="#" onclick="window.open(\'' + item.link + '\',\'_system\',\'location=yes\');" class="btn" id="btn-register">Register</a>' +
                '<div class="clearfix"></div>');
        });
        setTimeout(function(){
            scroll.refresh();
        });
    });
}
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
