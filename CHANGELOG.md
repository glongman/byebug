# 2.1.1

* Fix bug when debugging code inside '-e' flag


# 2.1.0

* Fix bug in remote debugging display
* Fix bug where eval would crash when inspect raised an exception (reported by
@iblue)
* `enable breakpoints` now enables every breakpoint
* `disable breakpoints` now disables every breakpoint


# 2.0.0

* Various bug fixes
* "Official" definition of a command API
* Thread support


## 1.8.2

* More user friendly regexps for commands
* Better help for some commands
* `save` command now saves the list of "displays"
* Fixes bug in calculating stacksize


## 1.8.1

* Bugfix release


## 1.8.0

* Remote debugging support


## 1.7.0

* Callstack display: specifically mark c-frames
* Callstack navigation: skip c-frames
* Callstack navigation: autolist after navigation commands


## 1.6.1

* Windows compatibiliy: compilation and terminal width issues


## 1.6.0

* `byebug` placed at the end of a block or method call now works as expected
* Don't autolist when ruby '-e' option is used
* Fixes callstyles. From now on, use 'long' for detailed frames in callstack and
'short' for more concise frames


## 1.5.0

* No more Byebug.start to get correct callstack information! Dropping `byebug`
anywhere and inmediately printing the stack just works now. :)

 
## 1.4.2

* Fixes crash when using "help command subcommand"
* Byebug now works with Rails Console debugging flag
* Fix post-mortem mode when running byebug from the outset
* Fix --no-quit flag when running byebug from the outset


## 1.4.1

* Fixes crash when printing some filenames in backtraces
* Allows byebug developers to easily use compilers different from gcc (thanks
@GarthSnyder!)


## 1.4.0

* Byebug now uses the Debug Inspector API: faster and nicer!
* Fixes bug that prevents some random crashes


## 1.3.1

* Byebug now works with Rails debugging flag
* Fix bug which would make byebug crash when trying to print lines of code
containing the character '%'
* Fix bug which prevented basename and linetrace options from working together


## 1.3.0

* Support colon-delimited include paths in command-line front-end (@ender672)


## 1.2.0

* Added 'pry' command.
* Ctrl+C during command line editing is handled and works like pry/irb


## 1.1.1

* Better help system
* Code cleanup
* First version compatible with pry-byebug


## 1.1.0

* Post-mortem support


## 1.0.3

* "autoreload" is set by default now
* "list" command: no negative line numbers shown, and line range behaves as
expected at the begining/end of file
* In some weird cases, "backtrace" command segfaults when trying to show info on
some frame args. Don't know the reason yet, but the exception is handled now and
and the command doesn't segfault anymore.
* Try some thread support (not even close to usable)


## 1.0.2

* "autolist" and "autoeval" are default settings now
* Fixes bug which messed up the call-stack when manipulating backtrace
information and when nexting/stepping


## 1.0.1

* Corrected small bug preventing byebug from loading


## 1.0.0

* Green test suite


## 0.0.1

* Initial release
