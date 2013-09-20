require 'socket'

module Byebug

  # Port number used for remote debugging
  PORT = 8989 unless defined?(PORT)

  class << self

    # If in remote mode, wait for the remote connection
    attr_accessor :wait_connection

    def start_websocket_server(host = nil, port = 7654)
      return if @thread

      self.interface = nil
      start
      mutex = Mutex.new
      proceed = ConditionVariable.new

      p "starting websocket server on #{port}"
      server = TCPServer.new(host, port)
      @thread = DebugThread.new do
        while (session = server.accept)
          begin
            self.interface = interface = WebsocketRemoteInterface.new(session)

            mutex.synchronize do
              proceed.signal
            end
            interface.loop_data
          rescue Exception => e
            p "Error on DebugThread"
            p e.class
            p "#{$!}"
          end
        end
      end

      Thread.new do
        sleep(0.3)
        system "open ./ui/debugger.html"
      end

      mutex.synchronize do
        proceed.wait(mutex)
      end
    end

    #
    # Starts a remote byebug
    #
    def start_server(host = nil, port = PORT)
      return if @thread

      self.interface = nil
      start

      if port.kind_of?(Array)
        cmd_port, ctrl_port = port
      else
        cmd_port, ctrl_port = port, port + 1
      end

      ctrl_port = start_control(host, ctrl_port)

      yield if block_given?

      mutex = Mutex.new
      proceed = ConditionVariable.new

      server = TCPServer.new(host, cmd_port)
      @cmd_port = cmd_port = server.addr[1]
      @thread = DebugThread.new do
        while (session = server.accept)
          self.interface = RemoteInterface.new(session)
          if wait_connection
            mutex.synchronize do
              proceed.signal
            end
          end
        end
      end
      if wait_connection
        mutex.synchronize do
          proceed.wait(mutex)
        end
      end
    end

    def start_control(host = nil, ctrl_port = PORT + 1)
      return @ctrl_port if @control_thread
      server = TCPServer.new(host, ctrl_port)
      @ctrl_port = server.addr[1]
      @control_thread = Thread.new do
        while (session = server.accept)
          interface = RemoteInterface.new(session)
          ControlCommandProcessor.new(interface).process_commands
          processor.process_commands
        end
      end
      @ctrl_port
    end

    #
    # Connects to the remote byebug
    #
    def start_client(host = 'localhost', port = PORT)
      interface = Byebug::LocalInterface.new
      socket = TCPSocket.new(host, port)
      puts "Connected."

      catch(:exit) do
        while (line = socket.gets)
          case line
          when /^PROMPT (.*)$/
            input = interface.read_command($1)
            throw :exit unless input
            socket.puts input
          when /^CONFIRM (.*)$/
            input = interface.confirm($1)
            throw :exit unless input
            socket.puts input
          else
            print line
          end
        end
      end
      socket.close
    end
  end
end
