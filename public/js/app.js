var app = angular.module('BlankApp', ['ngMaterial']);

app.factory('tileService', function() {
  return new TileService();
});

app.controller('GameController',
    ['$scope', '$element', '$timeout', '$mdBottomSheet', 'tileService', GameController]);

app.controller('TileSheetController',
    ['$scope', '$element', '$timeout', '$mdBottomSheet', 'tile', 'numPlayers', TileSheetController]);
