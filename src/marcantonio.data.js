(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    /************************* New Area methods ******************************/
    Marc.Area.prototype.data = function data() {
        return this.element.data.apply(this.element, arguments);
    };
    Marc.Area.prototype.removeData = function removeData() {
        return this.element.removeData.apply(this.element, arguments);
    };
    Marc.Area.prototype.setValue = function setValue(value) {
        this.data(Marc.valueKey, value);
    };
    Marc.Area.prototype.unsetValue = function unsetValue(value) {
        this.removeData(Marc.valueKey);
    };
    Marc.Area.prototype.getValue = function getValue() {
        return this.data(Marc.valueKey);
    };
    
    /************************* New View methods ******************************/
    Marc.View.prototype.setValues = function setValues(newValues) {
        for (var areaName in this.areas) {
            if (this.areas.hasOwnProperty(areaName)) {
                var area = this.areas[areaName];
                area.setValue(newValues[areaName]);
            }
        }
    };
    Marc.View.prototype.unsetValues = function unsetValues(value) {
        for (var areaName in this.areas) {
            if (this.areas.hasOwnProperty(areaName)) {
                var area = this.areas[areaName];
                area.unsetValue();
            }
        }
    };
    Marc.View.prototype.getValues = function getValues() {
        var values = {};
        for (var areaName in this.areas) {
            if (this.areas.hasOwnProperty(areaName)) {
                var area = this.areas[areaName];
                values[areaName] = area.getValue();
            }
        }
        return values;
    };
}(this));
