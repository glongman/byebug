require 'byebug'

p Byebug::VERSION

Byebug.wait_connection = true
Byebug.start_websocket_server

class Fixnum
  def fibonacci
    if (self < 3)  then
#      byebug
      return 1
    else
      (self - 1).fibonacci + (self - 2).fibonacci
    end
  end
end

byebug
12.fibonacci
