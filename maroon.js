function maroonCalendar(options) {

    // MODEL ---------------------------------------------------------------------------------------
    var title = options.title;
    var placeholder = options.placeholder;
    var template = options.template;
    var locale = options.locale || 'en';
    moment.locale(locale);
    var intervalMode = options.intervalMode || false;
    var timespan = options.timespan || [currentDate.year(), currentDate.clone().add(5, 'year')];

    var ROWS = 6;
    var COLS = 7;
    var months = moment.months();
    var weekdays = moment.weekdays();
    var weekdaysMin = moment.weekdaysMin();
    var currentDate = new moment();
    var today = new moment();
    var years = closedInterval(timespan[0], timespan[1]);
    var content = generateContent();

    // inserts the view into the html using handlebars templating engine
    function render() {
        var view = generateView();
        placeholder.html(template(view));
        styleCalendar();
    }

    // initialize
    render();

    // attention: under heavy construction, please put your helmet on for your own safety
    function generateView() {
        var currentYear = currentDate.year();
        var currentMonth = months[currentDate.month()];

        var viewMonths = months.map(function(month, idx) {
            var timeElement = $('<time></time>');
            timeElement.attr('dateTime', currentDate.format('YYYY-MM'));
            timeElement.html(month);
            timeElement.addClass('maroonInnerMonth');
            return timeElement.prop('outerHTML');
        });

        var viewYears = years.map(function(year, idx) {
            var timeElement = $('<time></time>');
            timeElement.attr('dateTime', currentDate.format('YYYY'));
            timeElement.html(year);
            timeElement.addClass('maroonInnerYear');
            return timeElement.prop('outerHTML');
        });

        var viewContent = content.map(function(date) {
            var timeElement = $('<time></time>');
            timeElement.attr('dateTime', date.format('YYYY-MM-DD'));
            timeElement.html(date.format('DD'));
            timeElement.addClass('maroonInnerDate');
            if (compareDates(date, today)) {
                timeElement.addClass('primary');
            }
            if (!date.isSame(currentDate, 'month')) {
                timeElement.addClass('secondary');
            }
            if (compareDates(date, currentDate)) {
                timeElement.addClass('current');
            }

            return timeElement.prop('outerHTML');
        });

        viewContent = toMatrix(viewContent, ROWS, COLS);

        return { years: viewYears, months: viewMonths,
                weekdays, weekdaysMin, currentDate,
                currentYear, currentMonth, content: viewContent, title };
    }
    // ---------------------------------------------------------------------------------------------





    // CONTROLLER ----------------------------------------------------------------------------------
    function updateContent() {
        content = generateContent();
        render();
    }

    function styleCalendar() {
        styleParent('.maroonInnerYear', 'maroonYear');
        styleParent('.maroonInnerMonth', 'maroonMonth');
        styleParent('.maroonInnerDate', 'maroonDate');

        function styleParent(childClass, cssClass) {
            var $child = placeholder.find(childClass);
            $child.each(function() {
                var $node = $(this);
                var $parent = $node.parent();
                var nodeClass = $node.attr('class');
                $parent.addClass(cssClass);
                if (nodeClass) {
                    $parent.addClass(nodeClass);
                }
            });
        }
    }
    // ---------------------------------------------------------------------------------------------







    // VIEW ----------------------------------------------------------------------------------------
    // bind events
    placeholder.on('click', '.maroonMonth', monthSelect);
    placeholder.on('click', '.maroonYear', yearSelect);
    placeholder.on('click', '.maroonDate', daySelect);

    function monthSelect(e) {
        var month = $(this).text();

        // update the model (send to controller?)
        currentDate.month(month);
        updateContent();
    }

    function yearSelect(e) {
        var year = $(this).text();

        // update the model (send to controller?)
        currentDate.year(year);
        updateContent();
    }

    function daySelect(e) {
        var value = $(this).find('time').attr('datetime');
        var date = moment(value).locale(locale);

        // update the model (send to controller?)
        currentDate = date;
        if (intervalMode) {
            activateIntervalMode();
        }
        updateContent();
    }
    // ---------------------------------------------------------------------------------------------






    // HELPERS -------------------------------------------------------------------------------------
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

    function compareDates(date, otherDate) {
        if( date.isSame(otherDate, 'day') &&
            date.isSame(otherDate, 'month') &&
            date.isSame(otherDate, 'year')) {

            return true;
        } else {
            return false;
        }
    }

    // generates a 6*7 array with date objects as elements
    function generateContent() {
        var date = currentDate.clone();
        date.date(1);
        // 0 means start week on sunday, 1 monday ...
        var startOfMonth = date.weekday();
        var startOfContent = -startOfMonth + 1;
        date.date(startOfContent);
        var cellNumber = ROWS * COLS;
        var endDate = date.clone();
        endDate.add(cellNumber - 1, 'day');
        var content = closedDateInterval(date, endDate);
        return content;
    }

    // turns an array a into a m x n matrix
    function toMatrix(a, m, n) {
        var result = [];
        for (var i = 0; i < m; i++) {
            result[i] = a.splice(0, n);
        }
        return result;
    }
    // ---------------------------------------------------------------------------------------------



    return { currentDate, locale };

};
