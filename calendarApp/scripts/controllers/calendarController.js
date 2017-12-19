app.controller('calendarController', function ($scope, $log, $timeout) {
    $scope.name = 'Steef Sheen';

    $scope.processDate = function () {
        $scope.showCalendars = false;

        if ($scope.startDate && $scope.numberOfDays && $scope.countryCode) {
            //process and calculate the weeks;
            var lastDate = new Date($scope.startDate);
            lastDate.setDate(lastDate.getDate() + $scope.numberOfDays - 1);

            var datesDifference = lastDate - $scope.startDate //milliseconds
            var requiredWeeks = Math.round(datesDifference / 1000 / 60 / 60 / 24 / 7);

            // creating the calendarArray
            var currentWeek = new Date($scope.startDate);

            $scope.calendarObject = {};

            if (requiredWeeks == 0) {
                var currentMonth = currentWeek.getMonth() + 1;
                var currentYear = currentWeek.getFullYear();
                var currentDay = currentWeek.getDate();
                var key = '#' + currentMonth + '#' + currentYear;

                var calendarObject = {};
                calendarObject.year = currentYear;
                calendarObject.month = currentMonth;
                calendarObject.countryCode = $scope.countryCode;
                $scope.calendarObject[key] = calendarObject;
                $scope.calendarObject[key].selectedDay = currentDay;
                $scope.calendarObject[key].finalDay = lastDate.getDate();
            } else {
                for (var i = 0; i < requiredWeeks; i++) {
                    currentWeek = new Date(currentWeek);
                    if (i == 0) {
                        currentWeek.setDate(currentWeek.getDate());
                    } else {
                        currentWeek.setDate(currentWeek.getDate() + 7);
                    }
                    var currentMonth = currentWeek.getMonth() + 1;
                    var currentYear = currentWeek.getFullYear();
                    var currentDay = currentWeek.getDate();
                    var key = '#' + currentMonth + '#' + currentYear;

                    if (!$scope.calendarObject[key]) {
                        var calendarObject = {};
                        calendarObject.year = currentYear;
                        calendarObject.month = currentMonth;
                        calendarObject.countryCode = $scope.countryCode;
                        $scope.calendarObject[key] = calendarObject;
                    }


                    if (i == 0) { // means is the first week
                        $scope.calendarObject[key].selectedDay = currentDay;
                    }

                    if (i == requiredWeeks - 1) { //means we are in the last week
                        $scope.calendarObject[key].finalDay = lastDate.getDate();
                    }
                }
            }


        }
        $timeout(function () { $scope.showCalendars = true; }, 0);
    }
});