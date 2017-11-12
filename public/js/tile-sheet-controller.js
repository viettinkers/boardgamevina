TileSheetController = function($scope, $element, $timeout, tile) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.timeout_ = $timeout;
  this.tile_ = tile;

  this.scope_.city = this.tile_.city;
};

TileSheetController.prototype.getCity = function() {
  return this.tile_.city;
};

TileSheetController.prototype.restart = function() {
};
