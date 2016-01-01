/*jslint browser: true, devel: true, vars: true, plusplus: true, maxerr: 50 */
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
        interval.length = end - start;
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
        endDate.setDate(endDate.getDate() + 1);
        var dateInterval = [];
        startDate = new Date(startDate);

        do {
            dateInterval.push(startDate);
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate() + 1);
        } while (startDate < endDate);
        return dateInterval;
    };

    // straight line code vs functions
    // maybe implement more generic so we can generate 
    // dates from Interval with startDate endDate also?
    var generateContent = function (currentDate, options) {
        // clone date so we don't modify it with object reference
        var date = new Date(currentDate);

        // get start of month according to start of week
        var daysOfWeek = closedInterval(0, 6);
        var startOfWeek = options.startOfWeek || 0;
        // I dont like this startOfMonth should be normalized
        date.setDate(1);

        // this could be a function and reused in launchCalendar
        var k = 0;
        while (k < startOfWeek) {
            daysOfWeek.unshift(daysOfWeek.pop());
            k++;
        }
        var startOfMonth = daysOfWeek[date.getDay()];

        // generate calendar content
        // replace with closedDateInterval and then slice to rowNumber
        // and 7 columns 
        // or call closedDateInterval multiple times
        var rowNumber = options.rowNumber || 5;

        var startOfContent = -startOfMonth + 1;
        date.setDate(startOfContent);
        var COLS = 7;
        var content = [];
        content.length = rowNumber;

        for (var i = 0; i < rowNumber; i++) {
            content[i] = [];
            content[i].length = COLS;
            for (var j = 0; j < COLS; j++) {
                content[i][j] = new Date(date);
                date.setDate(date.getDate() + 1);
            }
        }
        return content;
    };

    // this has no use yet add a listener or smth
    this.options = options;

    this.currentDate = options.startDate || new Date();
    var currentYear = this.currentDate.getFullYear();

    this.untilDate = options.untilDate || new Date((currentYear + 5).toString());
    var untilYear = this.untilDate.getFullYear();

    this.yearList = closedInterval(currentYear, untilYear);

    this.setContent = function () {
        this.currentContent = generateContent(this.currentDate, this.options);
    };

    // initialize content
    this.setContent();



};
