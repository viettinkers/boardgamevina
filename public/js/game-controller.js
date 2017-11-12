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

GameController.prototype.drawEnemyCard = function(stackIndex) {
  this.drawCard(stackIndex);
  var hasTownOrFortress = false;
  var drawnTile = null;
  _.each(this.tiles_, function(tile) {
    if (tile.city == this.lastCard) {
      drawnTile = tile;
      hasTownOrFortress = tile.hasTown || tile.hasFortress;
      return false;
    }
  }.bind(this));
  if (!hasTownOrFortress && drawnTile) {
    this.placement = 'enemy';
    this.placeTile(drawnTile);
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
                 aria-label="person">
              <i class="fa fa-male"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              <i class="fa fa-male"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 style="background-color: #2196F3;"
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              <i class="fa fa-male"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person">
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              2
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              3
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              4
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              5
              <i class="fa fa-user-secret"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person">
              <i class="fa fa-home"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              <i class="fa fa-home"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 style="background-color: #2196F3;"
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              <i class="fa fa-home"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised md-icon-button"
                 aria-label="person">
              <i class="fa fa-building"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              <i class="fa fa-building"
                 aria-hidden="true"></i>
            </md-button>
            <md-button
                 style="background-color: #2196F3;"
                 class="md-raised md-primary md-icon-button"
                 aria-label="person">
              <i class="fa fa-building"
                 aria-hidden="true"></i>
            </md-button>
          </md-list>
          <md-list flex layout="row" layout-align="center center">
            <md-button
                 class="md-raised"
                 aria-label="person">
              Xóa
            </md-button>
          </md-list>
        </div>
      </md-bottom-sheet>
      `,
      locals: {
        tile: tile
      },
      controller: 'TileSheetController as tileSheetCtrl'
    });
    return;
  }

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

GameController.prototype.doHighlight = function(tile) {
  return tile.city == this.lastCard;
};

