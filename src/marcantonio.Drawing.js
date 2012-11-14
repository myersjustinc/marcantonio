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
