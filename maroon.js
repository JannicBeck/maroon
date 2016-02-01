function maroonCalendar(options) {

    const ROWS = 6;
    const COLS = 7;
    var locale = options.locale || 'en';
    moment.locale(locale);
    var currentDate = new moment();
    var startOfWeek = options.startOfWeek || 0;
    var timespan = options.timespan || [currentDate.year(), currentDate.clone().add(5, 'year')];
    var years = closedInterval(timespan[0], timespan[1]);
    var content = generateContent();
    var today = new moment();

    function updateContent() {
        content = generateContent();
    }

    Object.defineProperty(this, 'currentDate', {
        get: function() {
            return currentDate;
        },
        set: function(date) {
            currentDate = date;
            updateContent();
            render();
        }
    });

    Object.defineProperty(this, 'locale', {
        get: function() {
            return locale;
        },
        set: function(value) {
            locale = value;
            moment.locale(locale);
            currentDate.locale(locale);
            updateContent();
            render();
        }
    });

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
    };

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
    };

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
    };

    // turns an array a into a m x n matrix
    function toMatrix(a, m, n) {
        var result = [];
        for (var i = 0; i < m; i++) {
            result[i] = a.splice(0, n);
        }
        return result;
    };

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
    };

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
    };

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

    var $placeholder = $('#maroonPlaceholder');
    var $template = $('#maroonDatepicker');
    var view;

    // initialize
    render();

    // bind events
    $placeholder.on('click', '.maroonMonths li', monthSelect);
    $placeholder.on('click', '.maroonYears li', yearSelect);
    $placeholder.on('click', '.maroonContent td', daySelect);

    function generateView() {
        var title = options.title || currentDate.format('dddd Do MMMM YYYY');
        var viewContent = content.slice();
        viewContent.forEach(function(date, idx) {
            viewContent[idx] = date.format('DD');
        });
        viewContent = toMatrix(viewContent, ROWS, COLS);

        var weekdays = moment.weekdays();
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

        var months = moment.months();
        var year = currentDate.year();
        var month = months[currentDate.month()];

        return { years, months, weekdays, weekdaysShort,
                weekdaysMin, currentDate, year, month,
                content: viewContent, title };
    };

    // inserts the view into the html using mustache templating
    function render() {
        view = generateView();
        var html = Mustache.render($template.html(), view);
        Mustache.parse(html);
        $placeholder.html(html);
        styleContent();
    };

    function styleContent() {

        var $content = $('.maroonContent tr');
        var $weekdays = $('.maroonWeekdays th');

        var todayIdx = searchContent(today, equalDates);
        var currentDateIdx = searchContent(currentDate, equalDates);
        var secondaryDateIdx = searchContent(currentDate, nonEqualMonths);
        var weekdayIdx = getWeekday(currentDate);

        styleDate(todayIdx, 'primary');
        styleDate(currentDateIdx, 'active');
        secondaryDateIdx.forEach(function(date, idx) {
            styleDate(date, 'secondary');
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
            elem.addClass(cssClass);
        }
    };

    function monthSelect() {
        var month = $(this).text();
        currentDate.month(month);
        updateContent();
        render();
    };

    function yearSelect() {
        var year = $(this).text();
        currentDate.year(year);
        updateContent();
        render();
    };

    function daySelect() {
        var text = $(this).text();
        var colNumber = $(this).index();
        var rowNumber = $(this).parent().index();
        var idx = (rowNumber * COLS) + colNumber;
        currentDate = content[idx];
        updateContent();
        render();
    };

};
