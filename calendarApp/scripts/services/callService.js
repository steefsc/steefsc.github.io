app.service('callService', function($q, $http){
    this.callUrl = function(method, url, dataObject){
        var deferred = $q.defer();
		$http({
			method : method,
			url : url,
			data : dataObject,
		}).then(function(response) {
			deferred.resolve(response);
		}, function() {
			deferred.reject('There was an error');
		});
		return deferred.promise;
    }
});