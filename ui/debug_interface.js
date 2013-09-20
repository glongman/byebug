
function DebugInterface (websocket) {

  this.websocket = websocket;
  this.replyHandler= null;

  // Start the debug interface
  this.start = function() {
  	console.log("DebugInterface.start()");
  }

  //
  this.genericCommand = function( command, onComplete ) {
  	var onmessage = this.websocket.onmessage;
  	var reply = [];
  	var _this = this;

  	this.websocket.onmessage = function(response) {
  		var data = response.data
  		if (data == "PROMPT") {
  			_this.websocket.onmessage = onmessage;
		    console.log(command);
		  	console.log(reply);
		  	onComplete(reply);
  		} else {
	  		reply.push(data);
  		}
  	};

  	this.websocket.send(command);
  }

  // Helper to get the threads list
  this.getThreads = function( onComplete ) {
      this.genericCommand('thread list', onComplete);
  }

  // Helper to get the stack frames list
  this.getFrames = function( onComplete ) {
      this.genericCommand('bt', onComplete);
  }

  this.getVariables = function (onComplete) {
      this.genericCommand('info variables', onComplete);
  }
  // Helper to set the current stack frame
  this.selectFrame = function( frameNumber, onComplete ) {
  	this.genericCommand('frame ' + frameNumber, onComplete);
  }

  // Helper to set the current stack frame
  this.getSource = function( onComplete ) {
  	this.genericCommand('list', onComplete);
  }

}
