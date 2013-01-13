/*
 * Based on -
 feedback.js <http://experiments.hertzen.com/jsfeedback/>
 Copyright (c) 2012 Niklas von Hertzen. All rights reserved.
 http://www.twitter.com/niklasvh

 Released under MIT License
*/
(function( window, document, undefined ) {
if ( window.audio !== undefined ) { 
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

window.audio = function( options ) {
    options = options || {};

    // default properties
    options.label = options.label || "Audio";
    options.header = options.header || "Send audio clipping (requires flash)";
    options.url = options.url || "/captureflaudio";
    options.adapter = options.adapter || new window.audio.XHR( options.url );
    
    options.sendLabel = options.sendLabel || "Send";
    options.closeLabel = options.closeLabel || "Close";
    
    options.messageSuccess = options.messageSuccess || "Your feedback was sent succesfully.";
    options.messageError = options.messageError || "There was an error sending your feedback to the server.";
    
    options.emailLabel =  options.emailLabel || "Email adress (optional)";
    options.feedbackLabel =  options.feedbackLabel || "Additional comments (optional)";
    options.speakMsg1 =  options.speakMsg1 || "1. Click on Enable Mic to start the microphone. Accept the Flash security warning and close it.";
    options.speakMsg2 =  options.speakMsg2 || "2. Click on the Record button to start your recording. Click on Stop to end the recording anytime.";
    options.turnMicOn =  options.turnMicOn || "Enable Mic";
    options.speakOnLabel =  options.speakOnLabel || "Record";
    options.speakOffLabel =  options.speakOffLabel || "Stop";
    options.recordedMsgLabel =  options.recordedMsgLabel || "Your Audio has been recorded. You can now send it to the server.";
    
    if (options.pages === undefined ) {
        options.pages = [
			new window.audio.Photo( options )
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
            if ( !(adapter instanceof window.audio.Send) ) {
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
            ref["ref"] = "web#audioflash"
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
    button.className = "btn btn-warning btn-small feedback-bottom-right4";

    button.onclick = returnMethods.open;
    
    if ( options.appendTo !== null ) {
        ((options.appendTo !== undefined) ? options.appendTo : document.body).appendChild( button );
    }
    
    return returnMethods;
};
window.audio.Page = function() {};
window.audio.Page.prototype = {

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
window.audio.Send = function() {};
window.audio.Send.prototype = {

    send: function() {}

};

window.audio.Photo = function( options ) {
    this.options = options || {};

    //this.options.blackoutClass = this.options.blackoutClass || 'feedback-blackedout';
    this.options.highlightClass = this.options.highlightClass || 'feedback-highlighted';

};

window.audio.Photo.prototype = new window.audio.Page();

window.audio.Photo.prototype.end = function( modal ){
    modal.className = modal.className.replace(/feedback\-animate\-toside/, "");

    // remove event listeners
    document.body.removeEventListener("mousemove", this.mouseMoveEvent, false);
    document.body.removeEventListener("click", this.mouseClickEvent, false);
};

window.audio.Photo.prototype.close = function(){
//    removeElements( [ this.blackoutBox, this.highlightContainer, this.highlightBox, this.highlightClose ] );
	removeElements( [this.highlightContainer, this.highlightClose ] );

    //removeElements( document.getElementsByClassName( this.options.blackoutClass ) );
    removeElements( document.getElementsByClassName( this.options.highlightClass ) );

};

window.audio.Photo.prototype.start = function( modal, modalHeader, modalFooter, nextButton) {
        emptyElements( this.dom );
        nextButton.disabled = false;
        
        var $this = this;

        var micon = false;
        var speakOn = false;
        var speakOnLabel = this.options.speakOnLabel;
        var	speakOffLabel = this.options.speakOffLabel;
        
        var anim = document.createElement('div');
        anim.id = "vrendezvous-audio-anim";
        anim.style.visibility = "hidden";
        
        var recmsg = document.createElement('div');
        recmsg.id = "vrendezvous-rec-msg";
        recmsg.style.visibility = "hidden";
        
        var audioRec = document.createElement('audio');
        audioRec.id = "vrendezvous-audio-rec";
        audioRec.controls = "controls";
        var audioSrc = document.createElement('source');
        audioSrc.src = "";
        audioRec.appendChild(audioSrc);
        
        recmsg.appendChild(element("span", this.options.recordedMsgLabel))
        recmsg.appendChild(audioRec);
        		
        startButtonClickFunction = function(e) {
            e.preventDefault();
            
            // First time - enable mic - will popup that flash warning
            if (micon == false) {
            	micon = true;
            	
            	try {
                	Wami.setup("vrendezvous-wami");
            	} catch( e ) {
                    log("Error in setting up wami: " + e.message);
                }

                speakOnButton.firstChild.nodeValue = speakOnLabel;
                document.getElementById("vrendezvous-wami").appendChild(anim).appendChild( loader() );
                document.getElementById("vrendezvous-wami").appendChild(recmsg);
            	return;
            }
            
            if (speakOn == true) {
            	speakOn = false;
            	speakOnButton.firstChild.nodeValue = speakOnLabel;

            	var base64Aud = "";
            	try {
            		//Wami.stopPlaying();
            		base64Aud = Wami.stopRecordingAndGetAsBase64().replace(/(\r\n|\n|\r)/gm,"");
            	} catch( e ) {
                    log("Error in wami stopping. Perhaps mic wasn't allowed: " + e.message);
                }
        		document.getElementById("vrendezvous-audio-anim").style.visibility = "hidden";
        		document.getElementById("vrendezvous-audio-anim").style.display = "none";
        		document.getElementById("vrendezvous-rec-msg").style.visibility = "visible";
        		
        		console.log(base64Aud);
//        		document.getElementById("vrendezvous-audio-rec").firstChild.src = base64Aud;
                var audioSrc = document.createElement('source');
                audioSrc.src = base64Aud;
                document.getElementById("vrendezvous-audio-rec").appendChild(audioSrc);

        		
            	return;
            }
        	try {
                Wami.startRecording("/captureflaudio");
        	} catch( e ) {
                log("Error in starting wami. Perhaps mic wasn't allowed: " + e.message);
            }
            speakOn = true;
            speakOnButton.firstChild.nodeValue = speakOffLabel;
            document.getElementById("vrendezvous-audio-anim").style.visibility = "visible";
            document.getElementById("vrendezvous-audio-anim").style.display = "";
            document.getElementById("vrendezvous-rec-msg").style.visibility = "hidden";
            document.getElementById("vrendezvous-audio-rec").removeChild(
            		document.getElementById("vrendezvous-audio-rec").firstChild);
        };
        
        var s2tContainer = document.createElement('div');
        s2tContainer.id = "photo-container";
        //s2tContainer.className = "photo-container";
        this.dom.appendChild( s2tContainer );

        var wamiElem = document.createElement('div');
        wamiElem.id = "vrendezvous-wami";
        wamiElem.className = "vrendezvous-wami";
        
        s2tContainer.appendChild(wamiElem);

        modalHeader.appendChild(element("br"));
        var msg = element("span", this.options.speakMsg1)
        msg.id = "vrendezvous-speechmsg1";
        modalHeader.appendChild(msg);
        modalHeader.appendChild(element("br"));
        msg = element("span", this.options.speakMsg2)
        msg.id = "vrendezvous-speechmsg2";
        modalHeader.appendChild(msg);

        // add highlight and blackout buttons
        var speakOnButton = element("a", this.options.turnMicOn);
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

window.audio.Photo.prototype.render = function() {    
    this.dom = document.createElement("div");
    return this;
};

window.audio.Photo.prototype.data = function() {
    if ( this._data !== undefined ) {
        return this._data;
    }

	//return
	var data = {};
    var s2t = document.getElementById("vrendezvous-audio-rec").firstChild
    var email = document.getElementById("vrendezvous-email");
    var feedback = document.getElementById("vrendezvous-feedback");

    data["audiob64"] = s2t.src.length == 0 ? "" : s2t.src;
    data["email"] = email.value.length == 0 ? "" : email.value;
    data["comments"] = feedback.value.length == 0 ? "" : feedback.value;

    this._data = data;
	return this._data;
};


window.audio.XHR = function( url ) {
    
    this.xhr = new XMLHttpRequest();
    this.url = url;

};

window.audio.XHR.prototype = new window.audio.Send();

window.audio.XHR.prototype.send = function( data, callback ) {
	
	alert("data = " + data)
    
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
