angular.module('starter.controllers', [])

.controller('MotionCtrl', function($scope, $ionicPlatform, $cordovaDeviceMotion) {

  var containerWidth = 300,
      containerHeight = 300,
      zRange = 15;

  $scope.graph = {'width': containerWidth, 'height': containerHeight};

  // var xVar = (fakeX+9.81)*(containerWidth/(9.81*2));
  //
  // $scope.circles = [
  // 	{'x': xVar, 'y': 178, 'r':10}
  // ];

  // $scope.exampleData = [
  //   {
  //   "key":"Group 0",
  //   "values":[{"x":5,"y":5,"size":1}]
  //   }];


  // $scope.options = {
  //    chart: {
  //        id: 'scatter',
  //        type: 'scatterChart',
  //        height: 400,
  //        forceX: [-9.9,9.9],
  //        forceY: [-9.9,9.9],
  //        margin: {"left":12,"right":12,"top":12,"bottom":12},
  //        showLegend: false,
  //        showXAxis: false,
  //        showYAxis: false,
  //        tooltips: false,
  //        interactive: false,
  //        color: [000000],
  //        pointRange: [250,250], // min area, max area
  //        duration: 0
  //    }
  // };
  //
  // $scope.data = [{
  //   key: "Acceleration",
  //   values: [{
  //   x: 0,
  //   y: 0,
  //   size: 1,
  //   shape: 'circle'
  //   }]
  // }];

  $ionicPlatform.ready(function(){

    ////// FROM ngCORDOVA EXAMPLE

    var options = { frequency : 150 };
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

        var negX = result.x * -1;
        var negY = result.y;
        var newZ = result.z * -1;

        var xVar = (negX+9.81)*(containerWidth/(9.81*2));
        var yVar = (negY+9.81)*(containerWidth/(9.81*2));
        var zVar = ((newZ+9.81)*(zRange/(9.81*2)))+10;

        $scope.circles = [
        	{'x': xVar, 'y': yVar, 'r':zVar}
        ];

        // $scope.data = [{
        //   key: "Acceleration",
        //   values: [{
        //     x: negX,
        //     y: negY,
        //     size: 1,
        //     shape: 'circle'
        //   }]
        // }];

        // $scope.exampleData = [
        //   {
        //   "key":"Group 0",
        //   "values":[{"x":negX,"y":negY,"size":1}]
        //   }];

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

  $scope.notifyMe = function(data) {
    $scope.dataValue = DeviceService.notifyBLE($stateParams.deviceId, data);
    $scope.deviceIsSelecting = true;
    $scope.deviceIsReading = true;
  }

  $scope.dataValueList = DeviceService.listValue();
});
