(function(window) {
    "use strict";
    
    var $ = window.jQuery;
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    Marc.R = window.Raphael;
    
    Marc.Drawing = function Drawing(container) {
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
            views[viewName] = new Marc.View(this, pathData);
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
            this.hideAllViews();
            views[viewName].show();
        };
    };
    
    Marc.View = function View(drawing, pathData) {
        pathData = pathData || {};
        drawing.hideAllViews();
        
        this.areas = {};
        for (var pathName in pathData) {
            if (pathData.hasOwnProperty(pathName)) {
                this.areas[pathName] = new Marc.Area(drawing, pathName,
                    pathData[pathName]);
            }
        }
        
        this.hide = function hide() {
            for (var areaName in this.areas) {
                if (this.areas.hasOwnProperty(areaName)) {
                    this.areas[areaName].element.hide();
                }
            }
        };
        this.show = function show() {
            for (var areaName in this.areas) {
                if (this.areas.hasOwnProperty(areaName)) {
                    this.areas[areaName].element.show();
                }
            }
        };
        this.destroy = function destroy() {
            for (var areaName in this.areas) {
                if (this.areas.hasOwnProperty(areaName)) {
                    this.areas[areaName].element.remove();
                }
            }
        };
        
        this.setColors = function setColors(formatter) {
            for (var areaName in this.areas) {
                if (this.areas.hasOwnProperty(areaName)) {
                    var area = this.areas[areaName];
                    area.setFill(formatter(area));
                }
            }
        };
        this.setStrokes = function setStrokes(formatter) {
            for (var areaName in this.areas) {
                if (this.areas.hasOwnProperty(areaName)) {
                    var area = this.areas[areaName];
                    area.setStroke(formatter(area));
                }
            }
        };
    };
    
    Marc.Area = function Area(drawing, areaName, pathData) {
        this.element = drawing.paper.path(pathData);
        this.name = areaName;
        
        this.getFill = function getFill() {
            return this.element.attr('fill');
        };
        this.setFill = function setFill(newFill) {
            this.element.attr('fill', newFill);
        };
        this.getStroke = function getStroke() {
            return this.element.attr('stroke');
        };
        this.setStroke = function setStroke(newStroke) {
            this.element.attr('stroke', newStroke);
        };
    };
}(this));
