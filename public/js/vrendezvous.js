

window.vrendezvous = function( options ) {
	//var imported = document.createElement('script');
	// imported.src = 'js/feedback.js';
	// document.getElementsByTagName('head')[0].appendChild(imported);
	
	// Load the css file first
	var url = 'css/feedback.css'
	if(document.createStyleSheet) {
	    try { document.createStyleSheet(url); } catch (e) { }
	}
	else {
	    var css;
	    css         = document.createElement('link');
	    css.rel     = 'stylesheet';
	    css.type    = 'text/css';
	    css.media   = "all";
	    css.href    = url;
	    document.getElementsByTagName("head")[0].appendChild(css);
	}
	
	// Load the feedback.js
	$.getScript('js/feedback.js', function() {
		// safe way to load another script. A good place to add dependent code
		Feedback({h2cPath:'js/html2canvas.js'});
	});
	
	// Load the feedback.js
	$.getScript('js/photo.js', function() {
		// safe way to load another script. A good place to add dependent code
		snapPhoto({h2cPath:'js/html2canvas.js'});
	});
	
}

