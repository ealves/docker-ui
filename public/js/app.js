/**
 * Created by eduardo on 20/10/15.
 */

var module = angular.module('DockerApp', []).factory('socket', function ($rootScope) {

  var socket = io();

  return {
    connect: function(url) {
      if(!!url)
        socket = io(url);
      else
        socket = io();
    },
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

module.controller("ContainersController", function($rootScope, $scope, $window, $http, socket){

  $rootScope.socketUrl = 'http://localhost';

  $scope.container = {};
  $scope.containersList = [];
  $scope.modalIsOpen = false;

  $scope.disconnected = false;

  var logDiv = angular.element( document.querySelector('#log') );

  $scope.getContainersList = function() {
    $http({
      method: 'GET',
      url: '/refresh'
    }).then(function successCallback(response) {
    }, function errorCallback(response) {
    });
  };

  $scope.openContainer = function(container) {
    var win = window.open('http://' + container.id + ':8080', '_blank');
    win.focus();
  };

  $scope.closeLog = function(){

    $scope.modalIsOpen = false;

    logDiv.html('');

    //socket.emit('forceDisconnect');
  };

  $scope.showLog = function(container) {

    $scope.container = container;
    $scope.modalIsOpen = true;

    $http({
      method: 'GET',
      url: 'http://' + container.id + ':9001/tail/50'
    }).then(function successCallback(response) {

      logDiv.append(response.data);
      logDiv[0].scrollTop = logDiv[0].scrollHeight;

    }, function errorCallback(response) {
    });

    socket.connect('http://' + container.id + ':9001', function(err) {
      console.debug('Success connecting to server');
    });

    socket.on('log', function(log){

      logDiv.append('<br/>' + log);
      logDiv[0].scrollTop = logDiv[0].scrollHeight;

    });

    setInterval(function(){

      var text = logDiv.html();

      if(text.length > 50000) {
        logDiv.html(text.slice(text.length/2));
      }

    }, 1000);

    console.debug(container);
  };

  socket.on('connect_error', function(err) {
    console.debug('Error connecting to server');
    $scope.containersList = [];
    $scope.disconnected = true;
  });

  socket.on('connect', function(err) {
    console.debug('Success connecting to server');
    $scope.getContainersList();
    $scope.disconnected = false;
  });

  socket.on('refresh', function(containersList){
    $scope.containersList = containersList;
  });

  $scope.getContainersList();
});
