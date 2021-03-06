require 'pp'

module Byebug
  module EvalFunctions
    def run_with_binding
      binding = get_binding
      yield binding
    end
  end

  class EvalCommand < Command
    self.allow_in_control = true

    register_setting_get(:autoeval) do
      EvalCommand.unknown
    end
    register_setting_set(:autoeval) do |value|
      EvalCommand.unknown = value
    end

    # Set default value
    Command.settings[:autoeval] = true

    def match(input)
      @input = input
      super
    end

    def regexp
      /^\s* (p|e(?:val)?)\s+/x
    end

    def execute
      expr = @match ? @match.post_match : @input
      run_with_binding do |b|
        print "#{debug_eval(expr, b).inspect}\n"
      end
    rescue
      print "#{$!.class} Exception: #{$!.message}\n"
    end

    class << self
      def names
        %w(p eval)
      end

      def description
        %{(p|e[val]) expression

          Evaluate expression and print its value
          * NOTE - unknown input is automatically evaluated, to turn this off
          use 'set noautoeval'}
      end
    end
  end

  class PPCommand < Command
    self.allow_in_control = true

    def regexp
      /^\s* pp \s+/x
    end

    def execute
      out = StringIO.new
      run_with_binding do |b|
        PP.pp(debug_eval(@match.post_match, b), out)
      end
      print out.string
    rescue
      out.puts $!.message
    end

    class << self
      def names
        %w(pp)
      end

      def description
        %{pp expression\tevaluate expression and pretty-print its value}
      end
    end
  end

  class PutLCommand < Command
    include Columnize
    self.allow_in_control = true

    def regexp
      /^\s* putl\s+/x
    end

    def execute
      out = StringIO.new
      run_with_binding do |b|
        vals = debug_eval(@match.post_match, b)
        if vals.is_a?(Array)
          vals = vals.map{|item| item.to_s}
          print "#{columnize(vals, Command.settings[:width])}\n"
        else
          PP.pp(vals, out)
          print out.string
        end
      end
    rescue
      out.puts $!.message
    end

    class << self
      def names
        %w(putl)
      end

      def description
        %{putl expression

          Evaluate expression, an array, and columnize its value}
      end
    end
  end

  class PSCommand < Command
    include Columnize
    self.allow_in_control = true

    def regexp
      /^\s* ps\s+/x
    end

    def execute
      out = StringIO.new
      run_with_binding do |b|
        vals = debug_eval(@match.post_match, b)
        if vals.is_a?(Array)
          vals = vals.map{|item| item.to_s}
          print "#{columnize(vals.sort!, Command.settings[:width])}\n"
        else
          PP.pp(vals, out)
          print out.string
        end
      end
    rescue
      out.puts $!.message
    end

    class << self
      def names
        %w(ps)
      end

      def description
        %{ps expression

          Evaluate expression, an array, sort and columnize its value}
      end
    end
  end

end
