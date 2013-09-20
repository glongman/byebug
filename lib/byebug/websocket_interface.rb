require 'websocket/driver'

module Byebug

  class WebsocketRemoteInterface < Interface
    attr_accessor :command_queue, :history_length, :history_save, :histfile
    attr_accessor :restart_file

    def initialize(socket)
      @command_queue = []
      @socket = socket
      @history_save = false
      @history_length = 256
      #      @histfile = ''
      @mutex = Mutex.new
      @proceed = ConditionVariable.new

      @restart_file = nil

      @response = nil
      @driver = ::WebSocket::Driver.server(socket)

      handle
    end

    def signal
      @mutex.synchronize do
        @proceed.signal
      end
    end

    def wait
      @mutex.synchronize do
        @proceed.wait(@mutex)
      end
    end

    def handle
      @driver.on(:connect) do
#        p "connected"
        @driver.start
      end

      @driver.on(:message) do |e|
        p "on message #{e.data}"
        @response = e.data
        signal
#        @driver.text e.data
      end

      @driver.on(:close) do
        puts "Connection closed."
      end

      @driver.on(:open) do
        p "on open"
      end

      @driver.on(:error) do
        p "ERROR SOCKET"
      end

      handle_data
    end

    def handle_data
      IO.select([@socket], [], []) or raise Errno::EWOULDBLOCK
      data = @socket.recv(2048)
#      p "data #{data}"
      if data.empty?
        p "empty data!!!"
        return false
      end
      @driver.parse data
      true
    end

    def loop_data
      while(handle_data); end
    ensure
      @response = nil
      signal
    end

    def close
      puts 'CLOSE'
      @socket.close
    rescue Exception
    end

    def confirm(prompt)
      send_command "CONFIRM #{prompt}"
    end

    def finalize
    end

    def read_command(prompt, last_cmd = nil)
      send_command "PROMPT"
    end

    def readline_support?
      false
    end

    def print(*args)
      message = escape(format(*args))
#      p "message: #{message} "
      @driver.text(message)
    end

    private

    def send_command(msg)
      @driver.text msg
      wait
      @response
    end
  end
end
