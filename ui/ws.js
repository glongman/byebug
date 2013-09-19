var log;
var $term;

log = function(string) {
  var t;
  t = $('#communications').text();
  return $('#communications').text("" + t + "\n" + string);
};

$(function() {
  var socket;
  socket = new WebSocket('ws://0.0.0.0:7654');
  log("opening WebSocket");

  socket.onopen = function(event) {
    log('\n-- connected to server.');
    log("   url:      " + socket.url);
    log("   URL:      " + socket.URL);
    return log("   protocol: " + socket.protocol);
  };

  socket.onclose = function(event) {
    var clean;
    clean = event.wasClean ? 'clean' : 'unclean';
    log("\n-- disconnected from server (" + clean + ").");
    log("   code:   " + event.code);
    return log("   reason: " + event.reason);
  };

  socket.onerror = function(error) {
    return log("ERROR: " + error);
  };

  __message = ""
  socket.onmessage = function(message) {
    message = message.data
    if(undefined !== $term) {
      if('PROMPT' == message){
        $term.echo(__message);
        __message = "";
      }else{
        __message += message
      }
    }else {
      if('PROMPT' == message){
        boot_terminal(__message)
        __message = "";
      }else{
        __message += message
        console.log(message)
      }
    }
    $socket = socket
//    return log("\nmessage: '" + message.data + "'");
  };
//  window.onbeforeunload = function() {
//    alert('closing');
//    socket.close();
//  }


$('#send').click((function(socket) {
    return function() {
      var exception;
      if (socket.readyState === WebSocket.CONNECTING) {
        return log("\nStill connecting.");
      } else if (socket.readyState === WebSocket.CLOSING) {
        return log("\nConnection is closing.");
      } else if (socket.readyState === WebSocket.CLOSED) {
        return log("\nConnection is closed.");
      } else if (socket.readyState === WebSocket.OPEN) {
        try {
          return socket.send($('#message').val());
        } catch (_error) {
          exception = _error;
          return log("\nEXCEPTION: " + exception);
        }
      }
    };
  })(socket));

  return $('#close').click((function(socket) {
    return function() {
      return socket.close();
    };
  })(socket));
});
