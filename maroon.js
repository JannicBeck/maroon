function Calendar(options) {

    const ROWS = 6;
    const COLS = 7;
    var locale = options.locale || 'en';
    moment.locale(locale);
    var startOfWeek = options.startOfWeek || 0;
    var currentDate = new moment();
    var timespan = options.timespan || [currentDate.year(), currentDate.clone().add(5, 'year')];
    var years = closedInterval(timespan[0], timespan[1]);
    var content = generateContent();
    var today = new moment();

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

    // binary search for a date in the content
    function searchContent() {

    };

    $(function($){

        var $placeholder = $('#calendar-placeholder');
        var $template = $('#calendar-template');
        var view;

        // initialize
        render();

        // bind events
        $placeholder.on('click', '.month-dropdown li', monthSelect);
        $placeholder.on('click', '.year-dropdown li', yearSelect);
        $placeholder.on('click', '.calendar-table tbody td', daySelect);

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

            return {years, months, weekdays, weekdaysShort,
                    weekdaysMin, currentDate, year, month,
                    content: viewContent, title ,
                    lam : function () {
                      return function(text, render) {
                          return "<b>" + render(text) + "</b>";
                      }
                    }

                };
        };

        // inserts the view into the html using mustache templating
        function render() {
            view = generateView();
            var html = Mustache.render($template.html(), view);
            Mustache.parse(html);
            $placeholder.html(html);
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
            var date = $(this).text();
            currentDate.date(date);
            updateContent();
            render();
        };

        // If the value of a section variable is a function, it will be called in the context
        // of the current item in the list on each iteration.

        // I should give classes in here and bind events based on those f.e. 'today'

    }(jQuery));

    return { currentDate };
};
