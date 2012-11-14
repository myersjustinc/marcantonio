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
