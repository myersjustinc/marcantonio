/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Marc:false*/
(function(window, $, Marc) {
    /*
        ======== A Handy Little QUnit Reference ========
        http://docs.jquery.com/QUnit
        
        Test methods:
            expect(numAssertions)
            stop(increment)
            start(decrement)
        Test assertions:
            ok(value, [message])
            equal(actual, expected, [message])
            notEqual(actual, expected, [message])
            deepEqual(actual, expected, [message])
            notDeepEqual(actual, expected, [message])
            strictEqual(actual, expected, [message])
            notStrictEqual(actual, expected, [message])
            raises(block, [expected], [message])
    */
    
    var boxPaths = {
        "A": "M 50 50 L 100 50 L 100 100 L 50 100 z",
        "B": "M 100 50 L 150 50 L 150 100 L 100 100 z",
        "C": "M 50 100 L 100 100 L 100 150 L 50 150 z",
        "D": "M 100 100 L 150 100 L 150 150 L 100 150 z"
    };
    var boxValues = {
        "A": 5,
        "B": 50,
        "C": 500,
        "D": 5000
    };
    
    test('Basic functionality', function() {
        $('<div id="boxes"></div>').appendTo('#qunit-fixture');
        var drawing = new Marc.Drawing('boxes');
        var view = drawing.addView('boxes', boxPaths);
        var areaA = view.areas['A'];
        
        ok(drawing, 'Drawing object exists');
        ok(view, 'View object exists');
        ok(areaA, 'Area object exists');
        deepEqual(areaA.element.paper, drawing.paper,
            'Area exists on drawing');
    });
    
    test('Coloring paths', function() {
        $('<div id="boxes"></div>').appendTo('#qunit-fixture');
        var view = new Marc.Drawing('boxes').addView('boxes', boxPaths);
        var areaA = view.areas['A'];
        
        view.setColors(function(area) {
            if (area.name === 'A') {
                return '#009';
            } else if (area.name === 'B') {
                return '#900';
            } else if (area.name === 'C') {
                return '#090';
            } else {
                return '#909';
            }
        });
        view.setStrokes(function(area) {
            return '#ccc';
        });
        
        deepEqual(Marc.R.getRGB(areaA.getFill()), Marc.R.getRGB('#009'),
            'Area fill set properly');
        deepEqual(Marc.R.getRGB(areaA.getStroke()), Marc.R.getRGB('#ccc'),
            'Area stroke set properly');
    });
    
    test('Binding events', function() {
        $('<div id="boxes"></div>').appendTo('#qunit-fixture');
        var view = new Marc.Drawing('boxes').addView('boxes', boxPaths);
        var areaA = view.areas['A'];
        var areaB = view.areas['B'];
        
        var handlerResult = null;
        
        var clickEvent = window.document.createEvent('SVGEvents');
        clickEvent.initEvent('click', true, true);
        
        view.addEvents('click', function(area) {
            handlerResult = 'This is area ' + area.name + '!';
        });
        areaA.element.node.dispatchEvent(clickEvent);
        equal(handlerResult, 'This is area A!',
            'Click handler bound properly');
        areaB.element.node.dispatchEvent(clickEvent);
        equal(handlerResult, 'This is area B!',
            'Different click handlers act differently');
        
        view.removeEvents('click');
        handlerResult = null;
        areaA.element.node.dispatchEvent(clickEvent);
        equal(handlerResult, null, 'Click handler removed properly');
    });
    
    test('Handling values', function() {
        $('<div id="boxes"></div>').appendTo('#qunit-fixture');
        var view = new Marc.Drawing('boxes').addView('boxes', boxPaths);
        var areaA = view.areas['A'];
        
        var initialValues = view.getValues();
        strictEqual(initialValues['A'], undefined,
            'Values start off undefined');
        
        view.setValues(boxValues);
        var newValues = view.getValues();
        strictEqual(newValues['A'], areaA.element.data(Marc.valueKey),
            'Values report properly');
        strictEqual(newValues['A'], boxValues['A'], 'Values set properly');
        
        view.unsetValues();
        var finalValues = view.getValues();
        strictEqual(finalValues['A'], undefined, 'Values unset properly');
    });
}(this, jQuery, Marc));
