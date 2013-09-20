module Byebug

  class UnicornCommand < Command

    self.allow_in_control = true

    def regexp
      /^\s* u(?:nicorn)? (?:\s+(.+))? \s*$/x
    end

    def execute
      rainbow = (1..7).map{|c|"\x1b[3#{c}m"}
      s = <<-'END'
            \
             \
              \\
               \\
                >\/7
            _.-($'  \
           (=___._/` \
                )  \ |
               /   / |
              /    > /
             j    < _\
         _.-' :      ``.
         \ r=._\        `.
        <`\\_  \         .`-.
         \ r-7  `-. ._  ' .  `\
          \`,      `-.`7  7)   )
           \/         \|  \'  / `-._
                      ||    .'
                       \\  (
                        >\  >
                    ,.-' >.'
                   <.'_.''
                     <'
  END

      s.each_line do |l|
        print l
      end
    end

    class << self
      def names
        %w(unicorn)
      end

      def description
        "Try and see"
      end
    end

  end
end
