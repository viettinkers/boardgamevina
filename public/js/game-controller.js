GameController = function($scope, $element, $timeout, $mdBottomSheet, tileService) {
  this.scope_ = $scope;
  this.element_ = $element;
  this.timeout_ = $timeout;
  this.mdBottomSheet_ = $mdBottomSheet;
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
  //if (this.isGameStarted) {
  //  this.placement = 'enemy';
  //}
  this.scrollTile_(this.findTileByCity_(this.lastCard));
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

GameController.prototype.placeEnemyCard = function(stackIndex) {
  this.timeout_(function() {
    this.drawCard(stackIndex);
    var hasTownOrFortress = false;
    var drawnTile = this.findTileByCity_(this.lastCard);
    if (drawnTile) {
      this.placement = 'enemy';
      this.placeTile(drawnTile);
      this.placement = '';
    }
    this.isGameStarted = true;
    if (!this.stacks[this.currentStackIndex].length) {
      this.currentStackIndex = 1 - this.currentStackIndex;
    }
  }.bind(this), 250);
};

GameController.prototype.placeEnemyCardLastStack = function() {
  this.placeEnemyCard(this.currentStackIndex);
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
  if (!this.placement) {
    this.mdBottomSheet_.show({
      template: `
      <md-bottom-sheet class="md-grid" layout="column">
        <div layout="row" layout-align="center center" ng-cloak>
          <h2 class="md-title">{{tileSheetCtrl.getCity()}}</h2>
        </div>
        <div ng-cloak>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person"
                 ng-click="tileSheetCtrl.clickBtn('person', $index)"
                 ng-style="btn.styles"
                 ng-repeat="btn in tileSheetCtrl.getBtns() track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <i class="fa fa-male"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="enemy"
                 ng-click="tileSheetCtrl.clickBtn('enemy', $index)"
                 ng-repeat="btn in [0, 1, 2, 3, 4, 5] track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <span ng-if="$index > 1">{{$index}}</span>
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person"
                 ng-click="tileSheetCtrl.clickBtn('town', $index)"
                 ng-style="btn.styles"
                 ng-repeat="btn in tileSheetCtrl.getBtns() track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <i class="fa fa-home"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person"
                 ng-click="tileSheetCtrl.clickBtn('fortress', $index)"
                 ng-style="btn.styles"
                 ng-repeat="btn in tileSheetCtrl.getBtns() track by $index"
                 ng-class="{'md-primary': $index > 0}">
              <i class="fa fa-building"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 ng-click="tileSheetCtrl.clickBtn('clear', 0)"
                 class="md-raised"
                 aria-label="clear">
              Xóa
            </md-button>
          </md-list>
        </div>
      </md-bottom-sheet>
      `,
      locals: {
        tile: tile,
        numPlayers: this.getNumPlayers(),
      },
      controller: 'TileSheetController as tileSheetCtrl'
    }).then(function(resp) {
      this.onSheetClickCallback(tile, resp);
    }.bind(this));
    return;
  }

  tile.advancePlacement(this.placement, this.getNumPlayers());
  this.updateResourceSurplus_();
};

GameController.prototype.onSheetClickCallback = function(tile, resp) {
  if (resp.placement == 'person' && resp.count) {
    _.each(this.tiles_, function(tile) {
      if ((tile.hasPerson && this.getNumPlayers() == 1) ||
          tile.persons[resp.count]) {
        tile.putPlacement('person', 0);
        this.isGameStarted = true;
      }
    }.bind(this));
  }
  tile.putPlacement(resp.placement, resp.count);
  if (resp.count > 0 && this.isGameStarted) {
    var resource = this.resources[resp.count - 1];
    if (tile.enemies && resp.placement == 'person') {
      resource.mountain -= (tile.enemies + 1);
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
  if (resp.placement == 'enemy') {
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
      if (tile.playerCount['fortress'] && tile.playerCount['fortress'] == resourceIndex + 1) {
      } else if (tile.playerCount['town'] && tile.playerCount['town'] == resourceIndex + 1 && tile.enemies == 0) {
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
  if (resource.forestPlus) {
    resource.forest += resource.forestPlus;
  }
  if (resource.fieldPlus) {
    resource.field += resource.fieldPlus;
  }
  if (resource.mountainPlus) {
    resource.mountain += resource.mountainPlus;
  }
  resource.forestPlus = 0;
  resource.fieldPlus = 0;
  resource.mountainPlus = 0;
  if (playerIndex) {
    this.scrollTile_(this.findTileByPlayer_(playerIndex));
  }
};