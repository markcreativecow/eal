var serviceURL = localStorage['serviceURL'];
var scroll = new iScroll('wrapper', {
    vScrollbar: false, 
    hScrollbar:false, 
    hScroll: false
});
var item;
$(window).load(function() {
    setTimeout(getEventsList, 100);
});
$(document).ajaxError(function(event, request, settings) {
    $('#busy').hide();
    alert('Error accessing the server');
});
function generateCalendar(events) {
    var wrapper  = $('#custom-inner'),
        custom   = $('#custom-content-reveal'),
        calendar = $('#calendar'),
        cal      = calendar.calendario({
            onDayClick: function(el, content) {
                if (content.length > 0) {
                    showEvents(content);
                }
            },
            caldata: events,
            displayWeekAbbr: true
        }),
        month    = $('#custom-month').html(cal.getMonthName()),
        year     = $('#custom-year').html(cal.getYear());

    function updateMonthYear() {
        month.html(cal.getMonthName());
        year.html(cal.getYear());
    }
    function hideEvents() {
        $('.custom-content').remove();
    }
    function showEvents(content) {
        hideEvents();
        $('#busy').show();
        setTimeout(function(){
            $('#busy').hide();
            var events = $('<div class="custom-content"></div>');
            events.append(content.html()).insertAfter(wrapper);
            scroll.refresh();
			window.scrollTo(0, 300);
        }, 1000);
    }
    $('#calendar').swipe({
        swipe:function(event, direction, distance, duration, fingerCount) {
            if (direction == 'left') {
				hideEvents();
				cal.gotoNextMonth(updateMonthYear);
				$(this).trigger('click');
            } else if (direction == 'right') {
				hideEvents();
				cal.gotoPreviousMonth(updateMonthYear);
				$(this).trigger('click');
            }
        }
    });
    $('#custom-next').on('touchstart', function() {
		hideEvents();
		cal.gotoNextMonth(updateMonthYear);
	});
	$('#custom-prev').on('touchstart', function() {
		hideEvents();
		cal.gotoPreviousMonth(updateMonthYear);
	});
}
var events = {};
var date = '';
function getEventsList() {
    // Hode the loader icon
    $('#busy').show();
    // Get the list of events in JSON format
    $.getJSON(serviceURL + 'api/rest/events/format/json', function(data) {
        // Hide the loader icon
        $('#busy').hide();
        // Loop through our JSON results
        $.each(data, function(index, item) {
            // Format the date as MM-DD-YYYY for use with Calendario plugin
            date = moment.unix(item.from).format('MM-DD-YYYY');
            // Create the HTML for the event
            var event = '<div class="custom-event"><h4>Event Details:</h4><p class="custom-location"><span>Location:</span> ' + item.name + '</p>' +
                '<p class="custom-date"><span>Date:</span> ' + moment.unix(item.from).format('Do MMMM YYYY') + '</p>' +
                '<p class="custom-time"><span>Time:</span> ' + moment.unix(item.from).format('HH:mm') + ' - ' + moment.unix(item.to).format('HH:mm') + '</p>' +
                '<p class="custom-description"><span>Event Description:</span> ' + item.description + '</p></div>' +
				'<a href="#" onclick="window.open(\'' + item.link + '\',\'_system\',\'location=yes\');" class="btn" id="btn-register">Register</a>' +
                // '<a href="#" onclick="" class="btn" id="btn-remind">Remind Me</a>' +
                '<div class="clearfix"></div>';
            // If there is already an event on this particular day, append it on
            if (events[date]) {
                events[date] = events[date] + event;
            // Other wise, just create it
            } else {
                events[date] = event;
            }
            $('#events-list').append(
                '<li><a href="eventdetails.html?id=' + item.id + '">' +
                '<h2>' + item.name + '</h2>' +
                '<p><span>Location:</span> ' + item.location + '</p>' +
                '<p><span>Date:</span> ' + moment.unix(item.from).format('Do MMMM YYYY') + ' <span>Time:</span> ' + moment.unix(item.from).format('HH:mm') + ' - ' + moment.unix(item.to).format('HH:mm') + '</p>' +
                '</a></li>'
            );
        });
        // Pass the events over to the generate calendar function
        generateCalendar(events);
        setTimeout(function(){
            scroll.refresh();
        });
    });
}