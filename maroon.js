function maroonCalendar(options) {

    var ROWS = 6;
    var COLS = 7;
    var mode = options.mode;
    var locale = options.locale || 'en';
    moment.locale(locale);
    var months = moment.months();

    var weekdays = moment.weekdays();
    var weekdaysShort = moment.weekdaysShort();
    var weekdaysMin = moment.weekdaysMin();

    var startOfWeek = options.startOfWeek || 0;
    // format weekdays according to startOfWeek parameter
    var i = 0;
    while (i < startOfWeek) {
        weekdays.push(weekdays.shift());
        i++;
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

        var weekdaysClassList = [];
        weekdaysClassList[getWeekday(currentDate)] = 'primary';
        var viewWeekdaysMin = toObjectArray(weekdaysMin, weekdaysClassList);

        var monthClassList = [];
        monthClassList[currentDate.month()] = 'primary';
        var viewMonths = toObjectArray(months, monthClassList);

        var yearClassList = [];
        yearClassList[years.indexOf(currentDate.year())] = 'primary';
        var viewYears = toObjectArray(years, yearClassList);

        var viewContent = content.slice();
        var contentClassList = [];
        viewContent.forEach(function(date, idx) {
            contentClassList[idx] = [];
            viewContent[idx] = date.format('DD');
            if (date.isSame(today, 'day') &&
                date.isSame(today, 'month') &&
                date.isSame(today, 'year')) {
                contentClassList[idx].push('primary ');
            }
            if (!date.isSame(currentDate, 'month')) {
                contentClassList[idx].push('secondary ');
            }
            if (date.isSame(currentDate)) {
                contentClassList[idx].push('active ');
            }

            if (mode === 'interval') {
                if (startDate) {
                    if (date.isSame(startDate, 'day') &&
                        date.isSame(startDate, 'month') &&
                        date.isSame(startDate, 'year')) {
                        contentClassList[idx].push('start ');
                    }
                }
                if (endDate) {
                    if (date.isSame(endDate, 'day') &&
                        date.isSame(endDate, 'month') &&
                        date.isSame(endDate, 'year')) {
                        contentClassList[idx].push('end ');
                    }
                }
                if (interval) {
                    interval.forEach(function(intervalDate) {
                        if (date.isSame(intervalDate, 'day') &&
                            date.isSame(intervalDate, 'month') &&
                            date.isSame(intervalDate, 'year')) {
                            contentClassList[idx].push('interval ');
                        }
                    });
                }
            }
        });

        viewContent = toMatrix(viewContent, ROWS, COLS);
        contentClassList = toMatrix(contentClassList, ROWS, COLS);

        viewContent.forEach(function(row, idx) {
            viewContent[idx] = toObjectArray(row, contentClassList[idx]);
        });

        viewContent.forEach(function(row, j) {
            row.forEach(function(obj, i) {
                obj.date = content[i+j*COLS];
            });
        });

        // use reduce instead of this
        function toObjectArray(textList, classList) {
            var result = [];
            textList.forEach(function(elem, idx) {
                result.push({
                    text: textList[idx],
                    class: classList[idx]
                });
            });
            return result;
        }

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

    // inserts the view into the html using handlebars template
    function render() {
        updateContent();
        view = generateView();
        placeholder[0].innerHTML = template(view);

        var maroonMonths = document.querySelectorAll(".maroonMonths li");
        var maroonYears = document.querySelectorAll(".maroonYears li");

        addEvents(maroonMonths, 'click', monthSelect);
        addEvents(maroonYears, 'click', yearSelect);

        function addEvents(list, event, callback) {
            for (var i = 0; i < list.length; i++) {
                list[i].addEventListener(event, callback);
            }
        }

    }

    // initialize
    render();

    function monthSelect(node) {
        var month = node.target.innerHTML;
        currentDate.month(month);
        render();
    }

    function yearSelect(node) {
        var year = node.target.innerHTML;
        currentDate.year(year);
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
            // if (mode === 'interval') {
            //     intervalMode();
            // }
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
            months = moment.months();
            weekdays = moment.weekdays();
            weekdaysShort = moment.weekdaysShort();
            weekdaysMin = moment.weekdaysMin();
            render();
            return this;
        }
    }

    return { currentDate: currentDateMethod, locale: localeMethod };

};
