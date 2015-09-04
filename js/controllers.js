angular.module('starter.controllers', [])

.controller('MotionCtrl', function($scope, $ionicPlatform, $cordovaDeviceMotion) {

  $ionicPlatform.ready(function(){

    ////// FROM ngCORDOVA EXAMPLE

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

.controller('BleCtrl', function($scope, DeviceService) {

  // $scope.devices = DeviceService.list(); // for testing with fake array

  $scope.devices = DeviceService.scanBLE();

  $scope.refreshDevices = function() {
    DeviceService.scanBLE();
  }

}) // end BleCtrl

.controller('BleConnectCtrl', function($scope, $stateParams, $timeout, DeviceService) {

  $scope.device = DeviceService.get($stateParams.deviceId);

  $scope.deviceIsConnected = false;
  $scope.deviceIsSelecting = false;
  $scope.deviceIsReading = false;

  $scope.connectDevice = function() {
    DeviceService.connectBLE($stateParams.deviceId);
    $timeout( function(){
      // $scope.isConnected();
      $scope.deviceData = DeviceService.listDeviceData();
      $scope.deviceIsConnected = true;
      $scope.deviceIsSelecting = true;
    }, 4000); // replace with a promise return when connecting is done
  }

  $scope.shouldShowConnected = function() {
    return !$scope.deviceIsConnected;
  }

  $scope.shouldShowSelecting = function() {
    return $scope.deviceIsSelecting;
  }

  $scope.shouldShowReading = function() {
    return $scope.deviceIsReading;
  }

  $scope.disconnectDevice = function() {
    DeviceService.disconnectBLE($stateParams.deviceId);
    $scope.deviceIsConnected = false;
    $scope.deviceIsSelecting = false;
    $scope.deviceIsReading = false;
  }


  ////// This works, just not asynchronously

  // $scope.notifyMe = function(data) {
  //   $scope.dataValue = DeviceService.notifyBLE($stateParams.deviceId, data);
  //   $scope.deviceIsSelecting = true;
  //   $scope.deviceIsReading = true;
  // }
  //
  // $scope.dataValueList = DeviceService.listValue();

  ////// Trying to include promises

  $scope.notifyMe = function(data) {
    $scope.deviceIsSelecting = true;
    $scope.deviceIsReading = true;

    var getValue = DeviceService.notifyBLE($stateParams.deviceId, data);
    getValue.then(
      function(result) {
        $scope.dataValue = result;
      },
      function(error) {
    });
  }



});
