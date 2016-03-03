var MaroonCalendar = require('./maroon.js');
var $ = require('jquery');

$(function (){
    // this will be replaced with precompiled templates in the final version
    $.get('templates/popover.handlebars', function (template) {
        template = Handlebars.compile(template);

        // use the wrapper of the popover element as placeholder
        var wrapper = $('.wrapper');

        var calendarOptions = {
            title: 'my Awesome Calendar',
            timespan: [2016, 2020],
            placeholder: wrapper,
            locale: 'de',
            template: template,
            onUpdated: function (view) {
                $('#myInputField').val(view.currentDate);
            }
        };
        // instantiate calendar
        var myCalendar = MaroonCalendar(calendarOptions);

        // bind events
        wrapper.on('click', '.maroonMonths a', myCalendar.monthSelect);
        wrapper.on('click', '.maroonYears a', myCalendar.yearSelect);
        wrapper.on('click', '.maroonContent td', myCalendar.daySelect);

        // STATIC CONTENT - this code is needed to initialize the popover with static content
        // bootstrap popover options see
        // http://getbootstrap.com/javascript/#popovers for more information
        var popoverOptions = {
            animation: false,
            html: true,
            placement: 'auto right',
            // render the view into the content of the popover
            content: template(myCalendar.view),
            title: myCalendar.view.title
        };
        // instantiate the bootstrap popover
        var myPopover = $('#myPopover').popover(popoverOptions);

        // DYNAMIC CONTENT - this extra code is needed to make the popover dynamic
        // bootstrap generates a new div for the popover inside the wrapper once the
        // popover is shown and deletes it if its closed
        // so we have to change our placeholder to that generated div
        myPopover.on('shown.bs.popover', function () {
            var container = wrapper.find('.popover-content');

            myCalendar.placeholder = container;
        });

    });
}());
