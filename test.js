var closedInterval = require('./maroon.js');
var test = require('tape');

test('should return closed interval', function (assert) {
    var actual = closedInterval(1, 10);
    var expected = [1, 2, 3, 4, 5, 6 ,7 ,8, 9, 10];
    assert.deepEqual(actual, expected);
    assert.end();
});
