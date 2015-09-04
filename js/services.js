angular.module('starter.services', [])

.service('DeviceService', function($rootScope, $q, $ionicPlatform, $cordovaBLE, $interval) {

  ////// FAKE DATA FOR TESTING

  // var devices = [{
  //   advertising: '',
  //   id: '17D8E163-AB4A-AF3C-3327-D77E86D4E90A',
  //   name: 'estimote',
  //   rssi: '-89'
  // }, {
  //   advertising: '',
  //   id: 'DC519A7D-CD57-F7AB-A429-C9522FF47560',
  //   name: 'estimote',
  //   rssi: '-71'
  // }];
  //
  // this.list = function() {
  //   return devices;
  // }



  ////// INITIALIZE VARS

  var devices = [],
      deviceData = [],
      connectingId = null,
      isDeviceConnected = null,
      serviceUUID = '',
      characteristicUUID = '';



  //// START SCAN API

  this.scanBLE = function(){

    // reset device array to zero length
    devices.length = 0;

    $ionicPlatform.ready(function(){

      var scan = $cordovaBLE.scan([],5);
      scan.then(
        null,
        function(error) {
          // error
        },
        function(result) {
          devices.push(result);
          ////// TODO: eventually eliminate duplicate items, update array/add new contents instead of clear and push
          ////// Below code is from lsresearch, https://github.com/lsresearch/modulelink-ble-ionic/blob/master/www/js/tiwi-ble.js

          // if (typeof devices[resp.address] === "undefined"){
			  	// 			// if (validNames.indexOf(resp.name) == -1) return;
			  	// 			var found = false;
			  	// 			for (var i=0;i<validNames.length;i++){
			  	// 				if (resp.name.indexOf(validNames[i]) != -1){
			  	// 					found = validNames[i];
			  	// 				}
			  	// 			}
			  	// 			if (found == false) return;
			  	// 			devices[resp.address] = resp;
			  	// 			devices[resp.address].type = found;
			  	// 			resp.thisScan = true;
			  	// 		}else{
			  	// 			devices[resp.address].rssi = resp.rssi;
			  	// 			devices[resp.address].thisScan = true;
			  	// 		}

      });

    }); // end $ionicPlatform.ready

    return devices;

  } // end scanBLE function



  ////// SIMPLY RETURN devices

  this.list = function() {
    return devices;
  } // end list function



  ////// GET DEVICE ID TO PASS FOR DETAIL PAGE

  this.get = function(deviceId) {

      for (var i = 0; i < devices.length; i++) {
        if (devices[i].id === deviceId) {
          connectingId = devices[i].id;
          return devices[i];
        }
      }
      return null;

  } // end get function



  ////// CONNECT TO DEVICE

  this.connectBLE = function(deviceId) {

    $ionicPlatform.ready(function(){

      // var connect = $cordovaBLE.connect('26476CFC-D254-090C-900A-917720B28689');
      var connect = $cordovaBLE.connect(deviceId);
      connect.then(
        function(result) {
          deviceData = result.characteristics;
          // window.alert(JSON.stringify(result))
        },
        function(error) {

      });

    }); // end $ionicPlatform.ready

    return deviceData;

  } // end connect function



  ////// SIMPLY RETURN deviceData

  this.listDeviceData = function() {
    return deviceData;
  } // end list function



  ////// DISCONNECT FROM DEVICE

  this.disconnectBLE = function(deviceId) {

    $ionicPlatform.ready(function(){

      // var connect = $cordovaBLE.connect('26476CFC-D254-090C-900A-917720B28689');
      var disconnect = $cordovaBLE.disconnect(deviceId);
      disconnect.then(
        function(result) {
        },
        function(error) {

      });

    }); // end $ionicPlatform.ready

  } // end connect function


  ////// CHECK IF THE DEVICE IS CONNECTED

  // this.isConnectedBLE = function(deviceId) {
  //
  //   $ionicPlatform.ready(function(){
  //
  //     var isConnected = $cordovaBLE.isConnected(deviceId);
  //     isConnected.then(
  //       function(result) {
  //         window.alert(JSON.stringify(result));
  //         return true;
  //       },
  //       function(error) {
  //         return false;
  //
  //     });
  //
  //   }); // end $ionicPlatform.ready
  //
  // } // end disconnect function

  ////// ARRAY BUFFER

  this.bytesToString = function(result) {
    return String.fromCharCode.apply(null, new Uint8Array(result));
  }

  this.stringToBytes = function(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }



  ////// START READ NOTIFICATION

  this.notifyBLE = function(deviceId, data) {

    serviceUUID = data.service;
    characteristicUUID = data.characteristic;

    $ionicPlatform.ready(function(){

      var notify = $cordovaBLE.startNotification(deviceId, serviceUUID, characteristicUUID);
      notify.then(
        function(result) {
          // trying promises
          var deferred = $q.defer();
          var value = new Uint8Array(result);
          deferred.resolve(value);
          // return deferred.promise;
        },
        function(error) {

      });

    }); // end $ionicPlatform.ready

    return deferred.promise;

  } // end notify function



  ////// SIMPLY RETURN value

  // this.listValue = function() {
  //   return value[0];
  // } // end list function


}); // end 'DeviceService'
