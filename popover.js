// THIS MODULE WILL REPLACE THE INLINE SCRIPT TAG IN POPOVER.HTML

var MaroonCalendar = require('./maroon.js');
var $ = require('jquery');

$(function (){
    // this will be replaced with precompiled templates in the final version
    $.get('templates/popover.handlebars', function (template) {
        template = Handlebars.compile(template);

        // instantiate calendar
        var myCalendar = MaroonCalendar({
            title: 'Bootstrap Popover Calendar',
            timespan: [2016, 2020],
            locale: 'de'
        });

        // get the popoverWrapper
        var popoverWrapper = $('.popoverWrapper');

        // bind events
        popoverWrapper.on('click', '.maroonMonths a', myCalendar.monthSelect);
        popoverWrapper.on('click', '.maroonYears a', myCalendar.yearSelect);
        popoverWrapper.on('click', '.maroonContent td', myCalendar.daySelect);

        // instantiate the bootstrap popover
        // for bootstrap popover options refer to
        // http://getbootstrap.com/javascript/#popovers
        var myPopover = $('#myPopover').popover({
            animation: false,
            html: true,
            placement: 'auto right',
            // render the view into the content of the popover
            // this will be static popover content
            content: template(myCalendar.view),
            title: myCalendar.view.title
        });

        // CODE FOR DYNAMIC POPOVER CONTENT
        // bootstrap generates a new div for the popover inside the popoverWrapper once the
        // popover is shown and deletes it if its closed so we have to listen for the 'shown'
        // event, find the generated div and render our template into that generated div
        // every time the maroon calendar is updated
        myPopover.on('shown.bs.popover', function () {
            var bspopover = popoverWrapper.find('.popover-content');
            myCalendar.on('updated', function (view) {
                // render the template into the generated bootstrap popover
                bspopover.html(template(view));
                $('#myInputField').val(view.currentDate);
            });
        });

    });
}());
