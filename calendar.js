/*jslint browser: true, devel: true, vars: true, plusplus: true, maxerr: 50 */
/*jshint strict: true*/
"use strict";

// small loosely coupled parts that do one thing very well
// but at the same time coherent, consistent overall design when you put pieces together
// they fit together seamlessly
// complete off the shelf but at the same time flexibel (mustache, handlebars etc.)
// and not because of a switch to turn off or on, but because of small loosely coupled parts

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
        if (startDate > endDate) {
            return [];
        }
        var dateInterval = [];
        // clone start date so we don't modify it via object reference
        var dateIterator = new Date(startDate);

        do {
            dateInterval.push(dateIterator);
            // clone dateIterator so we don't modify the date
            // object of the previous Iteration
            dateIterator = new Date(dateIterator);
            // increment the dateIterator by 1 day
            dateIterator.setDate(dateIterator.getDate() + 1);
        } while (dateIterator <= endDate);
        return dateInterval;
    };

    var startOfWeek = options.startOfWeek || 0;

    // returns the day of the week according to startOfWeek
    var getWeekday = function (date) {
        var dayList = closedInterval(0, 6);
        // reorder dayList according to startOfWeek
        var i = 0;
        while (i < startOfWeek) {
            dayList.unshift(dayList.pop());
            i++;
        }
        return dayList[date.getDay()];
    };

    // turns an array a into a m x n matrix
    var toMatrix = function (a, m, n) {
        var result = [];
        for (var i = 0; i < m; i++) {
            result[i] = a.splice(0, n);
        }
        return result;
    };

    // straight-line code over functions
    var generateContent = function (date, options) {
        // clone date so we don't modify it via object reference
        date = new Date(date);
        // get start of month according to startOfWeek
        date.setDate(1);
        // 0 means start week on sunday, 1 monday ...
        var startOfMonth = getWeekday(date);

        // generate calendar content
        var nrows = options.nrows || 6;
        var startOfContent = -startOfMonth + 1;
        date.setDate(startOfContent);
        var COLS = 7;
        var cellNumber = nrows * COLS;
        var endDate = new Date(date);
        endDate.setDate(endDate.getDate() + cellNumber - 1);
        var dateInterval = closedDateInterval(date, endDate);
        var content = toMatrix(dateInterval, nrows, COLS);
        return content;
    };

    var compareDate = function (date, otherDate) {
        // setHours(1, 3, 3, 7) is neccessary because we don't care for the time portion
        return date.setHours(1, 3, 3, 7) === otherDate.setHours(1, 3, 3, 7) ? true : false;
    };
    var compareMonth = function (date, otherDate) {
        return date.getMonth() === otherDate.getMonth() ? false : true;
    };

    // searches the content for a specific condition and returns an array with indeces or [] if none found
    var searchContent = function (date, content, condition) {
        var result = [];
        var COLS = 7;
        content.forEach(function(row, j) {
            row.forEach(function(cell, i){
                if (condition(date, cell)) {
                    result.push(i + j*COLS);
                }
            });
        });
        return result;
    };

    // this has no use yet add a listener or smth
    this.options = options;

    this.currentDate = new Date();

    var timespan = options.timespan || [this.currentDate.getFullYear(),
                                        this.currentDate.getFullYear() + 5];
    this.years = closedInterval(timespan[0], timespan[1]);

    this.content;

    this.setContent = function () {
        this.content = generateContent(this.currentDate, this.options);
    };

    // initialize content
    this.setContent();

    var today = new Date();

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

        // find a way to avoid this - pun intended
        var calendar = this;

        // callback functions
        var monthSelect = function (e) {
            var $this = $(this);
            var monthName = $this.find('a').html();
            var month = view.months.indexOf(monthName);
            calendar.currentDate.setMonth(month);
            calendar.setContent();
            render();
            styleContent();
        };

        var yearSelect = function (e) {
            var $this = $(this);
            var year = $this.find('a').html();
            calendar.currentDate.setYear(year);
            calendar.setContent();
            render();
            styleContent();
        };

        var daySelect = function (date, $cell) {
            calendar.currentDate.setDate(date.getDate());
            calendar.currentDate.setMonth(date.getMonth());
            calendar.currentDate.setYear(date.getFullYear());
            calendar.setContent();
            render();
            styleContent();
        };


        // generates the view
        var generateView = function () {

            var formatContent = function (content, daySelect) {
                // copy content so we won't modify the calendar object
                var formattedContent = content.map(function (row) {
                    return row.slice(0);
                });

                // format copy of content accordingly
                formattedContent.forEach(function (row) {
                    row.forEach(function (cell, j) {
                        // two digit days
                        row[j] = $('<td>' + ('0' + cell.getDate()).slice(-2) + '</td>');

                        // bind day select callback
                        row[j].on('click', function(){
                            daySelect(cell, row[j]);
                        });
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
                weekdaysLong = moment.weekdays();
                months = moment.months();
            }

            var formatWeekdays = function (weekdaysLong, startOfWeek) {
                // format weekdays according to startOfWeek parameter
                var i = 0;
                while (i < startOfWeek) {
                    weekdaysLong.push(weekdaysLong.shift());
                    i++;
                }

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

            var formatTitle = function (date, weekdays, months) {
                // getWeekday is neccessary to translate the day according to startOfWeek
                var dayName = weekdays[getWeekday(date)];
                var month = months[date.getMonth()];
                var day = date.getDate();
                var year = date.getFullYear();
                var title = dayName + ', ' + month + ', ' + day + ', ' + year;
                return title;
            };

            var years = calendar.years;
            // overwrite months if they are supplied by parameter
            months = options.months || months;
            var weekdays = formatWeekdays(weekdaysLong, calendar.options.startOfWeek);
            var weekdaysLong = weekdays[0];
            var weekdaysShort = weekdays[1];
            var weekdaysMin = weekdays[2];
            var currentDate = calendar.currentDate;
            var currentYear = currentDate.getFullYear();
            var currentMonth = months[currentDate.getMonth()];
            var content = formatContent(calendar.content, daySelect);
            var title = options.title || formatTitle(calendar.currentDate, weekdaysLong, months);

            // return the view
            return {years, months, weekdaysLong: weekdaysLong,
                    weekdaysShort, weekdaysMin, currentDate,
                    currentYear, currentMonth, content, title };
        };

        var $placeholder = $('#calendar-placeholder');
        var $template = $('#calendar-template');
        var view;

        // inserts the view into the html using jquery
        var render = function () {
            view = generateView();
            $placeholder.html($template.html());

            // Cache DOM
            var $years = $placeholder.find('#calendar-years');
            var $months = $placeholder.find('#calendar-months');
            var $weekdays = $placeholder.find('#calendar-weekdays');
            var $currentDate = $placeholder.find('#calendar-currentDate');
            var $currentYear = $placeholder.find('#calendar-currentYear');
            var $currentMonth = $placeholder.find('#calendar-currentMonth');
            var $content = $placeholder.find('#calendar-content');
            var $title = $placeholder.find('#calendar-title');

            view.months.forEach(function(month, idx) {
                $months.append('<li><a>' + month + '</a></li>');
            });

            view.years.forEach(function(year, idx) {
                $years.append('<li><a>' + year + '</a></li>');
            });

            view.weekdaysMin.forEach(function(day, idx) {
                $weekdays.append('<th>' + day + '</th>');
            });

            $currentDate.html(view.currentDate);
            $currentYear.html(view.currentYear);
            $currentMonth.html(view.currentMonth);
            $title.html(view.title);

            view.content.forEach(function(row, i){
                $content.append('<tr></tr>');
                row.forEach(function(cell, j){
                    $content.find('tr:last-child').append(cell);
                });
            });

        };

        var styleContent = function () {

            // search the calendar content for indices
            var todayIdx = searchContent(today, calendar.content, compareDate);
            var selectedDateIdx = searchContent(calendar.currentDate, calendar.content, compareDate);
            var secondaryDaysIdxList = searchContent(calendar.currentDate, calendar.content, compareMonth);

            // flatten view content so we can access its items via indices more easily
            var flatViewContent = Array.prototype.concat.apply([], view.content);
            // get the corresponding jquery objects from the view content
            var $today = flatViewContent[todayIdx];
            var $selectedDate = flatViewContent[selectedDateIdx];
            var $secondaryDays = [];
            secondaryDaysIdxList.forEach(function(idx) {
                $secondaryDays.push(flatViewContent[idx]);
            });

            // style the jquery objects
            $selectedDate.addClass('active');
            if ($today) {
                $today.addClass('primary');
            }
            $secondaryDays.forEach(function(elem, idx) {
                elem.addClass('secondary');
            });
            var $weekdays = $placeholder.find('#calendar-weekdays th');
            var currentWeekday = getWeekday(calendar.currentDate);
            $weekdays.eq(currentWeekday).addClass('primary');
        };

        // initialize
        render();
        styleContent();

        // bind events
        $placeholder.on("click", '.month-dropdown li', monthSelect);
        $placeholder.on("click", '.year-dropdown li', yearSelect);

    };

};
