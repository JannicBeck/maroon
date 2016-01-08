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
        if (start > end) { return []; }
        end++;
        var interval = [];
        var i = start;
        do {
            interval[i - start] = i;
            i++;
        } while (i < end);
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

    // straight-line code over functions
    var generateContent = function (date, options) {
        // clone date so we don't modify it via object reference
        date = new Date(date);

        // get start of month according to start of week
        var dayList = closedInterval(0, 6);
        var startOfWeek = options.startOfWeek || 0;
        date.setDate(1);
        var k = 0;
        while (k < startOfWeek) {
            dayList.unshift(dayList.pop());
            k++;
        }
        var startOfMonth = dayList[date.getDay()];

        // generate calendar content
        var rowNumber = options.rowNumber || 6;
        var startOfContent = -startOfMonth + 1;
        date.setDate(startOfContent);
        var COLS = 7;
        var cellNumber = rowNumber * COLS;
        var endDate = new Date(date);
        endDate.setDate(endDate.getDate() + cellNumber - 1);
        var dateInterval = closedDateInterval(date, endDate);
        var content = [];
        for (var i = 0; i < rowNumber; i++) {
            content[i] = dateInterval.splice(0, COLS);
        }

        return content;
    };

    // this has no use yet add a listener or smth
    this.options = options;

    this.currentDate = options.startDate || new Date();
    var currentYear = this.currentDate.getFullYear();
    this.endDate = options.endDate || new Date((currentYear + 5).toString());
    var untilYear = this.endDate.getFullYear();
    this.yearList = closedInterval(currentYear, untilYear);
    this.setContent = function () {
        this.currentContent = generateContent(this.currentDate, this.options);
    };
    this.setContent();

    this.setDateInterval = function () {
        this.dateInterval = closedDateInterval(this.startDateInterval, this.endDateInterval);
    };
    this.startDateInterval = new Date();
    this.endDateInterval = new Date();

};
