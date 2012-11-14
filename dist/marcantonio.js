/*! Marcantonio.js - v0.1.0 - 2012-11-14
 * https://github.com/myersjustinc/marcantonio
 * Copyright (c) 2012 Justin Myers; Licensed BSD */

(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    Marc.R = window.Raphael;
    Marc.valueKey = 'marcantonio-value';
}(this));

(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    /************************** Overall canvas *******************************/
    Marc.Drawing = function Drawing(container) {
        var self = this;
        
        /************** Find element to pass to Raphaël **********************/
        var contElem;
        if (typeof container === 'string') {
            // container is an element ID
            contElem = window.document.getElementById(container);
        } else if (typeof container.append === 'function') {
            // container is a jQuery object
            contElem = container[0];
        } else if (typeof container.nodeName === 'string') {
            // container is a DOM node
            contElem = container;
        } else {
            throw new Error("Invalid argument for Drawing container");
        }
        
        this.paper = Marc.R(contElem);
        
        /*********************** View handling *******************************/
        var views = {};
        this.addView = function addView(viewName, pathData) {
            if (views[viewName]) {
                views[viewName].destroy();
            }
            views[viewName] = new Marc.View(self, pathData);
            return views[viewName];
        };
        this.getView = function getView(viewName) {
            return views[viewName];
        };
        
        this.hideAllViews = function hideAllViews() {
            for (var viewName in views) {
                if (views.hasOwnProperty(viewName)) {
                    views[viewName].hide();
                }
            }
        };
        this.showView = function showView(viewName) {
            if (!views[viewName]) {return;}
            self.hideAllViews();
            views[viewName].show();
        };
    };
}(this));

(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    /********* Individual view (image); Drawing can have several *************/
    Marc.View = function View(drawing, pathData) {
        pathData = pathData || {};
        drawing.hideAllViews();
        
        var self = this;
        
        /******************* Render paths (areas) ****************************/
        this.areas = {};
        for (var pathName in pathData) {
            if (pathData.hasOwnProperty(pathName)) {
                this.areas[pathName] = new Marc.Area(drawing, pathName,
                    pathData[pathName]);
            }
        }
        
        /****************** Change view visibility ***************************/
        this.hide = function hide() {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    self.areas[areaName].element.hide();
                }
            }
        };
        this.show = function show() {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    self.areas[areaName].element.show();
                }
            }
        };
        this.destroy = function destroy() {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    self.areas[areaName].element.remove();
                }
            }
        };
        
        /**************** Set all areas' fill/stroke *************************/
        this.setColors = function setColors(formatter) {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    var area = self.areas[areaName];
                    area.setFill(formatter(area));
                }
            }
        };
        this.setStrokes = function setStrokes(formatter) {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    var area = self.areas[areaName];
                    area.setStroke(formatter(area));
                }
            }
        };
        
        /**************** Event binding for all areas ************************/
        this.addEvents = function addEvents(eventName, eventHandler) {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    var area = self.areas[areaName];
                    area.addEvent(eventName, eventHandler);
                }
            }
        };
        this.removeEvents = function removeEvents(eventName) {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    var area = self.areas[areaName];
                    area.removeEvent(eventName);
                }
            }
        };
    };
}(this));

(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    /****************** Individual shape within a view ***********************/
    Marc.Area = function Area(drawing, areaName, pathData) {
        var self = this;
        
        this.element = drawing.paper.path(pathData);
        this.name = areaName;
        
        /********************** Fill and stroke ******************************/
        this.getFill = function getFill() {
            return self.element.attr('fill');
        };
        this.setFill = function setFill(newFill) {
            self.element.attr('fill', newFill);
        };
        this.getStroke = function getStroke() {
            return self.element.attr('stroke');
        };
        this.setStroke = function setStroke(newStroke) {
            self.element.attr('stroke', newStroke);
        };
        
        /********************** Event handling *******************************/
        var handlers = {};
        this.addEvent = function addEvent(eventName, eventHandler) {
            if (!handlers[eventName]) {
                handlers[eventName] = [];
            }
            
            var newHandler = function(event) {
                eventHandler.call(self, self, event);
            };
            handlers[eventName].push(newHandler);
            
            for (var i = 0, len = handlers[eventName].length; i < len; i++) {
                var handler = handlers[eventName][i];
                self.element['un' + eventName](handler);
                self.element[eventName](handler);
            }
        };
        this.removeEvent = function removeEvent(eventName) {
            if (!handlers[eventName]) {
                return;
            }
            
            for (var i = 0, len = handlers[eventName].length; i < len; i++) {
                var handler = handlers[eventName][i];
                self.element['un' + eventName](handler);
            }
            
            handlers[eventName] = handlers[eventName].splice(
                handlers[eventName].length);
        };
    };
}(this));

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

(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    Marc.View.prototype.addTooltips = function addTooltips(formatter) {
        
    };
    
    Marc.View.prototype.removeTooltips = function removeTooltips() {
        
    };
}(this));
