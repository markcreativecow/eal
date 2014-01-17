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
function generateCalendar(events) {
    var wrapper  = $('#custom-inner'),
        custom   = $('#custom-content-reveal'),
        calendar = $('#calendar'),
        cal      = calendar.calendario({
            onDayClick: function(el, content) {
				if (content.length) {
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
            var dates = $('<div class="custom-content">' + content.html() + '</div>').insertAfter(wrapper);
			setTimeout(function(){
				scroll.refresh();
				setTimeout(function(){
					var pos = $('#custom-inner').height();
					scroll.scrollTo(0, -pos);
				}, 10);
			}, 10);
        }, 10);
    }
    $('#calendar').swipe({
        swipe: function(event, direction, distance, duration, fingerCount) {
            if (direction == 'left') {
				cal.gotoNextMonth(updateMonthYear);
				hideEvents();
				setTimeout(function(){
					scroll.refresh();
				}, 10);
            } else if (direction == 'right') {
				cal.gotoPreviousMonth(updateMonthYear);
				hideEvents();
				setTimeout(function(){
					scroll.refresh();
				}, 10);
            }
        },
		threshold: 0
    });
    $('#custom-next').on('touchstart', function() {
		hideEvents();
		cal.gotoNextMonth(updateMonthYear);
		setTimeout(function(){
			scroll.refresh();
        }, 10);
	});
	$('#custom-prev').on('touchstart', function() {
		hideEvents();
		cal.gotoPreviousMonth(updateMonthYear);
		setTimeout(function(){
			scroll.refresh();
        }, 10);
	});
}
var item;
var events = {};
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
            var date = moment.unix(item.from).format('MM-DD-YYYY');
            // Create the HTML for the event
            var event = '<div class="custom-event"><h4>Event Details:</h4><p class="custom-location"><span>Location:</span> ' + item.name + '</p>' +
					'<p class="custom-date"><sp an>Date:</span> ' + moment.unix(item.from).format('Do MMMM YYYY') + '</p>' +
					'<p class="custom-time"><span>Time:</span> ' + moment.unix(item.from).format('HH:mm') + ' - ' + moment.unix(item.to).format('HH:mm') + '</p>' +
					'<p class="custom-description"><span>Event Description:</span> ' + item.description + '</p></div>' +
					'<a href="#" onclick="window.open(\'' + item.link + '\',\'_system\',\'location=yes\');" class="btn" id="btn-register">Register</a>' +
					// '<a href="#" onclick="" class="btn" id="btn-remind">Remind Me</a>' +
					'<div class="clearfix"></div>';
            // If there is already an event on this particular day, append it on
			if (events[date]) {
				events[date] = events[date] + event;
			} else {
				events[date] = event;
			}
        });
        // Pass the events over to the generate calendar function
        generateCalendar(events);
        setTimeout(function(){
            scroll.refresh();
        });
    });
}