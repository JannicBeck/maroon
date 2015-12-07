// calendar module logic no html, css or jquery allowed!!
function Calendar(options) {

	var weekdays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
	var monthNames = ['Januar', 'Februar', 'März', 'April',
	'Mai', 'Juni', 'Juli', 'August',
	'September', 'Oktober', 'November', 'Dezember'];
	var rowNumber = (options.rowNumber ? options.rowNumber : 5);
	var calendarTitle = (options.calendarTitle ? options.calendarTitle : 'Calendar');	
	var currentDate = new Date();
	var currentYear = (options.fromYear ? options.fromYear : currentDate.getFullYear());
	var untilYear = (options.untilYear ? options.untilYear : currentYear + 5);
	var religiousWeek = options.religiousWeek;
	if(religiousWeek) { weekdays.unshift(weekdays.pop()) };
	var years = getClosedInterval(currentYear, untilYear);
	var currentMonth = monthNames[currentDate.getMonth()];
	var currentDay = ('0' + currentDate.getDate()).slice(-2);
	var currentContent = getCalendarContent();

	var startDate = '';
	var endDate = '';

	function updateCalendar(){
		this.currentContent = getCalendarContent();
	}

	function setMonth(month){
		this.currentMonth = month;
		this.currentDate.setMonth(monthNames.indexOf(month));
	}

	function setYear(year){
		this.currentYear = year;
		this.currentDate.setYear(year);
	}

	function setDay(day){
		this.currentDay = day;
		this.currentDate.setDate(day);
	}

	// buggy months always start on tuesday
	function getCalendarContent(){

		var date = new Date(currentDate);
		date.setDate(1);
		var startOfMonth = (religiousWeek ? date.getDay() : (date.getDay() + 6) %7);
		var startOfContent = -startOfMonth + 1;
		date.setDate(startOfContent);
		var COLS = 7;
		var content = new Array(rowNumber);

		for(var i = 0; i < rowNumber; i++){
			content[i] = new Array(COLS);
			for(var j = 0; j < COLS; j++){
				content[i][j] = ('0' + date.getDate()).slice(-2);
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

	// returns true if obj is a number
	function isNumber(obj) { 
		return !isNaN(parseFloat(obj)); 
	}

	// var dayOfTheWeek = weekdays[date.getDate()];

	// Sets the day of the month of a date object
	// date.setDate();

	// Sets the year (four digits) of a date object
	// date.setFullYear();	

	// Sets the month of a date object
	// date.setMonth();

	// Converts the date portion of a Date object into a readable string
	// date.toDateString()

	// Returns the date portion of a Date object as a string, using locale conventions
	// date.toLocaleDateString()
	return {currentDay: currentDay, monthNames: monthNames, currentMonth: currentMonth, currentYear: currentYear, years: years, 
		weekdays: weekdays, currentContent: currentContent, startDate: startDate, endDate: endDate, 
		calendarTitle: calendarTitle, updateCalendar: updateCalendar, currentDate: currentDate, setDay: setDay,
		setMonth: setMonth, setYear: setYear};

}
