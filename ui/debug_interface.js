
function DebugInterface (websocket) {

  this.websocket = websocket;
  this.replyHandler= null;

  // Start the debug interface
  this.start = function() {
  	console.log("DebugInterface.start()");
  }

  // Helper to return the selected thread (may be null)
  this.getThreads = function( onComplete ) {
  	var onmessage = this.websocket.onmessage;
  	var reply = []; 
  	var _this = this;

  	this.websocket.onmessage = function(response) {
  		var data = response.data
  		if (data == "PROMPT") {
  			_this.websocket.onmessage = onmessage;
		  	console.log(reply);
		  	onComplete(reply);
  		} else {
	  		reply.push(data);  			
  		}
  	};

  	this.websocket.send('thread list');
  }

}
