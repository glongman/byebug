$(document).ready(function(){
	log("ready");

	$( "#debugger_dialog" ).dialog( { 
		width: 700, 
		height: 500, 
		position: { my: "left top", at: "left top", of: window } 
	});

	$( "#comms_dialog" ).dialog( {
		height: 200, 
		position: { my: "right bottom", at: "right bottom", of: window } 
	});

	$( "#terminal_dialog" ).dialog( {
		width: 700, 
		height: 200, 
		position: { my: "left bottom", at: "left bottom", of: window } 
	});

});
