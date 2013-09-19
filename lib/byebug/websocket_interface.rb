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

      @driver = ::WebSocket::Driver.server(socket)

      Thread.new { handle }
    end

    def handle
      @driver.on(:connect) do
        p "connected"
        @driver.start
      end

      @driver.on(:message) do |e|
        p "on message"
        @driver.text e.data
      end

      @driver.on(:close)   { puts "Connection with #{socket.addr[2]} closed." }
      loop do
        IO.select([@socket], [], [], 30) or raise Errno::EWOULDBLOCK
        data = @socket.recv(1024)
        break if data.empty?
        @driver.parse data
      end
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
      send_command "PROMPT #{prompt}"
    end

    def readline_support?
      false
    end

    def print(*args)
      @driver.text escape(format(*args))
    end

    private

    def send_command(msg)
      @driver.text msg
      @mutex.synchronize do
        @proceed.wait(@mutex)
      end
    end
  end
end
