/*jslint browser: true, devel: true, vars: true, plusplus: true, maxerr: 50 */
/*jshint strict: true*/
"use strict";

// small loosely coupled parts that do one thing very well
// but at the same time coherent, consistent overall design when you put pieces together
// they fit together seamlessly no impedance missmatch
// complete off the shelf but at the same time flexibel (mustache, handlebars etc.)
// and not because of a switch to turn off or on, but because of small loosely coupled parts
// calendar module logic no html, css or jquery allowed!!
var Calendar = function (options) {

    // returns a closed interval from start to end
    var closedInterval = function (start, end) {
        if (start > end) { return []; }
        end++;
        var interval = [];
        var i = start;
        do {
            interval[i - start] = i;
            i++;
        } while (i < end);
        return interval;
    };

    // returns a closed date interval from startDate to endDate
    var closedDateInterval = function (startDate, endDate) {

        if (startDate > endDate) { return []; }
        var dateInterval = [];
        startDate = new Date(startDate);
        do {
            dateInterval.push(startDate);
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate() + 1);
        } while (startDate <= endDate);
        return dateInterval;
    };

    var dayList = closedInterval(0, 6);
    var startOfWeek = options.startOfWeek || 0;

    // rearrange dayList so startOfWeek equals dayList[0]
    var k = 0;
    while (k < startOfWeek) {
        dayList.unshift(dayList.pop());
        k++;
    }

    // straight-line code over functions
    var generateContent = function (date, options) {
        // clone date so we don't modify it via object reference
        date = new Date(date);
        // get start of month according to start of
        date.setDate(1);
        var startOfMonth = dayList[date.getDay()];

        // generate calendar content
        var nrows = options.nrows || 6;
        var startOfContent = -startOfMonth + 1;
        date.setDate(startOfContent);
        var COLS = 7;
        var cellNumber = nrows * COLS;
        var endDate = new Date(date);
        endDate.setDate(endDate.getDate() + cellNumber - 1);
        var dateInterval = closedDateInterval(date, endDate);
        var content = [];
        for (var i = 0; i < nrows; i++) {
            content[i] = dateInterval.splice(0, COLS);
        }
        return content;
    };

    // this has no use yet add a listener or smth
    this.options = options;
    this.currentDate = new Date();
    var timespan = options.timespan || [this.currentDate.getFullYear(), this.currentDate.getFullYear() + 5];
    this.yearList = closedInterval(timespan[0], timespan[1]);
    this.setContent = function () {
        this.content = generateContent(this.currentDate, this.options);
    };
    this.setContent();
    this.setDateInterval = function () {
        this.dateInterval = closedDateInterval(this.startDateInterval, this.endDateInterval);
    };
    this.startDateInterval = new Date();
    this.endDateInterval = new Date();


    /* !--- START OF PRESENTATION LOGIC ---! */
    /*jslint browser: true, devel: true, vars: true, plusplus: true, maxerr: 50 */
    /*jshint strict: true*/

    "use strict";
    // you can write your own presentation on top of the logic
    // a change here should never lead to a change in the logic
    // part of this can be considered logic and is not specific to a datepicker
    // maybe work with inheritance?
    this.datepicker = function (options) {

        var calendar = this;
        var $calendar = options.$calendar;
        var $template = options.$template;

        // fallback for months and weekdays
        var months = ['January', 'February', 'March', 'April',
                        'May', 'June', 'July', 'August',
                        'September', 'October', 'November', 'December'];
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var weekdaysMin = [];
        var weekdaysShort = [];
        weekdays.forEach(function (day, i) {
            weekdaysShort[i] = day.substring(0, 3)
            weekdaysMin[i] = day.substring(0, 2)
        });

        // if moment is loaded overwrite the fallback
        if (typeof moment !== 'undefined') {
            var locale = options.locale || 'en';
            moment.locale(locale);
            months = moment.months();
			weekdays = moment.weekdays();
            weekdaysShort = moment.weekdaysShort();
            weekdaysMin = moment.weekdaysMin();
        }

        // if months is supplied as parameter overwrite montList
        if (options.months) {
            months = options.months;
        }

        // if weekdays is supplied as parameter overwrite all weekdays variables
        if (options.weekdays) {
            weekdays = weekdaysMin = weekdaysShort = options.weekdays;
        } else {
            // push and shift an array n times
            var pushShiftArray = function (array, n) {
                var k = 0;
                while (k < n) {
                    array.push(array.shift());
                    k++;
                }
                return array;
            };

            // rearrange weekday arrays according to start of week
            var n = calendar.options.startOfWeek;
            pushShiftArray(weekdays, n);
            pushShiftArray(weekdaysMin, n);
            pushShiftArray(weekdaysShort, n);
        }

        // generates the view
        var generateView = function () {
            var formatContent = function (content) {
                // copy content so we won't modify the calendar object
                var formattedContent = content.map(function (row) {
                    return row.slice(0);
                });

                // format copy of content accordingly
                formattedContent.forEach(function (row) {
                    row.forEach(function (col, j) {
                        // two digit days
                        row[j] = ('0' + col.getDate()).slice(-2);
                    });
                });
                return formattedContent;
            };

            var formatDefaultTitle = function  () {
                var currentDate = calendar.currentDate;
                var dayName = weekdays[dayList[currentDate.getDay()]];
                var month = months[currentDate.getMonth()];
                var day = currentDate.getDate();
                var year = currentDate.getFullYear();
                var title = dayName + ', ' + month + ', ' + day + ', ' + year;
                return title;
            };

            var title = options.title || formatDefaultTitle();
            var content = formatContent(calendar.content);
            var currentDate = calendar.currentDate;
            var currentYear = currentDate.getFullYear();
            var currentMonth = months[currentDate.getMonth()];
            var yearList = calendar.yearList;

            return {title: title,
                    yearList: yearList,
                    months: months,
                    weekdays: weekdaysMin,
                    currentYear: currentYear,
                    currentMonth: currentMonth,
                    content: content
                };
        };

        var view;

        var render = function () {
            view = generateView(this);
            var html = Mustache.render($template.html(), view);
            Mustache.parse(html);
            $calendar.html(html);
        };

        // initialize
        render();

        var monthSelect = function (e) {
            var $this = $(this);
            var monthName = $this.find('a').html();
            var month = view.months.indexOf(monthName);
            calendar.currentDate.setMonth(month);
            calendar.setContent();
            render();
        };

        var yearSelect = function (e) {
            var $this = $(this);
            var year = $this.find('a').html();
            calendar.currentDate.setYear(year);
            calendar.setContent();
            render();
        };

        var daySelect = function (e) {
            var $this = $(this);
            var day = $this.html();
            console.log(day);
            // how do I know if day belongs to current month or before?
            // mapping function needed pseudocode: content[indexOf('<li>')]
            // alternative: bind content[i] to li[i] when rendering the html
            render();
        };

        // bind events
        $calendar.on("click", '.month-dropdown li', monthSelect);
        $calendar.on("click", '.year-dropdown li', yearSelect);
        $calendar.on("click", '.calendar-table tbody td', daySelect);

    };

};
