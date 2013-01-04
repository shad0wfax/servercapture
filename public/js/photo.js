/*
 feedback.js <http://experiments.hertzen.com/jsfeedback/>
 Copyright (c) 2012 Niklas von Hertzen. All rights reserved.
 http://www.twitter.com/niklasvh

 Released under MIT License
*/
(function( window, document, undefined ) {
if ( window.snapPhoto !== undefined ) { 
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

window.snapPhoto = function( options ) {
    options = options || {};

    // default properties
    options.label = options.label || "Photo";
    options.header = options.header || "Click a Photo";
    // options.url = options.url || "http://127.0.0.1.xip.io:9000/capture";
    options.url = options.url || "/capture";
    options.adapter = options.adapter || new window.snapPhoto.XHR( options.url );
    
    options.nextLabel = options.nextLabel || "Continue";
    options.reviewLabel = options.reviewLabel || "Review";
    options.sendLabel = options.sendLabel || "Send";
    options.closeLabel = options.closeLabel || "Close";
    
    options.messageSuccess = options.messageSuccess || "Your feedback was sent succesfully.";
    options.messageError = options.messageError || "There was an error sending your feedback to the server.";
    
    options.emailLabel =  options.emailLabel || "Email adress (optional)";
    options.feedbackLabel =  options.feedbackLabel || "Additional comments (optional)";
    options.takeAPictureMsg =  options.takeAPictureMsg || "Clicking on the button will start your webcam and prompt you to grant it permission. You can cancel anytime.";
    options.takeAPictureLabel =  options.takeAPictureLabel || "Click";
    
    if (options.pages === undefined ) {
        options.pages = [
			new window.snapPhoto.Photo( options )
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
            a.className =  "photo-feedback-close";
            a.onclick = returnMethods.close;
            a.href = "#";

            button.disabled = true;

            // build header element
            modalHeader.appendChild( a );
            modalHeader.appendChild( element("h3", options.header ) );
            modalHeader.className =  "photo-feedback-header";

            modalBody.className = "feedback-body";

            emptyElements( modalBody );
            currentPage = 0;
            modalBody.appendChild( options.pages[ currentPage++ ].dom );


            // Next button
            nextButton = element( "button", options.sendLabel );
            
            nextButton.className =  "feedback-btn";
            nextButton.onclick = function() {
            	// Remove the header/footer stuff added
            	modalHeader.removeChild(document.getElementById('vrendezvous-webcammsg'));
            	modalFooter.removeChild(document.getElementById('vrendezvous-clickbtn'));
            	
            	// Just send
            	 returnMethods.send( options.adapter );
            };

            modalFooter.className = "photo-feedback-footer";
            modalFooter.appendChild( nextButton );


            modal.className =  "photo-feedback-modal";


            modal.appendChild( modalHeader );
            modal.appendChild( modalBody );
            modal.appendChild( modalFooter );

            document.body.appendChild( modal );

            // akshay added: 
            // Call start of page 0 (modified to photo capture page directly now)
            options.pages[ 0 ].start( modal, modalHeader, modalFooter, nextButton );
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
            if ( !(adapter instanceof window.snapPhoto.Send) ) {
                throw new Error( "Adapter is not an instance of Feedback.Send" );
            }
            
            // fetch data from all pages   
            for (var i = 0, len = options.pages.length, data = [], p = 0, tmp; i < len; i++) {
                if ( (tmp = options.pages[ i ].data()) !== false ) {
                    data[ p++ ] = tmp;
                }
            }

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
    button.className = "btn btn-primary btn-small feedback-bottom-right2";

    button.onclick = returnMethods.open;
    
    if ( options.appendTo !== null ) {
        ((options.appendTo !== undefined) ? options.appendTo : document.body).appendChild( button );
    }
    
    return returnMethods;
};
window.snapPhoto.Page = function() {};
window.snapPhoto.Page.prototype = {

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
window.snapPhoto.Send = function() {};
window.snapPhoto.Send.prototype = {

    send: function() {}

};

window.snapPhoto.Photo = function( options ) {
    this.options = options || {};

    //this.options.blackoutClass = this.options.blackoutClass || 'feedback-blackedout';
    this.options.highlightClass = this.options.highlightClass || 'feedback-highlighted';

};

window.snapPhoto.Photo.prototype = new window.snapPhoto.Page();

window.snapPhoto.Photo.prototype.end = function( modal ){
    modal.className = modal.className.replace(/feedback\-animate\-toside/, "");

    // remove event listeners
    document.body.removeEventListener("mousemove", this.mouseMoveEvent, false);
    document.body.removeEventListener("click", this.mouseClickEvent, false);
};

window.snapPhoto.Photo.prototype.close = function(){
//    removeElements( [ this.blackoutBox, this.highlightContainer, this.highlightBox, this.highlightClose ] );
	removeElements( [this.highlightContainer, this.highlightClose ] );

    //removeElements( document.getElementsByClassName( this.options.blackoutClass ) );
    removeElements( document.getElementsByClassName( this.options.highlightClass ) );

};

window.snapPhoto.Photo.prototype.start = function( modal, modalHeader, modalFooter, nextButton ) {
        emptyElements( this.dom );
        nextButton.disabled = false;
        
        var $this = this;

        var action = true;
        
        // Akshay test
        cancelbuttonClickFunction = function( e ) {
            e.preventDefault();
            $this.close.apply();
            // TODO: MAKE THIS WORK!
        },

        photobuttonClickFunction = function( e ) {
            e.preventDefault();
            
	      	  var streaming = false,
		      video        = document.getElementById('vrendezvous-video'),
		      canvas       = document.getElementById('vrendezvous-canvas'),
		      photo        = document.getElementById('vrendezvous-photo'),
		      startbutton  = this,
		      width = 480,
		      height = 0;
	
		  navigator.getMedia = ( navigator.getUserMedia || 
		                         navigator.webkitGetUserMedia ||
		                         navigator.mozGetUserMedia ||
		                         navigator.msGetUserMedia);
	
		  navigator.getMedia(
		    { 
		      video: true, 
		      audio: false 
		    },
		    function(stream) {
		      if (navigator.mozGetUserMedia) { 
		        video.mozSrcObject = stream;
		      } else {
		        var vendorURL = window.URL || window.webkitURL;
		        video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
		      }
		      video.play();
		    },
		    function(err) {
		      console.log("An error occured! " + err);
		    }
		  );
	
		  video.addEventListener('canplay', function(ev){
		    if (!streaming) {
		      height = video.videoHeight / (video.videoWidth/width);
		      video.setAttribute('width', width);
		      video.setAttribute('height', height);
		      canvas.setAttribute('width', width);
		      canvas.setAttribute('height', height);
		      streaming = true;
		    }
		  }, false);
	
		  function takepicture() {
		    canvas.width = width;
		    canvas.height = height;
		    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
		    var data = canvas.toDataURL('image/png');
		    photo.setAttribute('src', data);
		  }
	
		  startbutton.addEventListener('click', function(ev){
		      takepicture();
		    ev.preventDefault();
		  }, false);

        };
                
        var photoContainer = document.createElement('div');
        photoContainer.id = "photo-container";
        photoContainer.className = "photo-container";
        this.dom.appendChild( photoContainer );

        var videoElem = document.createElement("video");
        videoElem.id = "vrendezvous-video";
        videoElem.className = "vrendezvous-video";
        
        var canvasElem = document.createElement("canvas");
        canvasElem.id = "vrendezvous-canvas"
        canvasElem.className = "vrendezvous-canvas";
        
        var photoElem = document.createElement("img");
        photoElem.id = "vrendezvous-photo"
        photoElem.className = "vrendezvous-img";
        	
        photoContainer.appendChild(videoElem);
        photoContainer.appendChild(canvasElem);
        photoContainer.appendChild(photoElem);
        
        //var buttonItem = [ photoButton, cancelButton ];
        var photoButton = element("a", this.options.takeAPictureLabel);
//        	cancelButton = element("a", "Cancel");

        var picDiv = document.createElement("div");
//        pivDiv.appendChild( element("span
        
        var webcamMsg = element("span", this.options.takeAPictureMsg)
        webcamMsg.id = "vrendezvous-webcammsg";
        modalHeader.appendChild(webcamMsg);

        // add highlight and blackout buttons
        photoButton.className = 'btn btn-primary btn-small feedback-takeapicture';
        photoButton.href = "#";
        photoButton.id = "vrendezvous-clickbtn";
        photoButton.onclick = photobuttonClickFunction;
        modalFooter.appendChild( photoButton );
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

window.snapPhoto.Photo.prototype.render = function() {    
    this.dom = document.createElement("div");
    return this;
};

window.snapPhoto.Photo.prototype.data = function() {
    if ( this._data !== undefined ) {
        return this._data;
    }

	//return
	var data = {};
    var canvasImg = document.getElementById("vrendezvous-canvas");
    var email = document.getElementById("vrendezvous-email");
    var feedback = document.getElementById("vrendezvous-feedback");

    data["image"] = canvasImg.toDataURL('image/png');
    data["email"] = email.value.length == 0 ? "" : email.value;
    data["comments"] = feedback.value.length == 0 ? "" : feedback.value;

    this._data = data;
	return this._data;
};


window.snapPhoto.XHR = function( url ) {
    
    this.xhr = new XMLHttpRequest();
    this.url = url;

};

window.snapPhoto.XHR.prototype = new window.snapPhoto.Send();

window.snapPhoto.XHR.prototype.send = function( data, callback ) {
    
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
