
boot_terminal = function(first_msg){
    $('#term_demo').terminal(function(command, term) {
//        if (command !== '') {
            try {
              $term = term
              $socket.send(command)
            } catch(e) {
                term.error(new String(e));
            }
//        } else {
//           term.echo('');
//        }
    }, {
        greetings: first_msg,
        name: 'js_demo',
        height: 500,
        prompt: 'byebug> '});

}

jQuery(function($, undefined) {
});
