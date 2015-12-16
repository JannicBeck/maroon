// small loosely coupled parts that do one thing very well
// but at the same time coherent, consistent overall design when you put pieces together
// they fit together seamlessly no impedance missmatch
// complete off the shelf but at the same time flexibel (mustache, handlebars etc.)
// and not because of a switch to turn off or on, but because of small loosely coupled parts

// calendar module logic no html, css or jquery allowed!!
function Calendar(options) {

	this.options = options;
	this.months = getClosedInterval(0, 11);
	this.weekdays = getClosedInterval(0, 6);	
	this.currentDate = options.startDate || new Date();
	this.untilDate = options.untilDate || new Date((this.currentDate.getFullYear() + 5).toString()); 
	this.years = getClosedInterval(this.currentDate.getFullYear(), this.untilDate.getFullYear());
	this.currentContent = updateContent(this.currentDate);

	this.setContent = function(date){
		this.currentContent = updateContent(date);
	}

	this.setMonth = function(month){
		this.currentDate.setMonth(month);
	}

	this.setYear = function(year){
		this.currentDate.setYear(year);
	}

	// maybe seperate operations? seems to heavy
	// pass paramters instead of scoping?
	function updateContent(currentDate){

		var date = new Date(currentDate);
		var rowNumber = options.rowNumber || 5;
		date.setDate(1);
		//var months = getClosedInterval(0, 11);
		//months.unshift(months.pop());
		// I don't like this
		var startOfMonth = (options.religiousWeek ? date.getDay() : (date.getDay() + 6) %7);
		var startOfContent = -startOfMonth + 1;
		date.setDate(startOfContent);
		var COLS = 7;
		var content = new Array(rowNumber);

		// i don't like it 
		for(var i = 0; i < rowNumber; i++){
			content[i] = new Array(COLS);
			for(var j = 0; j < COLS; j++){
				content[i][j] = new Date(date);
				date.setDate(date.getDate() + 1);
			}
		}
		return content;
	}

	// returns a closed interval from start to end
	function getClosedInterval(start, end){
		var interval = new Array(end-start);
		for(var i = start; i <= end; i++){
			interval[i-start] = i;
		}
		return interval;
	}

}
