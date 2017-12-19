/**
	 * @directive calendar
	 * 
	 * @param {String} month - the calendar month
	 * 
	 * @param {String} year - the calendar year
	 * 
	 * @param {String} selectedDay - user selected Year
	 * 
	 * @param {String} finalDay - final date
	 * 
	 * @param {String} countryCode - User country code
	 * 
	 * @returns nothing
	 */
app.directive('calendar', function ($compile, $http, callService) {

	var directive = {
		restrict: 'EA',
		replace: true,
		templateUrl: 'angularTemplates/calendar.html',
		scope: {
			month: '=',
			year: '=',
			selectedDay: '=',
			finalDay: '=',
			countryCode: '=',
		},
		link: link
	};

	return directive;

	function link(scope, iElement, attrs) {
		var month = new Array();
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";

		scope.dayHeaderArray = ['Sun', 'Mon', 'Thr', 'Wed', 'Tue', 'Fri', 'Sat'];
		scope.calendarObject = {};


		scope.confCalendar = function () {
			scope.calendarObject.days = (new Date(scope.year, scope.month, 0)).getDate();
			scope.calendarObject.startingWeekDay = (new Date(scope.year, scope.month - 1, '1')).getDay();
			scope.calendarObject.monthName = month[scope.month - 1];
			scope.calendarObject.year = scope.year;
			scope.daysArray = [];
			var weeksObject = {};
			var numberOfWeeks = 3;

			var hoollydayAPI = 'https://holidayapi.com/v1/holidays?country=@COUNTRY@&year=@YEAR@&month=@MONTH@&key=@APIKEY@';

			hoollydayAPI = hoollydayAPI.replace('@COUNTRY@', scope.countryCode)
				.replace('@YEAR@', scope.year)
				.replace('@MONTH@', scope.month)
				.replace('@APIKEY@', 'fec0b0e5-14e9-4b86-ac2f-50dcbb0a30ba');

			// getting holidays
			callService.callUrl('GET', hoollydayAPI, {}).then(function (response) {
				// console.log(response);
				if (response && response.data && response && response.data.holidays) {
					angular.forEach(response.data.holidays, function (holiday) {
						var dateArray = holiday.date.split('-');
						var holiDayDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
						var day = holiDayDate.getDate();
						if (holiday.public) {
							for (var i = 0; i < scope.daysArray.length; i++) {
								var objectDay = scope.daysArray[i];
								if (day == objectDay.dayDate && objectDay.css != 'disabled') {
									objectDay.css = 'holiday';
									objectDay.holiDayName = holiday.name;
									break;
								}
							}
						}
					});
				}

			}, function (response) {
				console.log('failed');
			});

			for (var i = 1; i <= scope.calendarObject.days; i++) {
				var dayObject = {};
				dayObject.css = 'enabled';
				dayObject.name = i;
				var dayDate = (new Date(scope.year, scope.month, i)).getDate();
				dayObject.dayDate = dayDate;
				var weekDay = (new Date(scope.year, scope.month - 1, i)).getDay();
				dayObject.weekDay = scope.dayHeaderArray[weekDay];
				if (weekDay == 0 || weekDay == 6) {
					dayObject.css = 'weekend';
				}
				if ((scope.selectedDay && i < scope.selectedDay) || (scope.finalDay && i > scope.finalDay)) {
					dayObject.css = 'disabled';
					dayObject.name = '';
				}
				if (i == 1 && scope.calendarObject.startingWeekDay > 0) { // adding empty "fake days" if the month doesn't start on sunday
					for (var k = scope.calendarObject.startingWeekDay - 1; k >= 0; k--) {
						var fakeDayObject = {};
						fakeDayObject.css = 'disabled';
						fakeDayObject.name = '';
						weeksObject[scope.dayHeaderArray[k]] = [];
						weeksObject[scope.dayHeaderArray[k]].push(fakeDayObject);
					}
				}
				if (i == scope.calendarObject.days && weekDay < 6) { // adding empty "fake days" if the month doesn't finish on saturday
					for (var k = weekDay + 1; k <= 6; k++) {
						var fakeDayObject = {};
						fakeDayObject.css = 'disabled';
						fakeDayObject.name = '';
						weeksObject[scope.dayHeaderArray[k]].push(fakeDayObject);
					}
				}
				if (!weeksObject[dayObject.weekDay]) {
					weeksObject[dayObject.weekDay] = [];
				}
				weeksObject[dayObject.weekDay].push(dayObject);
				if (weeksObject[dayObject.weekDay].length > numberOfWeeks) {
					numberOfWeeks = weeksObject[dayObject.weekDay].length;
				}
				if (i == 0) {
					break;
				}
				scope.daysArray.push(dayObject); // required to update the day if it is a holiday 
			}

			//creates the weeks array
			scope.calendarObject.weeksObject = weeksObject;
			scope.calendarObject.numberOfWeeks = [];
			for (var j = 0; j < numberOfWeeks; j++) {
				scope.calendarObject.numberOfWeeks.push(j);
			}
		}
		scope.confCalendar();
	}
});