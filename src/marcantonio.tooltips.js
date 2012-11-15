(function(window) {
    "use strict";
    
    var Marc = window.Marc || {};
    window.Marc = Marc;
    
    Marc.tooltips = {
        elementId: 'marcantonio-tooltip',
        positionTooltip: function positionTooltip(area, event) {
            var tooltipElem = document.getElementById(Marc.tooltips.elementId);
            if (tooltipElem && event) {
                tooltipElem.style.position = 'absolute';
                tooltipElem.style.top = event.clientY + 5 + 'px';
                tooltipElem.style.left = event.clientX + 5 + 'px';
            }
        },
        removeTooltip: function removeTooltip() {
            var tooltipElem = document.getElementById(Marc.tooltips.elementId);
            if (tooltipElem) {
                document.body.removeChild(tooltipElem);
            }
        },
        renderTooltip: function renderTooltip(content, event) {
            Marc.tooltips.removeTooltip();
            
            var tooltipFrag = document.createDocumentFragment();
            
            var tooltipDiv = document.createElement('div');
            tooltipDiv.setAttribute('id', Marc.tooltips.elementId);
            
            if (content) {
                tooltipDiv.innerHTML = content;
                
                tooltipFrag.appendChild(tooltipDiv);
                document.body.appendChild(tooltipFrag);
                
                Marc.tooltips.positionTooltip(null, event);
            }
        }
    };
    
    Marc.View.prototype.addTooltips = function addTooltips(formatter) {
        var fullyRenderTooltip = function fullyRenderTooltip(area, event) {
            Marc.tooltips.renderTooltip(formatter(area), event);
        };
        this.addEvents('mouseover', fullyRenderTooltip);
        this.addEvents('mousemove', Marc.tooltips.positionTooltip);
        this.addEvents('mouseout', Marc.tooltips.removeTooltip);
    };
    
    Marc.View.prototype.removeTooltips = function removeTooltips() {
        this.removeEvents('mouseover');
        this.removeEvents('mousemove');
        this.removeEvents('mouseout');
    };
}(this));
