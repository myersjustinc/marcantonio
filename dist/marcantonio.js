/*! Marcantonio.js - v0.1.0 - 2012-11-14
 * https://github.com/myersjustinc/marcantonio
 * Copyright (c) 2012 Justin Myers; Licensed BSD */

(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    Marc.R = window.Raphael;
    Marc.valueKey = 'marc-value';
    
    Marc.Drawing = function Drawing(container) {
        var self = this;
        
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
    
    Marc.View = function View(drawing, pathData) {
        pathData = pathData || {};
        drawing.hideAllViews();
        
        var self = this;
        
        this.areas = {};
        for (var pathName in pathData) {
            if (pathData.hasOwnProperty(pathName)) {
                this.areas[pathName] = new Marc.Area(drawing, pathName,
                    pathData[pathName]);
            }
        }
        
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
        
        this.setValues = function setValues(newValues) {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    var area = self.areas[areaName];
                    area.setValue(newValues[areaName]);
                }
            }
        };
        this.unsetValues = function unsetValues(value) {
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    var area = self.areas[areaName];
                    area.unsetValue();
                }
            }
        };
        this.getValues = function getValues() {
            var values = {};
            for (var areaName in self.areas) {
                if (self.areas.hasOwnProperty(areaName)) {
                    var area = self.areas[areaName];
                    values[areaName] = area.getValue();
                }
            }
            return values;
        };
        
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
    
    Marc.Area = function Area(drawing, areaName, pathData) {
        var self = this;
        
        this.element = drawing.paper.path(pathData);
        this.name = areaName;
        
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
        
        this.data = function data() {
            return this.element.data.apply(this.element, arguments);
        };
        this.removeData = function removeData() {
            return this.element.removeData.apply(this.element, arguments);
        };
        this.setValue = function setValue(value) {
            self.data(Marc.valueKey, value);
        };
        this.unsetValue = function unsetValue(value) {
            self.removeData(Marc.valueKey);
        };
        this.getValue = function getValue() {
            return self.data(Marc.valueKey);
        };
        
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
