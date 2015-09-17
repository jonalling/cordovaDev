angular.module('starter.controllers', [])

.controller('MotionCtrl', function($window, $scope, $timeout, $ionicPlatform, $cordovaDeviceMotion) {

  ////// Dims of overall window
  // $scope.width = $window.innerWidth;
  $scope.fullHeight = $window.innerHeight;

  ////// Dims of div (accomodates for ionic padding)
  $scope.width = angular.element(document.querySelector('#main'))[0].offsetWidth;
  $scope.height = angular.element(document.querySelector('#main'))[0].offsetHeight;
  $scope.svgHeight = $scope.width; // change if you want portrait rect instead of square
  $scope.chartHeight = 200;


  var zRange = 20, // size range of dot
      padding = 22; // padding to show whole dot along edge


  $scope.data = [];

  ////// Test data for debugging
  // $scope.data = [
  //   {'id':202,'x':157,'y':160,'z':10,'s':224},
  //   {'id':201,'x':156,'y':148,'z':10,'s':216},
  //   {'id':200,'x':152,'y':152,'z':9,'s':216},
  //   {'id':199,'x':154,'y':153,'z':10,'s':217},
  //   {'id':198,'x':160,'y':143,'z':10,'s':215},
  //   {'id':197,'x':150,'y':165,'z':10,'s':224},
  //   {'id':196,'x':149,'y':187,'z':10,'s':240},
  //   {'id':195,'x':159,'y':129,'z':10,'s':205},
  //   {'id':194,'x':157,'y':134,'z':10,'s':207},
  //   {'id':193,'x':158,'y':153,'z':10,'s':229},
  //   {'id':192,'x':90,'y':98,'z':9,'s':205},
  //   {'id':191,'x':92,'y':90,'z':8,'s':200},
  //   {'id':190,'x':98,'y':85,'z':8,'s':250},
  //   {'id':189,'x':102,'y':100,'z':8,'s':220},
  //   {'id':188,'x':90,'y':105,'z':8,'s':215}
  // ];

  var dataId = 0;

  ////// Code for browser debugging with responsive dot (no cordova)
  // var negX = 0;
  // var negY = 0;
  // var newZ = 0;
  //
  // $interval( function(){
  //
  //   negX = negX + 1;
  //   negY = negY + 1;
  //   newZ = newZ + 1;
  //   var xVar = ((negX+9.81)*(($scope.width-(padding*2))/(9.81*2)))+padding;
  //   var yVar = ((negY+9.81)*(($scope.svgHeight-(padding*2))/(9.81*2)))+padding;
  //   var zVar = ((newZ+9.81)*(zRange/(9.81*2)))+10;
  //
  //   if (data.length > 10) {
  //     data.shift({id: dataId, x: xVar,	y: yVar, z: zVar});
  //     dataId++;
  //   } else {
  //     data.unshift({id: dataId, x: xVar,	y: yVar, z: zVar});
  //     dataId++;
  //   }
  //
  //   console.log(data);
  //
  //   $scope.circle = {'x': data[0].x, 'y': data[0].y, 'r': data[0].z};
  //
  // }, 40, 20);

  // $scope.circle = {'x': xVar, 'y': yVar, 'r':zVar};

  // $scope.circles = [];
  //
  // for (i = 0; i < 9; i++) {
  //   opacityPercent = 1 - (i/10);
  //   $scope.circles.unshift({'opacity': opacityPercent, 'x': $scope.data[i].x, 'y': $scope.data[i].y, 'r': $scope.data[i].z});
  // }
  //
  // x = d3.time.scale().range([0, $scope.width]);
  // y = d3.scale.linear().range([$scope.chartHeight, 0]);
  //
  // x.domain(d3.extent($scope.data, function(d) {return d.id}));
  // // y.domain(d3.extent($scope.data, function(d) {return d.s}));
  // y.domain([100,400]);
  //
  // $scope.line = d3.svg.line()
  //     .x(function(d) {return x(d.id);})
  //     .y(function(d) {return y(d.s);});



  //// Start Cordova code, returning dot position relative to accerlation (responsive size)
  $ionicPlatform.ready(function(){

    var options = { frequency : 40 }; //plugin min 40ms, max 1000ms
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

        // Scale Dot Position
        var xVar = (((result.x * -1)+9.81)*(($scope.width-(padding*2))/(9.81*2)))+padding;
        var yVar = (((result.y)+9.81)*(($scope.svgHeight-(padding*2))/(9.81*2)))+padding;
        var zVar = (((result.z * -1)+9.81)*(zRange/(9.81*2)))+10;
        var mag = Math.sqrt($scope.X*$scope.X + $scope.Y*$scope.Y + $scope.Z*$scope.Z);

        // Draw Dot
        // $scope.circle = {'x': xVar, 'y': yVar, 'r':zVar};

        // Draw Trailing Dots
        if ($scope.data.length > 30) {
          $scope.data.pop();
          $scope.data.unshift({id: dataId, x: xVar,	y: yVar, z: zVar, s: mag});
          dataId++;
        } else {
          $scope.data.unshift({id: dataId, x: xVar,	y: yVar, z: zVar, s: mag});
          dataId++;
        }

        // $scope.singleCircle = {'x': data[0].x, 'y': data[0].y, 'r': data[0].z};

        $scope.circles = [];

        for (i = 0; i < 9; i++) {
          opacityPercent = 1 - (i/10);
          $scope.circles.unshift({'opacity': opacityPercent, 'x': $scope.data[i].x, 'y': $scope.data[i].y, 'r': $scope.data[i].z});
        }

        x = d3.time.scale().range([0, $scope.width]);
        y = d3.scale.linear().range([$scope.chartHeight, 0]);

        x.domain(d3.extent($scope.data, function(d) {return d.id}));
        // y.domain(d3.extent($scope.data, function(d) {return d.s}));
        y.domain([0,25]);

        $scope.line = d3.svg.line()
            .x(function(d) {return x(d.id);})
            .y(function(d) {return y(d.s);});

        ////// For calculating averages later
        // var calculateAverage = function(MyData){
        //   var sum = 0;
        //   for(var i = 0; i < MyData.length; i++;) {
        //     sum += parseInt(MyData[i], 10); //don't forget to add the base
        //   }
        //   var avg = sum/MyData.length;
        //   return avg;
        // };
        //
        // $scope.calculateAverage(MyData);

    });

  }); // end $ionicPlatform.ready

}) // end MotionCtrl

.controller('OrientCtrl', function($scope, $ionicPlatform, $cordovaDeviceOrientation) {

  $ionicPlatform.ready(function(){

    ////// FROM ngCORDOVA EXAMPLE

    var options = {
      frequency: null,
      filter: 2     // if frequency is set, filter is ignored
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
