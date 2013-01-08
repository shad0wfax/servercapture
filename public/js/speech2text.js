/*
 feedback.js <http://experiments.hertzen.com/jsfeedback/>
 Copyright (c) 2012 Niklas von Hertzen. All rights reserved.
 http://www.twitter.com/niklasvh

 Released under MIT License
*/
(function( window, document, undefined ) {
if ( window.speech2Text !== undefined ) { 
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
nextButton,
currentPage,
modalBody = document.createElement("div");

window.speech2Text = function( options ) {
    options = options || {};

    // default properties
    options.label = options.label || "Speech2Text";
    options.header = options.header || "Speak to translate (uses Google Speech API)";
    options.url = options.url || "/s2t";
    options.adapter = options.adapter || new window.speech2Text.XHR( options.url );
    
    options.sendLabel = options.sendLabel || "Send";
    options.closeLabel = options.closeLabel || "Close";
    
    options.messageSuccess = options.messageSuccess || "Your feedback was sent succesfully.";
    options.messageError = options.messageError || "There was an error sending your feedback to the server.";
    
    options.emailLabel =  options.emailLabel || "Email adress (optional)";
    options.feedbackLabel =  options.feedbackLabel || "Additional comments (optional)";
    options.speakMsg1 =  options.speakMsg1 || "<1>Click on Start to enable microphone. You will see a microphone button once started. For best results use a headset.";
    options.speakMsg2 =  options.speakMsg2 || "<2>Click on the microphone button to start speaking. Click on Stop to terminate recording anytime.";
    options.takeAPictureLabel =  options.takeAPictureLabel || "Click";
    options.speakOnLabel =  options.speakOnLabel || "Start";
    options.speakOffLabel =  options.speakOffLabel || "Stop";
    options.speakPlaceholder =  options.speakPlaceholder || "The speech converted to text will be placed here. You can edit it before sending the text.";
    
    if (options.pages === undefined ) {
        options.pages = [
			new window.speech2Text.Photo( options )
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


            // Next button
            nextButton = element( "button", options.sendLabel );
            
            nextButton.className =  "feedback-btn";
            nextButton.onclick = function() {
            	// Remove the header/footer stuff added
            	modalHeader.removeChild(document.getElementById('vrendezvous-speechmsg1'));
            	modalHeader.removeChild(document.getElementById('vrendezvous-speechmsg2'));
            	modalFooter.removeChild(document.getElementById('vrendezvous-clickbtn'));
            	
            	// Just send
            	 returnMethods.send( options.adapter );
            };

            modalFooter.className = "feedback-footer";
            modalFooter.appendChild( nextButton );


            modal.className =  "feedback-modal";


            modal.appendChild( modalHeader );
            modal.appendChild( modalBody );
            modal.appendChild( modalFooter );

            document.body.appendChild( modal );

            // akshay added: 
            // Call start of page 0 (modified to photo capture page directly now)
            options.pages[ 0 ].start( modal, modalHeader, modalFooter, nextButton);
        },


        // close modal window
        close: function() {
            button.disabled = false;

            // remove feedback elements
            removeElements( [ modal, glass ] );

            // call end event for current page
            if (currentPage > 0 ) {
                options.pages[ currentPage - 1 ].end( modal );
            }
                
            // call close events for all pages    
            for (var i = 0, len = options.pages.length; i < len; i++) {
                options.pages[ i ].close();
            }

            return false;

        },
        
        // send data
        send: function( adapter ) {
            // make sure send adapter is of right prototype
            if ( !(adapter instanceof window.speech2Text.Send) ) {
                throw new Error( "Adapter is not an instance of Feedback.Send" );
            }
            
            // fetch data from all pages   
            for (var i = 0, len = options.pages.length, data = [], p = 0, tmp; i < len; i++) {
                if ( (tmp = options.pages[ i ].data()) !== false ) {
                    data[ p++ ] = tmp;
                }
            }
            // Add a reference element to indicate which capture:
            var ref = {}
            ref["ref"] = "web#speech2text"
            data[data.length] = ref;

            nextButton.disabled = true;
                
            emptyElements( modalBody );
            modalBody.appendChild( loader() );

            // send data to adapter for processing
            adapter.send( data, function( success ) {
                
                emptyElements( modalBody );
                nextButton.disabled = false;
                
                nextButton.firstChild.nodeValue = options.closeLabel;
                
                nextButton.onclick = function() {
                    returnMethods.close();
                    return false;  
                };
                
                if ( success === true ) {
                    modalBody.appendChild( document.createTextNode( options.messageSuccess ) );
                } else {
                    modalBody.appendChild( document.createTextNode( options.messageError ) );
                }
                
            } );
  
        }
    };

    glass.className = "feedback-glass";
    glass.style.pointerEvents = "none";

    options = options || {};

    button = element( "button", options.label );
    button.className = "btn btn-info btn-small feedback-bottom-right3";

    button.onclick = returnMethods.open;
    
    if ( options.appendTo !== null ) {
        ((options.appendTo !== undefined) ? options.appendTo : document.body).appendChild( button );
    }
    
    return returnMethods;
};
window.speech2Text.Page = function() {};
window.speech2Text.Page.prototype = {

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
window.speech2Text.Send = function() {};
window.speech2Text.Send.prototype = {

    send: function() {}

};

window.speech2Text.Photo = function( options ) {
    this.options = options || {};

    //this.options.blackoutClass = this.options.blackoutClass || 'feedback-blackedout';
    this.options.highlightClass = this.options.highlightClass || 'feedback-highlighted';

};

window.speech2Text.Photo.prototype = new window.speech2Text.Page();

window.speech2Text.Photo.prototype.end = function( modal ){
    modal.className = modal.className.replace(/feedback\-animate\-toside/, "");

    // remove event listeners
    document.body.removeEventListener("mousemove", this.mouseMoveEvent, false);
    document.body.removeEventListener("click", this.mouseClickEvent, false);
};

window.speech2Text.Photo.prototype.close = function(){
//    removeElements( [ this.blackoutBox, this.highlightContainer, this.highlightBox, this.highlightClose ] );
	removeElements( [this.highlightContainer, this.highlightClose ] );

    //removeElements( document.getElementsByClassName( this.options.blackoutClass ) );
    removeElements( document.getElementsByClassName( this.options.highlightClass ) );

};

window.speech2Text.Photo.prototype.start = function( modal, modalHeader, modalFooter, nextButton) {
        emptyElements( this.dom );
        nextButton.disabled = false;
        
        var $this = this;

        var action = true;
        var speakOn = false;
        var speakOnLabel = this.options.speakOnLabel;
        var	speakOffLabel = this.options.speakOffLabel;
        
        startButtonClickFunction = function(e) {
            e.preventDefault();
            var mic = document.getElementById("vrendezvous-mic");
            
            if (speakOn == true) {
            	mic.style.visibility = "hidden";
            	mic.style.display = "none";
            	speakOn = false;
            	speakOnButton.firstChild.nodeValue = speakOnLabel;
            	return;
            }
            speakOn = true;
            mic.style.visibility = "visible";
            mic.style.display = "block";
            speakOnButton.firstChild.nodeValue = speakOffLabel;
        };
        
        speech2textTranscibe = function(content) {
        	document.getElementById("vrendezvous-speech2text").value += (content + "\n");
        	document.getElementById("vrendezvous-mic").value = "";
        	document.getElementById("vrendezvous-speech2text").focus();
        }
                
        var s2tContainer = document.createElement('div');
        s2tContainer.id = "photo-container";
        //s2tContainer.className = "photo-container";
        this.dom.appendChild( s2tContainer );

        var speech2textElem = document.createElement("textarea");
        speech2textElem.id = "vrendezvous-speech2text";
        speech2textElem.className = "vrendezvous-feedback";
        speech2textElem.placeholder = this.options.speakPlaceholder;
        
        var mic = document.createElement("input");
        mic.id = "vrendezvous-mic";
        mic.size = "0";
        mic.style.border = "0";
        mic.style.visibility = "hidden";
        mic.style.display = "none";
        mic.setAttribute('onwebkitspeechchange', 'speech2textTranscibe(this.value)');
        mic.setAttribute('x-webkit-speech', '');
        mic.className = 'feedback-speechbox';
        
        s2tContainer.appendChild(speech2textElem);
        s2tContainer.appendChild(mic);

        modalHeader.appendChild(element("br"));
        var msg = element("span", this.options.speakMsg1)
        msg.id = "vrendezvous-speechmsg1";
        modalHeader.appendChild(msg);
        modalHeader.appendChild(element("br"));
        msg = element("span", this.options.speakMsg2)
        msg.id = "vrendezvous-speechmsg2";
        modalHeader.appendChild(msg);

        // add highlight and blackout buttons
        var speakOnButton = element("a", this.options.speakOnLabel);
        speakOnButton.className = 'btn btn-primary btn-small feedback-speechbtn';
        speakOnButton.href = "#";
        speakOnButton.id = "vrendezvous-clickbtn";
        speakOnButton.onclick = startButtonClickFunction;
        modalFooter.appendChild( speakOnButton );
        modalFooter.appendChild( document.createTextNode(" ") );

        var emailContainer = document.createElement('div');
        emailContainer.id = "email-container";
        emailContainer.className = "email-comment-for-photo";
        this.dom.appendChild( emailContainer );
   
        var email = document.createElement("input");
        var feedback = document.createElement("textarea");
        email.id = "vrendezvous-email";
        feedback.id = "vrendezvous-feedback";
        email.type = "text";
        email.placeholder = this.options.emailLabel;
        feedback.placeholder = this.options.feedbackLabel;
        
        emailContainer.appendChild(email);
        emailContainer.appendChild(feedback);

};

window.speech2Text.Photo.prototype.render = function() {    
    this.dom = document.createElement("div");
    return this;
};

window.speech2Text.Photo.prototype.data = function() {
    if ( this._data !== undefined ) {
        return this._data;
    }

	//return
	var data = {};
    var s2t = document.getElementById("vrendezvous-speech2text");
    var email = document.getElementById("vrendezvous-email");
    var feedback = document.getElementById("vrendezvous-feedback");

    data["speech2text"] = s2t.value.length == 0 ? "" : s2t.value;
    data["email"] = email.value.length == 0 ? "" : email.value;
    data["comments"] = feedback.value.length == 0 ? "" : feedback.value;

    this._data = data;
	return this._data;
};


window.speech2Text.XHR = function( url ) {
    
    this.xhr = new XMLHttpRequest();
    this.url = url;

};

window.speech2Text.XHR.prototype = new window.speech2Text.Send();

window.speech2Text.XHR.prototype.send = function( data, callback ) {
    
    var xhr = this.xhr;
    
    xhr.onreadystatechange = function() {
        if( xhr.readyState == 4 ){
            callback( (xhr.status === 200) );
        }
    };
    xhr.open( "POST", this.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var dataToSend = encodeURIComponent( window.JSON.stringify(data));
    xhr.send( "data=" + dataToSend);
};





})( window, document );
