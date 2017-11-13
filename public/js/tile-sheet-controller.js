TileSheetController = function($scope, $element, $timeout, $mdBottomSheet, tile, numPlayers) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.timeout_ = $timeout;
  this.mdBottomSheet_ = $mdBottomSheet;
  this.tile_ = tile;
  this.numPlayers_ = numPlayers;
  this.btns_ = null;
  this.scope_.city = this.tile_.city;
};

TileSheetController.prototype.getCity = function() {
  return this.tile_.city;
};

TileSheetController.prototype.getBtns = function() {
  if (this.btns_) {
    return this.btns_;
  }
  this.btns_ = [];
  for (var i = 0; i < this.numPlayers_ + 1; i++) {
    this.btns_.push({styles:
        {'background-color': BTN_BGCOLORS[i]}});
  }
  return this.btns_;
};

TileSheetController.prototype.clickBtn = function(type, count) {
  this.mdBottomSheet_.hide({placement: type, count: count});
};
