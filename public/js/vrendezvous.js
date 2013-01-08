

window.vrendezvous = function( options ) {
	//var imported = document.createElement('script');
	// imported.src = 'js/feedback.js';
	// document.getElementsByTagName('head')[0].appendChild(imported);
	
	// Load the css file first
	var url1 = 'css/feedback.css';
//	var url2 = 'css/uidarkness/jquery-ui-1.9.2.custom.min.css'
		
	
	
	if(document.createStyleSheet) {
	    try { document.createStyleSheet(url1); } catch (e) { }
//	    try { document.createStyleSheet(url2); } catch (e) { }
	}
	else {
		createStylesheet(url1);
//		createStylesheet(url2);
	}
	
	// Load the feedback.js
	$.getScript('js/feedback.js', function() {
		// safe way to load another script. A good place to add dependent code
		Feedback({h2cPath:'js/html2canvas.js'});
	});
	
	// Load the photo.js
	$.getScript('js/photo.js', function() {
		// safe way to load another script. A good place to add dependent code
		snapPhoto({});
	});
	
	// Load the speech2text.js.js
	$.getScript('js/speech2text.js', function() {
		// safe way to load another script. A good place to add dependent code
		speech2Text({});
	});
	
	// Load the uidarkness experiment
//	$.getScript('js/uidarkness/jquery-ui-1.9.2.with_minmax_dialog.js', function() {
//		// safe way to load another script. A good place to add dependent code
//		$("#vrendezvous-dialog").dialog({
//			autoOpen: true,
//			minimize: true, 
//			maximize: false, 
//			close: false,
//			height: 140
//		});
//	});
//	
	function createStylesheet(url) {
	    var css;
	    css         = document.createElement('link');
	    css.rel     = 'stylesheet';
	    css.type    = 'text/css';
	    css.media   = "all";
	    css.href    = url;
	    document.getElementsByTagName("head")[0].appendChild(css);
	}
	
}

