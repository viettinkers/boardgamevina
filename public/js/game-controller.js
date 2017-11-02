GameController = function($scope, tileService) {
  this.scope_ = $scope;
  this.tileService_ = tileService;
  this.resource = {
    forest: 0,
    mountain: 0,
    field: 0
  };
  this.placement = '';
};

GameController.prototype.getTiles = function() {
  return this.tileService_.getTiles();
};

GameController.prototype.minusResource = function(resource, prop) {
  resource[prop] = Math.max(0, resource[prop] - 1);
};

GameController.prototype.plusResource = function(resource, prop) {
  resource[prop]++;
};

GameController.prototype.togglePerson = function() {
  this.placement = this.placement != 'person' ? 'person' : '';
};

GameController.prototype.toggleEnemy = function() {
  this.placement = this.placement != 'enemy' ? 'enemy' : '';
};

GameController.prototype.toggleTown = function() {
  this.placement = this.placement != 'town' ? 'town' : '';
};

GameController.prototype.toggleFortress = function() {
  this.placement = this.placement != 'fortress' ? 'fortress' : '';
};

GameController.prototype.resetPlacement = function() {
  this.placement = '';
};
