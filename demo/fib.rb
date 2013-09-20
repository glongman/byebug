require 'byebug'

p Byebug::VERSION
Byebug.start_websocket_server(browser: true)

class Fixnum

  def fibonacci
    if (self < 3)
      return 1
    else
      abc = "arthurnn"
      c = Class.new do
        def foo
          @in = 1
          @out = 111
        end
      end
      c.new.foo

      (self - 1).fibonacci + (self - 2).fibonacci
    end
  end
end

byebug
12.fibonacci
