/*jslint browser: true, devel: true, vars: true, plusplus: true, maxerr: 50 */
"use strict";
// you can write your own presentation on top of the logic
// a change here should never lead to a change in the logic
// integrate this module into the calendar object? f.e. myCalendar.launchCalendar(options)
var launchCalendar = function (options) {

    // functionality to exclude days?
    var calendar = options.calendar;
    var calendarTitle = options.calendarTitle || 'Calendar';
    var dayList = options.dayList || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var monthList = options.monthList || ['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'];
    // is it really a good idea to seperate dayList and startOfWeek?
    // maybe implement locale and moment, but also allow for dayList option

    var $calendar = options.$calendar;
    var $template = options.$template;

    (function init() {
        render();
        bindEvents();
    }());

    function render() {
        var view = generateView();
        var html = Mustache.render($template.html(), view);
        Mustache.parse(html);
        $calendar.html(html);
    }


    // I don't like to rebind events everytime we render maybe use partials or smth?
    function bindEvents() {
        var $monthList = $calendar.find('.month-dropdown li');
        $monthList.on('click', monthSelect);

        var $yearList = $calendar.find('.year-dropdown li');
        $yearList.on('click', yearSelect);

        var $days = $calendar.find('.calendar-table tbody tr');
        $days.on('click', 'td', daySelect);
    }

    function monthSelect(e) {
        console.log('monthSelect fired');
        var $this = $(this);
        var monthName = $this.find('a').html();
        var month = monthList.indexOf(monthName);
        calendar.currentDate.setMonth(month);
        calendar.setContent();
        render();
    }

    function yearSelect(e) {
        console.log('yearSelect fired');
        var $this = $(this);
        var year = $this.find('a').html();
        calendar.currentDate.setYear(year);
        calendar.setContent();
        render();
    }

    function daySelect(e) {
        console.log('daySelect fired');
        var $this = $(this);
        var day = $this.html();
        console.log(day);
        calendar.setStartDateInterval(calendar.currentDate);
    }

    // I don't like this, title, month/dayList, years do not have to be updated
    // on month/year/day select, basically only content
    // I like the revealing pattern though
    function generateView() {

        // wow such ugly very unconventional
        var currentDate = calendar.currentDate;
        var currentYear = currentDate.getFullYear();
        var currentDay = currentDate.getDate();
        var yearList = calendar.yearList;
        var startDate = calendar.startDate;
        var endDate = calendar.endDate;
        var currentMonth = monthList[currentDate.getMonth()];
        var currentContent = formatContent(calendar.currentContent);
        var startDateInterval = calendar.startDateInterval;
        var endDateInterval = calendar.endDateInterval;
        var dateInterval = calendar.dateInterval;
        var setDateInterval = calendar.setDateInterval;

        function formatContent(content) {
            // copy content so we won't modify the calendar object
            var formattedContent = content.map(function (row) {
                return row.slice(0);
            });

            formattedContent.forEach(function (row) {
                row.forEach(function (col, j) {
                    row[j] = ('0' + col.getDate()).slice(-2);
                });
            });
            return formattedContent;
        }

        return {currentDay: currentDay,
                monthList: monthList,
                currentMonth: currentMonth,
                currentYear: currentYear,
                yearList: yearList,
                dayList: dayList,
                currentContent: currentContent,
                calendarTitle: calendarTitle,
                currentDate: currentDate,
                startDateInterval: startDateInterval,
                endDateInterval: endDateInterval
            };
    }
};