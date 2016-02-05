function maroonCalendar(options) {

    var ROWS = 6;
    var COLS = 7;
    var mode = options.mode;
    var locale = options.locale || 'en';
    moment.locale(locale);
    var months = options.months || moment.months();
    var startOfWeek = options.startOfWeek || 0;
    var weekdays = options.weekdays || moment.weekdays();
    // format weekdays according to startOfWeek parameter
    var i = 0;
    while (i < startOfWeek) {
        weekdays.push(weekdays.shift());
        i++;
    }
    var weekdaysShort = [];
    var weekdaysMin = [];
    weekdays.forEach(function (day, idx) {
        weekdaysShort[idx] = day.substring(0, 3)
        weekdaysMin[idx] = day.substring(0, 2)
    });
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

    // turns an array a into a m x n matrix
    function toMatrix(a, m, n) {
        var result = [];
        for (var i = 0; i < m; i++) {
            result[i] = a.splice(0, n);
        }
        return result;
    }

    // straight-line code over functions
    function generateContent() {
        date = currentDate.clone();
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

    // linear search for a date in the content
    function searchContent(date, condition) {
        var result = [];
        var len = content.length;
        content.forEach(function(elem, idx) {
            if (condition(date, elem)) {
                result.push(idx);
            }
        });
        return result;
    }

    function equalDates(date, otherDate) {
        if (date.isSame(otherDate, 'day') &&
            date.isSame(otherDate, 'month') &&
            date.isSame(otherDate, 'year')) {
            return true;
        } else {
            return false;
        }
    }

    function nonEqualMonths(date, otherDate) {
        if (date.isSame(otherDate, 'month')) {
            return false;
        } else {
            return true;
        }
    }

    function formatDate(date) {
        if (date) {
            return date.format('DD.MM.YYYY');
        }
    }

    // inserts the view into the html using handlebars template
    function render() {
        view = generateView();
        placeholder.html(template(view));
        styleContent();
    }

    // initialize
    render();

    // bind events
    placeholder.on('click', '.maroonMonths li', monthSelect);
    placeholder.on('click', '.maroonYears li', yearSelect);
    placeholder.on('click', '.maroonContent td', daySelect);

    function generateView() {
        var title = options.title || currentDate.format('dddd Do MMMM YYYY');
        var viewContent = content.slice();
        viewContent.forEach(function(date, idx) {
            viewContent[idx] = date.format('DD');
        });
        viewContent = toMatrix(viewContent, ROWS, COLS);

        var year = currentDate.year();
        var month = months[currentDate.month()];

        return { years, months, weekdays, weekdaysShort,
                weekdaysMin, currentDate, year, month,
                content: viewContent, title, startDate: formatDate(startDate),
                endDate: formatDate(endDate) };
    }

    function styleContent() {
        var $content = placeholder.find('.maroonContent tr');
        var $weekdays = placeholder.find('.maroonWeekdays th');

        var todayIdx = searchContent(today, equalDates);
        var currentDateIdx = searchContent(currentDate, equalDates);
        var secondaryDateIdx = searchContent(currentDate, nonEqualMonths);
        var weekdayIdx = getWeekday(currentDate);

        if (startDate) {
            var startDateIdx = searchContent(startDate, equalDates);
            styleDate(startDateIdx, 'start');
        }

        if (endDate) {
            var endDateIdx = searchContent(endDate, equalDates);
            styleDate(endDateIdx, 'end');
        }

        if (interval) {
            var intervalIdx = [];
            interval.forEach(function(date) {
                intervalIdx.push(searchContent(date, equalDates));
            });
            intervalIdx.forEach(function(dateIdx) {
                styleDate(dateIdx, 'interval');
            });
        }

        styleDate(todayIdx, 'primary');
        styleDate(currentDateIdx, 'active');
        secondaryDateIdx.forEach(function(dateIdx, idx) {
            styleDate(dateIdx, 'secondary');
        });
        $weekdays.eq(weekdayIdx).addClass('primary');

        function matrixIdx(idx) {
            if (idx.length !== 0) {
                var rowNumber = Math.floor(idx/COLS);
                var colNumber = idx%COLS;
                return [rowNumber, colNumber];
            }
            return -1;
        }

        function styleDate(idx, cssClass) {
            var mIdx = matrixIdx(idx);
            var elem = $content.eq(mIdx[0]).children().eq(mIdx[1]);
            elem.toggleClass(cssClass);
        }
    }

    function monthSelect() {
        var month = $(this).text();
        currentDate.month(month);
        updateContent();
        render();
    }

    function yearSelect() {
        var year = $(this).text();
        currentDate.year(year);
        updateContent();
        render();
    }

    function daySelect() {
        var text = $(this).text();
        var colNumber = $(this).index();
        var rowNumber = $(this).parent().index();
        var idx = (rowNumber * COLS) + colNumber;
        currentDate = content[idx];
        if (mode === 'interval') {
            intervalMode();
        }
        updateContent();
        render();
    }

    function intervalMode() {
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
            } else if (currentDate.isSame(startDate, 'year') &&
                    currentDate.isSame(startDate, 'month') &&
                    currentDate.isSame(startDate, 'day')) {
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
            updateContent();
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
            updateContent();
            render();
            return this;
        }
    }

    return { currentDate: currentDateMethod, locale: localeMethod };

};
