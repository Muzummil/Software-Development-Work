var myapp=angular.module("myModule",[]);
myapp.controller("myController",function($scope){
$scope.m1="Hello in Angular"
});
myapp.controller("controller2",function($scope){
	var employ={
		fname:"Ali",lname:"Raza",age:20
	};
	$scope.employ=employ;
})

myapp.controller("controller3",function($scope){
	var employes=[
	{name:"Ali",gender:"male",age:20},
	{name:"Raza",gender:"male",age:21},
	{name:"John",gender:"male",age:22}
	];
	$scope.employes=employes;
	
	
	$scope.brun=function(){
		$scope.brun2=function(){
		alert("World");
	}
		//document.getElementById("bContainer").innerHTML = "Hello World!";
		//document.getElementById("bContainer").innerHTML = '<button id="b2" onClick="brun2()">Button2</button>'; 
		 $("#bContainer").append('<button id="b2" style="width:200px;">Button2</button>').promise().done(function(){
        	$('#b2').click(function(){
        	alert("world");	
        	});
    	 });
		 //document.getElementById("b2").onclick.innerHTML="Hello";

		//  var button = document.createElement("button");
		// button.innerHTML = "Do Something";

		// // 2. Append somewhere
		// var body = document.getElementsByTagName("body")[0];
		// body.appendChild(button);

	}
	
})
