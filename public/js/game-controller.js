GameController = function($scope, $element, $timeout, $mdBottomSheet, $mdDialog, tileService) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.timeout_ = $timeout;
  this.mdBottomSheet_ = $mdBottomSheet;
  this.mdDialog_ = $mdDialog;
  this.tileService_ = tileService;
  this.restart();
};

GameController.prototype.restart = function() {
  this.tiles_ = this.tileService_.generateTiles();
  this.resources = [];
  this.placement = '';
  this.stacks = [this.tileService_.generateCards(), []];
  this.currentStackIndex = 0;
  this.lastCard = '';
  this.lastDrawnStack_ = null;
  this.isDrawingCards = false;
  this.isGameStarted = false;
  this.isWinning = false;
  this.isLosing = false;
  this.highlightButton = '';
  this.addPlayer();
};

GameController.prototype.getTiles = function() {
  return this.tiles_;
};

GameController.prototype.addPlayer = function() {
  this.resources.push({
    forest: 3,
    mountain: 3,
    field: 3
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

GameController.prototype.scrollTile_ = function(tile) {
  if (tile) {
    var el = $($.find('.' + tile.valueClass));
    el.focus();
    el[0].scrollIntoView();
  }
};

GameController.prototype.findTileByCity_ = function(card) {
  return _.find(this.tiles_, function(tile) {
    return tile.city == card;
  });
};

GameController.prototype.findTileByPlayer_ = function(playerIndex) {
  var numPlayers = this.getNumPlayers();
  return _.find(this.tiles_, function(tile) {
    return tile.hasPerson &&
        (numPlayers == 1 || tile.persons[playerIndex]);
  });
};

GameController.prototype.drawLastStackAndPlaceEnemy = function() {
  this.drawAndPlaceEnemyCard(this.currentStackIndex);
};

GameController.prototype.drawAndPlaceEnemyCard = function(stackIndex) {
  this.drawCard(stackIndex);
  var hasTownOrFortress = false;
  var drawnTile = this.findTileByCity_(this.lastCard);
  if (!drawnTile) {
    return;
  }
  drawnTile.advancePlacement('enemy', this.getNumPlayers());
  if (drawnTile.enemies > 3) {
    this.isLosing = true;
  }
  this.updateResourceSurplus_();
  this.isGameStarted = true;
  this.highlightButton = 'add-resources';
  if (drawnTile.hasPerson) {
    this.scrollTile_(this.findTileByCity_(this.lastCard));
  }
};

GameController.prototype.drawCard = function(stackIndex) {
  if (!this.stacks[stackIndex].length) {
    return;
  }
  var card = this.stacks[stackIndex].pop();
  this.lastCard = card;
  this.lastDrawnStack_ = stackIndex;
  this.stacks[1 - stackIndex].push(card);
  if (this.stacks[stackIndex].length == 0) {
    this.shuffleCards(1 - stackIndex);
    this.currentStackIndex = 1 - stackIndex;
  }
};

GameController.prototype.shuffleCards = function(stackIndex) {
  this.stacks[stackIndex] = _.shuffle(this.stacks[stackIndex]);
  //this.lastCard = '';
  this.element_.addClass('shuffling-cards');
  this.timeout_(function() {
    this.element_.removeClass('shuffling-cards');
  }.bind(this), 200);
};

GameController.prototype.doShowLastCard = function(stackIndex) {
  return this.lastDrawnStack_ == stackIndex &&
      this.lastCard;
};

GameController.prototype.onTileClick = function(tile) {
  this.mdBottomSheet_.show({
    template: TILE_SHEET_TEMPLATE,
    locals: {
      tile: tile,
      numPlayers: this.getNumPlayers(),
    },
    controller: 'TileSheetController as tileSheetCtrl'
  }).then(function(resp) {
    this.onSheetClickCallback(tile, resp);
  }.bind(this));
  return;
};

GameController.prototype.onSheetClickCallback = function(tile, resp) {
  if (resp.placement == 'person' && resp.count) {
    _.each(this.tiles_, function(tile) {
      if ((tile.hasPerson && this.getNumPlayers() == 1) ||
          tile.persons[resp.count]) {
        tile.clearPerson(resp.count);
        this.isGameStarted = true;
      }
    }.bind(this));
  }
  tile.putPlacement(resp.placement, resp.count);
  if (resp.count > 0 && this.isGameStarted) {
    var resource = this.resources[resp.count - 1];
    if (tile.enemies && resp.placement == 'person') {
      resource.mountain -= (tile.enemies);
     tile.putPlacement('enemy', 0);
    }
    if (resp.placement == 'person') {
      resource.field -= 1;
    }
    if (resp.placement == 'town') {
      resource.forest -= 3;
    }
    if (resp.placement == 'fortress') {
      resource.mountain -= 3;
    }
  }
  if (resp.placement != 'enemy') {
    if (!this.isGameStarted) {
      this.highlightButton = 'add-resources';
    } else {
      this.highlightButton = 'enemy';
    }
  } else {
    this.isGameStarted = true;
  }

  this.updateResourceSurplus_();
};

GameController.prototype.updateResourceSurplus_ = function() {
  _.each(this.resources, function(resource, resourceIndex) {
    resource.forestPlus = 0;
    resource.fieldPlus = 0;
    resource.mountainPlus = 0;
    var discoveredTowns = 0;
    _.each(this.tiles_, function(tile) {
      if ((tile.hasPerson && this.getNumPlayers() == 1) ||
          tile.persons[resourceIndex + 1]) {
        resource[tile.resource + 'Plus']++;
      }
    }.bind(this));
    _.each(this.tiles_, function(tile) {
      if (tile.playerCount['town'] && tile.playerCount['town'] == resourceIndex + 1 && tile.enemies == 0) {
        resource[tile.resource + 'Plus']+=1;
      }
      if (tile.isDiscovered) {
        discoveredTowns++;
      }
    }.bind(this));
    if (discoveredTowns == this.tiles_.length) {
      this.timeout_(function() {
        this.isWinning = true;
      }.bind(this), 1000);
    }
  }.bind(this));
};

GameController.prototype.doHighlight = function(tile) {
  return tile.city == this.lastCard;
};

GameController.prototype.getPlayerColor = function(index) {
  return BTN_BGCOLORS[index];
};

GameController.prototype.addMultiRes = function(resource, playerIndex) {
  this.isGameStarted = true;
  if (resource.forestPlus) {
    resource.forest += resource.forestPlus;
  }
  if (resource.fieldPlus) {
    resource.field += resource.fieldPlus;
  }
  if (resource.mountainPlus) {
    resource.mountain += resource.mountainPlus;
  }
  //resource.forestPlus = 0;
  //resource.fieldPlus = 0;
  //resource.mountainPlus = 0;
  //if (playerIndex) {
  //  this.scrollTile_(this.findTileByPlayer_(playerIndex));
  //}
  this.highlightButton = 'actions';
};

GameController.prototype.isLastCard = function(tile) {
  return tile.city == this.lastCard;
};

GameController.prototype.isInDanger = function(tile) {
  return tile.totalSurroundingEnemies >= 3;
};

GameController.prototype.isCurrentStack = function($index) {
  return this.currentStackIndex == $index;
};

