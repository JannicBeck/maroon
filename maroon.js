function maroonCalendar(options) {

    var ROWS = 6;
    var COLS = 7;
    var intervalMode = options.intervalMode || false;

    var locale = options.locale || 'en';
    var startOfWeek = options.startOfWeek || 0;

    moment.locale(locale);
    var months = moment.months();

    var weekdays = moment.weekdays();
    var weekdaysShort = moment.weekdaysShort();
    var weekdaysMin = moment.weekdaysMin();
    formatWeekdays();

    // format weekdays according to startOfWeek parameter
    function formatWeekdays() {
        var i = 0;
        while (i < startOfWeek) {
            weekdays.push(weekdays.shift());
            weekdaysShort.push(weekdaysShort.shift());
            weekdaysMin.push(weekdaysMin.shift());
            i++;
        }
    }

    var currentDate = new moment();
    var today = new moment();
    var timespan = options.timespan || [currentDate.year(), currentDate.clone().add(5, 'year')];
    var placeholder = options.placeholder;
    var template = options.template;
    var years = closedInterval(timespan[0], timespan[1]);
    var content = generateContent();
    var startDate;
    var interval;
    var endDate;
    var view;

    function updateContent() {
        content = generateContent();
    }

    // returns a closed interval from start to end
    function closedInterval(start, end) {
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
    }

    // returns a closed date interval from startDate to endDate
    function closedDateInterval(startDate, endDate) {
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

    // returns the day of the week according to startOfWeek
    function getWeekday(date) {
        var dayList = closedInterval(0, 6);
        // reorder dayList according to startOfWeek
        var i = 0;
        while (i < startOfWeek) {
            dayList.unshift(dayList.pop());
            i++;
        }
        return dayList[date.day()];
    }

    function compareDates(date, otherDate) {
        if( date.isSame(otherDate, 'day') &&
            date.isSame(otherDate, 'month') &&
            date.isSame(otherDate, 'year')) {

            return true;
        } else {
            return false;
        }
    }

    // straight-line code over functions
    function generateContent() {
        var date = currentDate.clone();
        // get start of month according to startOfWeek
        date.date(1);
        // 0 means start week on sunday, 1 monday ...
        var startOfMonth = getWeekday(date);
        var startOfContent = -startOfMonth + 1;
        date.date(startOfContent);
        var cellNumber = ROWS * COLS;
        var endDate = date.clone();
        endDate.add(cellNumber - 1, 'day');
        var content = closedDateInterval(date, endDate);
        return content;
    }

    function generateView() {
        var title = options.title || currentDate.format('dddd Do MMMM YYYY');

        var year = currentDate.year();
        var month = months[currentDate.month()];

        var viewWeekdaysMin = weekdaysMin.reduce(function(result, weekday, idx) {
            result[idx] = { weekday: weekday,
                            cssClass: 'maroonWeekday '}
            return result;
        }, []);
        viewWeekdaysMin[getWeekday(currentDate)].cssClass += 'primary ';

        var viewMonths = months.reduce(function(result, month, idx) {
            result[idx] = { month: month,
                            cssClass: 'maroonMonth '};
            return result;
        }, []);
        viewMonths[currentDate.month()].cssClass += 'primary ';

        var viewYears = years.reduce(function(result, year, idx) {
            result[idx] = { year: year,
                            cssClass: 'maroonYear '};
            return result;
        }, []);

        try {
            viewYears[years.indexOf(currentDate.year())].cssClass += 'primary ';
        } catch (error) {
            console.error("current year could'nt be highlighted because " +
                          "it is not present in the specified timespan", error);
        }

        var viewContent = content.reduce(function(result, date, idx) {
            var cssClass = 'maroonDate ';
            if (compareDates(date, today)) {
                cssClass += 'primary ';
            }
            if (!date.isSame(currentDate, 'month')) {
                cssClass += 'secondary ';
            }
            if (compareDates(date, currentDate)) {
                cssClass += 'current ';
            }
            if (intervalMode) {
                if (startDate) {
                    if (compareDates(date, startDate)) {
                        cssClass += 'start ';
                    }
                }
                if (endDate) {
                    if (compareDates(date, endDate)) {
                        cssClass += 'end ';
                    }
                }
                if (interval) {
                    interval.forEach(function(intervalDate) {
                        if (compareDates(date, intervalDate)) {
                            cssClass += 'interval ';
                        }
                    });
                }
            }
            result[idx] = { day: date.format('DD'),
                             date: date.format('YYYY-MM-DD'),
                             cssClass: cssClass };
            return result;
        }, []);

        viewContent = toMatrix(viewContent, ROWS, COLS);

        // turns an array a into a m x n matrix
        function toMatrix(a, m, n) {
            var result = [];
            for (var i = 0; i < m; i++) {
                result[i] = a.splice(0, n);
            }
            return result;
        }

        function formatDate(date) {
            if (date) {
                return date.format('DD.MM.YYYY');
            }
        }

        return { years: viewYears, months: viewMonths, weekdays, weekdaysShort,
                weekdaysMin: viewWeekdaysMin, currentDate, year, month,
                content: viewContent, title, startDate: formatDate(startDate),
                endDate: formatDate(endDate) };
    }

    // bind events
    placeholder.on('click', '.maroonMonth', monthSelect);
    placeholder.on('click', '.maroonYear', yearSelect);
    placeholder.on('click', '.maroonDate', daySelect);

    // inserts the view into the html using handlebars templating engine
    function render() {
        updateContent();
        view = generateView();
        placeholder.html(template(view));
    }

    // initialize
    render();

    function monthSelect(e) {
        var month = $(this).text();
        currentDate.month(month);
        render();
    }

    function yearSelect(e) {
        var year = $(this).text();
        currentDate.year(year);
        render();
    }

    function daySelect(e) {
        var value = $(this).find('time').attr('datetime');
        var date = moment(value).locale(locale);
        currentDate = date;
        if (intervalMode) {
            activateIntervalMode();
        }
        render();
    }

    function activateIntervalMode() {
        if (!startDate && !endDate) {
            startDate = moment(currentDate);
        } else if (startDate && !endDate) {
            if (currentDate < startDate) {
                startDate = moment(currentDate);
            } else if (currentDate > startDate) {
                endDate = moment(currentDate);
                interval = closedDateInterval(startDate, endDate);
            } else {
                startDate = undefined;
                interval = undefined;
            }
        } else if (!startDate && endDate) {
            if (currentDate < endDate) {
                startDate = moment(currentDate);
                interval = closedDateInterval(startDate, endDate);
            } else if (currentDate > endDate) {
                endDate = moment(currentDate);
            } else {
                endDate = undefined;
                interval = undefined;
            }
        } else if (startDate && endDate) {
            if (currentDate < startDate) {
                startDate = moment(currentDate);
                interval = closedDateInterval(startDate, endDate);
            } else if (currentDate > endDate) {
                endDate = moment(currentDate);
                interval = closedDateInterval(startDate, endDate);
            } else if (currentDate > startDate && currentDate < endDate) {
                endDate = moment(currentDate);
                interval = closedDateInterval(startDate, endDate);
            } else if (compareDates(currentDate, startDate)) {
                startDate = undefined;
                interval = undefined;
            } else {
                endDate = undefined;
                interval = undefined;
            }
        }
    }

    function currentDateMethod(date) {
        if (!date) {
            return currentDate;
        } else {
            currentDate = date;
            render();
            return this;
        }
    }

    function localeMethod(value) {
        if (!value) {
            return locale;
        } else {
            locale = value;
            moment.locale(locale);
            currentDate.locale(locale);
            today.locale(locale);
            months = moment.months();
            weekdays = moment.weekdays();
            weekdaysShort = moment.weekdaysShort();
            weekdaysMin = moment.weekdaysMin();
            formatWeekdays();
            render();
            return this;
        }
    }

    return { currentDate: currentDateMethod, locale: localeMethod };

};
