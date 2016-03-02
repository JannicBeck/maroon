module.exports = function () {
    // returns a closed interval from start to end
    function closedInterval(start, end) {
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

    // turns an array a into a m x n matrix
    function toMatrix(a, m, n) {
        var result = [];
        for (var i = 0; i < m; i++) {
            result[i] = a.splice(0, n);
        }
        return result;
    }

    // returns the index a date in an array of date objects
    function searchDateArray(date, a) {
        return a.map(function(arrayDate) {
            return arrayDate.format('YYYY-MM-DD');
        }).indexOf(date.format('YYYY-MM-DD'));
    }

    return { closedInterval: closedInterval,  closedDateInterval: closedDateInterval,
            toMatrix: toMatrix, searchDateArray: searchDateArray};
}
