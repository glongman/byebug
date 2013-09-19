
boot_terminal = function(first_msg){
    $('#term_demo').terminal(function(command, term) {
        if (command !== '') {
            try {
              $term = term
              $socket.send(command)
              //                var result = window.eval(command);

//                if (result !== undefined) {
                    term.echo(new String(command));
//                }
            } catch(e) {
                term.error(new String(e));
            }
        } else {
           term.echo('');
        }
    }, {
        greetings: first_msg,
        name: 'js_demo',
        height: 200,
        prompt: 'byebug> '});

}

jQuery(function($, undefined) {
});
