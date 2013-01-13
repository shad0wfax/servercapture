/*
 * Based on - 
 feedback.js <http://experiments.hertzen.com/jsfeedback/>
 Copyright (c) 2012 Niklas von Hertzen. All rights reserved.
 http://www.twitter.com/niklasvh

 Released under MIT License
*/
(function( window, document, undefined ) {
if ( window.comingUp !== undefined ) { 
    return; 
}

// log proxy function
var log = function( msg ) {
    window.console.log( msg );
},
// function to remove elements, input as arrays
removeElements = function( remove ) {
    for (var i = 0, len = remove.length; i < len; i++ ) {
        var item = Array.prototype.pop.call( remove );
        if ( item !== undefined ) {
            if (item.parentNode !== null ) { // check that the item was actually added to DOM
                item.parentNode.removeChild( item );
            }
        }
    }
},
loader = function() {
    var div = document.createElement("div"), i = 3;
    div.className = "feedback-loader";
    
    while (i--) { div.appendChild( document.createElement( "span" )); }
    return div;
},
getBounds = function( el ) {
    return el.getBoundingClientRect();
},
emptyElements = function( el ) {
    var item;
    while( (( item = el.firstChild ) !== null ? el.removeChild( item ) : false) ) {}
},
element = function( name, text ) {
    var el = document.createElement( name );
    el.appendChild( document.createTextNode( text ) );
    return el;
},
// script onload function to provide support for IE as well
scriptLoader = function( script, func ){

    if (script.onload === undefined) {
        // IE lack of support for script onload

        if( script.onreadystatechange !== undefined ) {

            var intervalFunc = function() {
                if (script.readyState !== "loaded" && script.readyState !== "complete") {
                    window.setTimeout( intervalFunc, 250 );
                } else {
                    // it is loaded
                    func();
                }
            };

            window.setTimeout( intervalFunc, 250 );

        } else {
            log("ERROR: We can't track when script is loaded");
        }

    } else {
        return func;
    }

},
currentPage,
modalBody = document.createElement("div");

window.comingUp = function( options ) {
    options = options || {};

    // default properties
    options.label = options.label || "Coming soon...";
    options.header = options.header || "More high-res ways to engage with your customers";
    
    if (options.pages === undefined ) {
        options.pages = [
			new window.comingUp.Show( options )
        ];
    }

    var button,
    modal,
    currentPage,
    glass = document.createElement("div"),
    returnMethods = {

        // open send feedback modal window
        open: function() {
            var len = options.pages.length;
            currentPage = 0;
            for (; currentPage < len; currentPage++) {
                // create DOM for each page in the wizard
                options.pages[ currentPage ].render();
            }

            var a = element("a", "×"),
            modalHeader = document.createElement("div"),
            // modal container
            modalFooter = document.createElement("div");

            modal = document.createElement("div");
            document.body.appendChild( glass );

            // modal close button
            a.className =  "feedback-close";
            a.onclick = returnMethods.close;
            a.href = "#";

            button.disabled = true;

            // build header element
            modalHeader.appendChild( a );
            modalHeader.appendChild( element("h3", options.header ) );
            modalHeader.className =  "feedback-header";

            modalBody.className = "feedback-body";

            emptyElements( modalBody );
            currentPage = 0;
            modalBody.appendChild( options.pages[ currentPage++ ].dom );

            modalFooter.className = "feedback-footer";
            modal.className =  "feedback-modal";

            modal.appendChild( modalHeader );
            modal.appendChild( modalBody );
            //modal.appendChild( modalFooter );

            document.body.appendChild( modal );
            
            // akshay added: 
            // Call start of page 0 (modified to photo capture page directly now)
            options.pages[ 0 ].start( modal, modalHeader, modalFooter);
        },


        // close modal window
        close: function() {
            button.disabled = false;

            // remove feedback elements
            removeElements( [ modal, glass ] );

            return false;
        },
    };

    glass.className = "feedback-glass";
    glass.style.pointerEvents = "none";

    options = options || {};

    button = element( "button", options.label );
    button.className = "btn btn-inverse btn-small feedback-bottom-right5";

    button.onclick = returnMethods.open;
    
    if ( options.appendTo !== null ) {
        ((options.appendTo !== undefined) ? options.appendTo : document.body).appendChild( button );
    }
    
    return returnMethods;
};
window.comingUp.Page = function() {};
window.comingUp.Page.prototype = {

    render: function( dom ) {
        this.dom = dom;
    },
    start: function() {},
    close: function() {},
    data: function() {
        // don't collect data from page by default
        return false;
    },
    review: function() {
        return null;
    },
    end: function() { return true; }

};


window.comingUp.Show = function( options ) {
    this.options = options || {};

    //this.options.blackoutClass = this.options.blackoutClass || 'feedback-blackedout';
    this.options.highlightClass = this.options.highlightClass || 'feedback-highlighted';

};

window.comingUp.Show.prototype = new window.comingUp.Page();

window.comingUp.Show.prototype.render = function() {    
    this.dom = document.createElement("div");
    return this;
};

window.comingUp.Show.prototype.start = function( modal, modalHeader, modalFooter) {
	this.dom.appendChild( element("p", "Our goal is to provide many ways to funnel customer interaction and engage them in rich ways." +
			" Here are some new things are are excited to work on:") );
    var msg = document.createElement('div');
    msg.className = "well well-small"

    var next = "<dl><dt>Video</dt><dd>Capture video from browsers</dd><dt>Screen Sharing</dt><dd>Customers can share their screen with support teams. Cobrowse!</dd><dt>Mobile</dt><dd>Complete mobile support for all funnel activities</dd></dl>"	
    msg.innerHTML = next;
    this.dom.appendChild(msg);

//    msg = document.createElement('div');
//    msg.className = "well well-small"
//
//    next = "<dl><dt>Video</dt><dd>Capture video from browsers</dd><dt>Screen Sharing</dt><dd>Customers can share their screen with support teams. Cobrowse!</dd><dt>Mobile</dt><dd>Complete mobile support for all funnel activities</dd></dl>"	
//    msg.innerHTML = next;
//    this.dom.appendChild(msg);
};

})( window, document );
