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

      Thread.new { handle }
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
        p "connected"
        @driver.start
      end

      @driver.on(:message) do |e|
        p "on message #{e.data}"
        @response = e.data
        signal
#        @driver.text e.data
      end

      @driver.on(:close) do
        puts "Connection with #{socket.addr[2]} closed."
      end

      loop do
        IO.select([@socket], [], [], 30) or raise Errno::EWOULDBLOCK
        data = @socket.recv(1024)
        if data.empty?
          p "empty data!!!"
          break
        end
        @driver.parse data
      end
      @response = nil
      signal
    end

    def close
      @socket.close
    rescue Exception
    end

    def confirm(prompt)
      send_command "CONFIRM #{prompt}"
    end

    def finalize
    end

    def read_command(prompt)
      send_command "PROMPT"
    end

    def readline_support?
      false
    end

    def print(*args)
      message = escape(format(*args))
      @driver.text(message)
    end

    private

    def send_command(msg)
      @driver.text msg
      wait
      @response ? @response : ""
    end
  end
end
