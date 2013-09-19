require 'byebug'

class Fixnum
	def fib_mm
		if (self < 3)  then
			"this string does not understand -->".bazzle
			return 1
		else
			(self - 1).fib_mm + (self - 2).fib_mm
		end
	end
end

12.fib_mm
