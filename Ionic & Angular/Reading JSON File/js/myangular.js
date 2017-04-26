var app=angular.module("myapp",[]);
// app.controller("myController",['$scope','$http','$sce',function($scope,$http,$sce){
// 	$scope.m1="Hello";
// 	 $http.get('quiz_data.json').then(function(d1){
// 	 	$scope.m1="Hello";
		
// 	// 	alert("World1");
// 	// })
// 	// alert("World1");

// 	$scope.my=function(){
// 		$scope.m1="Hello";
// 		alert("World");
// 	}	
// }
// }]);
app.controller('myController',['$scope','$http','$sce',function($scope,$http,$sce){
	 $scope.my=function(){
	// 	alert("Hello");
	// $http.get('quiz_data.json').success(function(){
	// 	alert("done");
	// })
	alert("Hello1");
	 $http.get('quiz_data.json').then(function(da) 
	 {
	 	alert("Hello");
   $scope.myQuestions = da.data;
   $scope.TQ=$scope.myQuestions.length;
   alert(myQuestions);
	});
	 }
	
}]);