// small loosely coupled parts that do one thing very well
// but at the same time coherent, consistent overall design when you put pieces together
// they fit together seamlessly no impedance missmatch
// complete off the shelf but at the same time flexibel (mustache, handlebars etc.)
// and not because of a switch to turn off or on, but because of small loosely coupled parts

// implement explicit scope
// calendar module logic no html, css or jquery allowed!!
function Calendar(options) {

	// this has no use yet add a listener or smth
	this.options = options;

	this.currentDate = options.startDate || new Date();
	var currentYear = this.currentDate.getFullYear();

	this.untilDate = options.untilDate || new Date((currentYear + 5).toString()); 
	var untilYear = this.untilDate.getFullYear();

	this.yearList = getClosedInterval(currentYear, untilYear);
	
	this.setContent = function(){
		this.currentContent = updateContent(this.currentDate, this.options);
	}

	// initialize content
	this.setContent();

	// straight line code vs functions
	// maybe implement more generic so we can generate 
	//dates from Interval with startDate endDate also?
	function updateContent(currentDate, options){

		// clone date so we don't modify it with object reference
		var date = new Date(currentDate);

		// function getStartOfMonth(){}
		var daysOfWeek = getClosedInterval(0, 6);
		var startOfWeek = options.startOfWeek || 0;
		// I dont like this startOfMonth should be normalized
		// get start of Month according to start of week
		date.setDate(1);
		// this could be a function and reused in launchCalendar
		var i = 0;
		while(i < startOfWeek){
			daysOfWeek.unshift(daysOfWeek.pop());
			i++;
		}
		var	startOfMonth = daysOfWeek[date.getDay()];

		// function generateContent(){}
		var rowNumber = options.rowNumber || 5;

		var startOfContent = -startOfMonth + 1;
		date.setDate(startOfContent);
		var COLS = 7;
		var content = new Array(rowNumber);

		for(var i = 0; i < rowNumber; i++){
			content[i] = new Array(COLS);
			for(var j = 0; j < COLS; j++){
				content[i][j] = new Date(date);
				date.setDate(date.getDate() + 1);
			}
		}

		return content;
	}

	// TBI
	// use getClosedInterval and then iterate over interval
	// and assign content on [i]
	function getDateInterval(){

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
