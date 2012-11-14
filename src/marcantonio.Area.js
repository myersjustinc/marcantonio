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
