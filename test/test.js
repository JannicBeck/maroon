var test = require('tape');

// general category for the tests that follow
// suite('html');


test('basic arithmetic', function (t) {

    // var el = document.createElement('div');

    t.equal(2 + 3, 5);
    t.equal(7 * 8 + 9, 65);

    t.end();
});
