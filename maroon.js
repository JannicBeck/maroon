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

    var currentDate = new moment();
    var today = new moment();
    var timespan = options.timespan || [currentDate.year(), currentDate.clone().add(5, 'year')];
    var years = closedInterval(timespan[0], timespan[1]);
    var content = generateContent();

    var placeholder = options.placeholder;
    var template = options.template;

    var startDate;
    var interval;
    var endDate;

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

    // attention: under heavy construction, please put your helmet on for your own safety
    function generateView() {
        var title = options.title || currentDate.format('dddd Do MMMM YYYY');

        var year = currentDate.year();
        var month = months[currentDate.month()];

        var $viewWeekdays = weekdays.map(function(weekday) {
            var $weekday = $('<p></p>');
            $weekday.html(weekday);
            return $weekday;
        });
        $viewWeekdays[getWeekday(currentDate)].addClass('primary');
        
        var viewWeekdays = $viewWeekdays.map(function($weekday) {
            return $weekday.prop('outerHTML');
        });

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
        } finally {
            // do nothing
        }

        var viewContent = content.map(function(date) {
            var cssClass = '';
            var timeElement = $('<time></time>');
            timeElement.attr('dateTime', date.format('YYYY-MM-DD'));
            timeElement.html(date.format('DD'));
            timeElement.addClass(cssClass);
            var dateElement = timeElement.prop('outerHTML');
            return dateElement;
        });

        // get index of today viewContent[idx].addClass('primary')

        //     var cssClass = '';
        //     if (compareDates(date, today)) {
        //         cssClass += 'primary ';
        //     }
        //     if (!date.isSame(currentDate, 'month')) {
        //         cssClass += 'secondary ';
        //     }
        //     if (compareDates(date, currentDate)) {
        //         cssClass += 'current ';
        //     }
        //     if (intervalMode) {
        //         if (startDate) {
        //             if (compareDates(date, startDate)) {
        //                 cssClass += 'start ';
        //             }
        //         }
        //         if (endDate) {
        //             if (compareDates(date, endDate)) {
        //                 cssClass += 'end ';
        //             }
        //         }
        //         if (interval) {
        //             interval.forEach(function(intervalDate) {
        //                 if (compareDates(date, intervalDate)) {
        //                     cssClass += 'interval ';
        //                 }
        //             });
        //         }
        //     }

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
                weekdaysMin: viewWeekdaysMin, currentDate, currentYear: year, currentMonth: month,
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
        var view = generateView();
        placeholder.html(template(view));

        // does this slow the app down significantly?
        styleCalendar();
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

    function styleCalendar() {
        // I need a different selector here because I don't want to select month, year and days
        var $timeElements = placeholder.find('time');
        $timeElements.each(function() {
            var $node = $(this);
            var $parent = $node.parent();
            var nodeClass = $node.attr('class');
            $parent.addClass('maroonDate ');
            if (nodeClass) {
                $parent.addClass(nodeClass);
            }
        });
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

    // this is ugly find a cleaner solution
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
