var app = angular.module('BlankApp', ['ngMaterial']);

app.factory('tileService', function() {
  return new TileService();
});
app.controller('GameController', ['$scope', 'tileService', GameController]);
