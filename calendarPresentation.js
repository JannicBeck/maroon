/*jslint browser: true, devel: true, vars: true, plusplus: true, maxerr: 50 */
"use strict";
// you can write your own presentation on top of the logic
// a change here should never lead to a change in the logic
// integrate this module into the calendar object? f.e. myCalendar.launch(options)
var launchCalendar = function (options) {

    var calendar = options.calendar;
    var $calendar = options.$calendar;
    var $template = options.$template;
    var view = generateView;

    (function init() {
        render();
        bindEvents();
    }());

    function render() {
        view = generateView();
        var html = Mustache.render($template.html(), view);
        Mustache.parse(html);
        $calendar.html(html);
    }

    function bindEvents() {
        $calendar.on("click", '.month-dropdown li', monthSelect);
        $calendar.on("click", '.year-dropdown li', yearSelect);
        $calendar.on("click", '.calendar-table tbody tr', daySelect);
    }

    function monthSelect(e) {
        var $this = $(this);
        var monthName = $this.find('a').html();
        var month = view.monthList.indexOf(monthName);
        calendar.currentDate.setMonth(month);
        calendar.setContent();
        render();
    }

    function yearSelect(e) {
        var $this = $(this);
        var year = $this.find('a').html();
        calendar.currentDate.setYear(year);
        calendar.setContent();
        render();
    }

    function daySelect(e) {
        var $this = $(this);
        var day = $this.html();
        console.log(day);
        calendar.setStartDateInterval(calendar.currentDate);
    }

    // I don't like this, title, month/dayList, years do not have to be updated
    // I like the revealing pattern though
    function generateView() {

        var generateDefaultDayList = function (startOfWeek) {
            var dayList = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
            var k = 0;
            while (k < startOfWeek) {
                dayList.push(dayList.shift());
                k++;
            }
            return dayList;
        };

        var formatContent = function (content) {
            // copy content so we won't modify the calendar object
            var formattedContent = content.map(function (row) {
                return row.slice(0);
            });

            formattedContent.forEach(function (row) {
                row.forEach(function (col, j) {
                    // ugly two digit hack use moment instead
                    row[j] = ('0' + col.getDate()).slice(-2);
                });
            });
            return formattedContent;
        };

        var calendarTitle = options.calendarTitle || 'Calendar';
        var yearList = calendar.yearList;
        var monthList = options.monthList || ['January', 'February', 'March', 'April',
                                                'May', 'June', 'July', 'August',
                                                'September', 'October', 'November', 'December'];
        var dayList = options.dayList || generateDefaultDayList(calendar.options.startOfWeek);

        // wow such ugly very unconventional
        var currentDate = calendar.currentDate;
        var currentYear = currentDate.getFullYear();
        var currentMonth = monthList[currentDate.getMonth()];
        var startDate = calendar.startDate;
        var endDate = calendar.endDate;
        var currentContent = formatContent(calendar.currentContent);
        var startDateInterval = calendar.startDateInterval;
        var endDateInterval = calendar.endDateInterval;

        return {calendarTitle: calendarTitle,
                yearList: yearList,
                monthList: monthList,
                dayList: dayList,
                currentYear: currentYear,
                currentMonth: currentMonth,
                currentContent: currentContent,
                startDateInterval: startDateInterval,
                endDateInterval: endDateInterval
            };
    }
};
