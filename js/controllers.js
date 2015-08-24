angular.module('starter.controllers', [])

.controller('MotionCtrl', function($scope, $ionicPlatform, $cordovaDeviceMotion) {

  $ionicPlatform.ready(function(){

    ////// THIS WORKS  -- BUT DOESN'T CONTINUOUSLY UPDATE, JUST ON TAB PRESS

    // function onSuccess(acceleration) {
    //   $scope.X = acceleration.x;
    //   $scope.Y = acceleration.y;
    //   $scope.Z = acceleration.z;
    //   $scope.timeStamp = acceleration.timestamp;
    // };
    // function onError() {
    //   alert("Acceleration Error!")
    // };
    // var options = {frequency: 40};
    //
    // var accel = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);

    ////// FROM ngCORDOVA EXAMPLE

    // $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
    //   $scope.X = result.x;
    //   $scope.Y = result.y;
    //   $scope.Z = result.z;
    //   $scope.timeStamp = result.timestamp;
    // }, function(err) {
    //   // An error occurred. Show a message to the user
    // });

    var options = { frequency : 100 };
    var watch = $cordovaDeviceMotion.watchAcceleration(options);
    watch.then(
      null,
      function(error) {
      // An error occurred
      },
      function(result) {
        $scope.X = result.x;
        $scope.Y = result.y;
        $scope.Z = result.z;
        $scope.timeStamp = result.timestamp;
    });

  }); // end $ionicPlatform.ready

}) // end MotionCtrl

.controller('OrientCtrl', function($scope, $ionicPlatform, $cordovaDeviceOrientation) {

  $ionicPlatform.ready(function(){

    ////// FROM ngCORDOVA EXAMPLE

    var options = {
      frequency: null,
      filter: 1     // if frequency is set, filter is ignored
    }

    var watch = $cordovaDeviceOrientation.watchHeading(options).then(
      null,
      function(error) {
        // An error occurred
      },
      function(result) {   // updates constantly (depending on frequency value)
        $scope.magneticHeading = result.magneticHeading;
        $scope.trueHeading = result.trueHeading;
        $scope.accuracy = result.headingAccuracy;
        $scope.timeStamp = result.timestamp;
      });

  }); // end $ionicPlatform.ready

}) // end OrientCtrl

.controller('GeoCtrl', function($scope, $ionicPlatform, $cordovaGeolocation) {

  $ionicPlatform.ready(function(){

    ////// FROM ngCORDOVA EXAMPLE

    var watchOptions = {
      frequency : 1000,
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        // error
      },
      function(position) {
        $scope.lat  = position.coords.latitude
        $scope.long = position.coords.longitude
    });

  }); // end $ionicPlatform.ready

}) // end GeoCtrl

.controller('bleCtrl', function($scope, $ionicPlatform, $cordovaBLE) {

  $ionicPlatform.ready(function(){

    var scan = $cordovaBLE.scan([],5);
    scan.then(
      null,
      function(err) {
        // error
      },
      function(result) {
        conosole.log(JSON.stringify(result));
        $scope.devices = result;
    });

  }); // end $ionicPlatform.ready

}) // end bleCtrl

// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// });
