require 'byebug'

class Fixnum
	def fibonacci
		if (self < 3)  then
			byebug
			return 1
		else
			(self - 1).fibonacci + (self - 2).fibonacci
		end
	end
end

12.fibonacci
