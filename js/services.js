angular.module('starter.services', [])

.factory('Devices', function($ionicPlatform, $cordovaBLE) {

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

  //////  NOT USING... YET

  $ionicPlatform.ready(function(){

    var scan = $cordovaBLE.scan([],5);
    scan.then(
      null,
      function(err) {
        // error
      },
      function(result) {
        // var devices = JSON.stringify(result);
        return result;

    });

  }); // end $ionicPlatform.ready

}); // end 'Devices'
