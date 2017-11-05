GameController = function($scope, $element, $timeout, tileService) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.timeout_ = $timeout;
  this.tileService_ = tileService;
  this.restart();
};

GameController.prototype.restart = function() {
  this.tiles_ = this.tileService_.generateTiles();
  this.resources = [];
  this.placement = '';
  this.stacks = [this.tileService_.generateCards(), []];
  this.lastCard = '';
  this.lastDrawnStack_ = null;
  this.isDrawingCards = false;
  this.isGameStarted = false;
  this.isWinning = false;
  this.addPlayer();
};

GameController.prototype.getTiles = function() {
  return this.tiles_;
};

GameController.prototype.addPlayer = function() {
  this.resources.push({
    forest: 0,
    mountain: 0,
    field: 0
  });
};

GameController.prototype.removePlayer = function() {
  this.resources.pop();
};

GameController.prototype.getNumPlayers = function() {
  return this.resources.length;
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
  this.isGameStarted = true;
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

GameController.prototype.drawCard = function(stackIndex) {
  if (!this.stacks[stackIndex].length) {
    return;
  }
  this.lastCard = this.stacks[stackIndex].pop();
  this.lastDrawnStack_ = stackIndex;
  this.isDrawingCards = true;
  this.timeout_(function() {
    this.isDrawingCards = false;
    this.stacks[1 - stackIndex].push(this.lastCard);
  }.bind(this), 500);
  if (this.isGameStarted) {
    this.placement = 'enemy';
  }
};

GameController.prototype.shuffleCards = function(stackIndex) {
  this.stacks[stackIndex] = _.shuffle(this.stacks[stackIndex]);
  this.lastCard = '';
  this.element_.addClass('shuffling-cards');
  this.timeout_(function() {
    this.element_.removeClass('shuffling-cards');
  }.bind(this), 200);
};

GameController.prototype.doShowLastCard = function(stackIndex) {
  return this.lastDrawnStack_ == stackIndex &&
      this.lastCard;
};

GameController.prototype.placeTile = function(tile) {
  tile.place(this.placement, this.getNumPlayers());
  this.updateResourceSurplus_();
};

GameController.prototype.updateResourceSurplus_ = function() {
  _.each(this.resources, function(resource, resourceIndex) {
    resource.forestPlus = 0;
    resource.fieldPlus = 0;
    resource.mountainPlus = 0;
    var discoveredTowns = 0;
    _.each(this.tiles_, function(tile) {
      if ((tile.playerCount['town'] && tile.playerCount['town'] == resourceIndex + 1) ||
          (tile.playerCount['fortress'] && tile.playerCount['fortress'] == resourceIndex + 1)) {
        resource[tile.resource + 'Plus']++;
      }
      if (tile.isDiscovered) {
        discoveredTowns++;
      }
    }.bind(this));
    if (discoveredTowns == this.tiles_.length) {
      this.isWinning = true;
    }
  }.bind(this));
};
