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
        if (start > end) {
            return [];
        }
        var interval = [];
        var i = start;
        do {
            interval[i - start] = i;
            i++;
        } while (i <= end);
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
    // 0 means sundays, 1 monday ...
    var startOfWeek = options.startOfWeek || 0;

    // repeats a method call of an object n times with parameter of type function
    // returns the return value of the methods n-th call
    var repMethod = function (obj, method, param, n) {
        var state;
        for (var i = 0; i < n; i++) {
            state = method.call(obj, param());
        }
        return state;
    };

    // rearrange dayList according to startOfWeek
    var param = function () {
        return repMethod(dayList, Array.prototype.pop, function() {}, 1);
    };
    repMethod(dayList, Array.prototype.unshift, param, startOfWeek);

    // straight-line code over functions
    var generateContent = function (date, options) {
        // clone date so we don't modify it via object reference
        date = new Date(date);
        // get start of month according to startOfWeek
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
    var timespan = options.timespan || [this.currentDate.getFullYear(),
                                        this.currentDate.getFullYear() + 5];
    this.yearList = closedInterval(timespan[0], timespan[1]);
    this.setContent = function () {
        this.content = generateContent(this.currentDate, this.options);
    };
    this.setContent();

    /*
    this.setDateInterval = function () {
        this.dateInterval = closedDateInterval(this.startDateInterval, this.endDateInterval);
    };
    this.startDateInterval = new Date();
    this.endDateInterval = new Date();
    */


    /* !--- START OF PRESENTATION LOGIC ---! */
    /*jslint browser: true, devel: true, vars: true, plusplus: true, maxerr: 50 */
    /*jshint strict: true*/

    "use strict";
    // you can write your own presentation on top of the logic
    // a change here should never lead to a change in the logic
    // part of this can be considered as presentation logic (f.e. monthSelect) and is not specific
    // to a datepicker maybe work with inheritance?
    this.launch = function (options) {

        var calendar = this;
        var $calendar = options.$calendar;
        var $template = options.$template;

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

            var weekdaysLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                                'Thursday', 'Friday', 'Saturday'];
            var months = ['January', 'February', 'March', 'April',
                            'May', 'June', 'July', 'August',
                            'September', 'October', 'November', 'December'];

            // moment module
            // overwrite weekdaysLong and months if moment is available
            if (typeof moment !== 'undefined') {
                var locale = options.locale || 'en';
                moment.locale(locale);
                months = moment.months();
                weekdaysLong = moment.weekdays();
            }

            var formatWeekdays = function (weekdaysLong, startOfWeek) {
                // format weekdays according to startOfWeek parameter
                var param = function () {
                    return repMethod(weekdaysLong, Array.prototype.shift, function() {}, 1);
                };
                repMethod(weekdaysLong, Array.prototype.push, param, startOfWeek);

                // overwrite weekdays if they are supplied by parameters
                // this is assuming that the parameter 'weekdays' is already formatted according to startOfWeek
                weekdaysLong = options.weekdays || weekdaysLong;

                var weekdaysShort = [];
                var weekdaysMin = [];
                weekdaysLong.forEach(function (day, i) {
                    weekdaysShort[i] = day.substring(0, 3)
                    weekdaysMin[i] = day.substring(0, 2)
                });
                var weekdays = [weekdaysLong, weekdaysShort, weekdaysMin];
                return weekdays;
            };

            var formatDefaultTitle = function  (date, weekdays, months) {
                // dayList is neccessary to translate the day according to startOfWeek
                var dayName = weekdays[dayList[date.getDay()]];
                var month = months[date.getMonth()];
                var day = date.getDate();
                var year = date.getFullYear();
                var title = dayName + ', ' + month + ', ' + day + ', ' + year;
                return title;
            };

            var yearList = calendar.yearList;
            // overwrite months if they are supplid by parameter
            months = options.months || months;
            var weekdays = formatWeekdays(weekdaysLong, calendar.options.startOfWeek);
            var weekdaysLong = weekdays[0];
            var weekdaysShort = weekdays[1];
            var weekdaysMin = weekdays[2];
            var currentDate = calendar.currentDate;
            var currentYear = currentDate.getFullYear();
            var currentMonth = months[currentDate.getMonth()];
            var content = formatContent(calendar.content);
            var title = options.title || formatDefaultTitle(calendar.currentDate, weekdaysLong, months);

            // return the view
            return {yearList: yearList,
                    months: months,
                    weekdays: weekdaysMin,
                    currentDate: currentDate,
                    currentYear: currentYear,
                    currentMonth: currentMonth,
                    content: content,
                    title: title
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

        var render = function () {

        }

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
            // does not tell if day belongs to current month or before
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
