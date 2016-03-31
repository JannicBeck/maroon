var test = require('tape');

test('browser tests', function (t) {

    var el = document.createElement('div');

    t.equal(2 + 3, 5);
    t.equal(3 * 3 + 0, 9);

    t.end();
});
