function MaroonCalendar (options) {

    // Callbacks
    var updatedCallback = function (view) {};
    var daySelectCallback = function (date) {};
    var monthSelectCallback = function (month) {};
    var yearSelectCallback = function (year) {};

    // MODEL ---------------------------------------------------------------------------------------
    var title = options.title;
    var timespan = options.timespan || [new moment().year(), new moment().add(5, 'year').year()];
    var locale = options.locale || 'en';
    moment.locale(locale);
    var ROWS = 6;
    var COLS = 7;
    var months = moment.months();
    var weekdays = moment.weekdays();
    var weekdaysMin = moment.weekdaysMin();
    var currentDate = new moment();
    var today = new moment();
    var years = closedInterval(timespan[0], timespan[1]);
    var content = generateContent();
    var happenings = [];
    if (options.happenings) {
        registerHappening(options.happenings);
    }
    var view = generateView();

    // generates a 6*7 array with date objects as elements
    function generateContent () {
        var startDate = currentDate.clone();
        startDate.startOf('month');
        startDate.subtract(startDate.day(), 'days');
        var endDate = startDate.clone();
        var cellNumber = ROWS * COLS;
        endDate.add(cellNumber - 1, 'days');
        var content = closedDateInterval(startDate, endDate);
        return content;
    }

    // VIEWMODEL ---------------------------------------------------------------------------------------
    // translates the model into an abstraction of the view
    function generateView () {
        var currentYear = currentDate.year();
        var viewYears = generateViewYears();
        var currentMonth = months[currentDate.month()];
        var viewMonths = generateViewMonths();
        var viewContent = generateViewContent();
        var viewCurrentDate = currentDate.format('DD.MM.YYYY');
        var viewWeekdays = generateViewWeekdays();

        function generateViewWeekdays () {
            var currentDay = weekdays[currentDate.day()];
            var todaysDay = weekdays[today.day()];

            var viewWeekdays = weekdays.reduce(function (result, weekday, idx) {
                var cssClass = '';
                var weekdayMin = weekdaysMin[idx];
                if (weekday === todaysDay) {
                   cssClass += 'primary ';
                }
                if (weekday === currentDay) {
                   cssClass += 'current ';
                }
                result[idx] = { weekday: weekday,
                                weekdayMin: weekdayMin,
                                cssClass: cssClass };
                return result;
            }, []);
            return viewWeekdays;
        }

        function generateViewYears () {
            var todaysYear = today.year();
            var viewYears = years.reduce(function (result, year, idx) {
                var cssClass = '';
                if (year == todaysYear) {
                   cssClass += 'primary ';
                }
                if (year == currentYear) {
                   cssClass += 'current ';
                }
                result[idx] = { year: year,
                                cssClass: cssClass };
                return result;
            }, []);
            return viewYears;
        }

        function generateViewMonths () {
            var todaysMonth = months[today.month()];
            var viewMonths = months.reduce(function (result, month, idx) {
                var cssClass = '';
                if (month === todaysMonth) {
                   cssClass += 'primary ';
                }
                if (month === currentMonth) {
                   cssClass += 'current ';
                }
                result[idx] = { month: month,
                                isoMonth: currentYear + '-' + ("0" + (idx + 1)).slice(-2),
                                cssClass: cssClass };
                return result;
            }, []);
            return viewMonths;
        }

        function generateViewContent () {

            var viewContent = content.reduce(function (result, date, idx) {

                var cssClass = '';
                if (date.isSame(today, 'day')) {
                   cssClass += 'primary ';
                }
                if (!date.isSame(currentDate, 'month')) {
                   cssClass += 'secondary ';
                }
                if (date.isSame(currentDate, 'day')) {
                   cssClass += 'current ';
                }
                result[idx] = { date: date.format('DD'),
                                isoDate: date.format('YYYY-MM-DD'),
                                happening: {},
                                cssClass: cssClass };
                return result;
            }, []);

            happenings.forEach(function (happening) {
                var idx = searchDate(happening.date, content);
                // if happening was found in current content
                if (idx != -1) {
                    // add the happening to the view content
                    viewContent[idx].happening = happening;
                }
            });

            viewContent = toMatrix(viewContent, ROWS, COLS);
            return viewContent;
        }

        return { years: viewYears, months: viewMonths, content: viewContent, weekdays: viewWeekdays,
            currentDate: viewCurrentDate, currentYear: currentYear, currentMonth: currentMonth, title: title };
    }


    // CONTROLLER ----------------------------------------------------------------------------------
    function updateCalendar () {
        content = generateContent();
        view = generateView();
        updatedCallback(view);
    }

    function on (eventName, callback) {
        if (eventName === 'updated') {
            updatedCallback = callback;
        } else if (eventName === 'daySelect') {
            daySelectCallback = callback;
        } else if (eventName === 'monthSelect') {
            monthSelectCallback = callback;
        } else if (eventName === 'yearSelect') {
            yearSelectCallback = callback;
        } else {
            console.error('unknown event name! Valid event names are: \n' +
                        'updatedView\n' +
                        'daySelect\n' +
                        'monthSelect\n' +
                        'yearSelect\n');
        }
    }

    // VIEW ----------------------------------------------------------------------------------------

    // events
    function monthSelect (e) {
        var month = $(this).text();
        currentDate.month(month);
        updateCalendar();
        monthSelectCallback(month);
    }

    function yearSelect (e) {
        var year = $(this).text();
        currentDate.year(year);
        updateCalendar();
        yearSelectCallback(year);
    }

    function daySelect (e) {
        var value = $(this).find('time').attr('datetime');
        var date = moment(value);
        currentDate = date;
        updateCalendar();
        daySelectCallback(date);
    }

    function registerHappening (a) {

        // if a is a single happening transform it into an
        // array of length 1
        if (!(a instanceof Array)) {
            a = [a];
        }

        a.forEach(function (happening) {
            var happeningDate = happening.date;

            // if the happening spans over a timespan
            // transform it into multiple single happenings
            if (happeningDate instanceof Array) {
                var dateInterval = closedDateInterval(happeningDate[0], happeningDate[1]);
                dateInterval.forEach(function (date) {
                    var clone = JSON.parse(JSON.stringify(happening));
                    clone.date = date;
                    happenings.push(clone);
                });
            } else {
                happenings.push(happening);
            }
        });

        updateCalendar();
    }

    // HELPERS -------------------------------------------------------------------------------------

    // returns a closed interval from start to end
    function closedInterval (start, end) {
        if (start > end) {
            return [];
        } else {
            var interval = [];
            var i = start;
            do {
                interval[i - start] = i;
                i++;
            } while (i <= end);
            return interval;
        }
    }

    // returns a closed date interval from startDate to endDate
    function closedDateInterval (startDate, endDate) {
        if (startDate > endDate) {
            return [];
        }
        var dateInterval = [];
        var date = startDate.clone();

        while (date <= endDate) {
            dateInterval.push(date);
            date = date.clone();
            date.add(1, 'day');
        }
        return dateInterval;
    }

    // turns an array a into a m x n matrix
    function toMatrix (a, m, n) {
        var result = [];
        for (var i = 0; i < m; i++) {
            result[i] = a.splice(0, n);
        }
        return result;
    }

    // returns the index a date in an array of date objects
    function searchDate (date, a) {
        return a.map(function (arrayDate) {
            return arrayDate.format('YYYY-MM-DD');
        }).indexOf(date.format('YYYY-MM-DD'));
    }

    return {
        view: view,
        actions: {
            yearSelect: yearSelect,
            monthSelect: monthSelect,
            daySelect: daySelect,
            updateCalendar: updateCalendar,
            on: on,
            registerHappening: registerHappening
        }
    };
}
