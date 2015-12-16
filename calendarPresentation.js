// you can write your own presentation on top of the logic
// a change here should never lead to a change in the logic
// integrate this module into the calendar object? f.e. myCalendar.startCalendar
function startCalendar(options){

	var calendar = options.calendar;
	var calendarTitle = options.calendarTitle || 'Calendar';	
	var dayNames = options.dayNames || ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
	var monthNames = options.monthNames || ['January', 'February', 'March', 'April',
		'May', 'June', 'July', 'August',
		'September', 'October', 'November', 'December'];

	var $calendar = options.$calendar;
	var $template = options.$template;

	(function init(){
		render();
		bindEvents();
	})();

 	function render(){
 		var view = generateView();
 		var html = Mustache.render($template.html(), view);
 		Mustache.parse(html); 
 		$calendar.html(html);
 	}


 	// I don't like to rebind events everytime we render maybe use partials or smth?
	function bindEvents(){
		var $monthList = $calendar.find('.month-dropdown li');
	 	$monthList.on('click', monthSelect);

	 	var $yearList = $calendar.find('.year-dropdown li');
	 	$yearList.on('click', yearSelect);

	 	var $days = $calendar.find('.calendar-table tbody tr');
	 	$days.on('click', 'td', daySelect);
	}

 	function monthSelect(e){
 		var $this = $(this);
 		var monthName = $this.find('a').html();
 		var month = monthNames.indexOf(monthName);
 		calendar.setMonth(month);
 		calendar.setContent(calendar.currentDate);
 		render();
 		bindEvents();
 	}

 	function yearSelect(e){
 		var $this = $(this);
 		var year = $this.find('a').html();
 		calendar.setYear(year);
		calendar.setContent(calendar.currentDate);
 		render();
 		bindEvents();
	}

	function daySelect(e){
		var $this = $(this);
		var day = $this.html();	
	}

	// I don't like this, title, month/daynames, years do not have to be updated
	// on month/year/day select, basically only content
	// I like the revealing pattern though
	function generateView(){

		// wow such ugly very unconventional
		var currentDate = calendar.currentDate;
		var currentYear = currentDate.getFullYear();
		var currentDay = currentDate.getDate(); 
		var years = calendar.years;
		var startDate = calendar.startDate;
		var endDate = calendar.endDate;
 		var currentMonth = monthNames[currentDate.getMonth()];
 		var currentContent = formatContent(calendar.currentContent);

 		function formatContent(content){
 			// copy content so we won't modify the calendar object
			var formattedContent = content.map(function(row){
				return row.slice(0);
			});

			formattedContent.forEach(function(row, i){
				row.forEach(function(col, j){
					row[j] = ('0' + col.getDate()).slice(-2);
				});
			});
			return formattedContent;
 		}

		return {currentDay: currentDay, 
			monthNames: monthNames, 
			currentMonth: currentMonth, 
			currentYear: currentYear, 
			years: years, 
			dayNames: dayNames, 
			currentContent: currentContent, 
			startDate: startDate, 
			endDate: endDate, 
			calendarTitle: calendarTitle, 
			currentDate: currentDate
		}
	}
	

}

