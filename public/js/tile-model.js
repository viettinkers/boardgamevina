
TileModel = function(value, cells, neighbors, city) {
  this.value = value;
  this.valueClass = 'tile-' + this.value;

  this.cells = cells;

  this.neighbors = neighbors;

  this.city = city;

  var ys = _.pluck(cells, 'y');
  var xs = _.pluck(cells, 'x');
  this.gridArea =
      (_.min(ys) + 1) + ' / ' +
      (_.min(xs) + 1) + ' / ' +
      (_.max(ys) + 2) + ' / ' +
      (_.max(xs) + 2);

  this.colors = [
    {bg: 'rgb(250, 250, 250)', color: 'rgb(33, 33, 33)'},
    {bg: '#4CAF50', color: 'rgb(33, 33, 33)'},
    {bg: '#B71C1C', color: 'rgba(255,255,255,.87)'}
  ];
  this.colorIndex = 0;

  this.resource = RESOURCES[this.value];

  this.isDiscovered = false;

  this.hasTown = false;

  this.hasFortress = false;

  this.hasPerson = false;

  this.enemies = 0;

  this.playerCount = {};

  this.updateSkins();

  this.faStyles = this.getFaStyles();
};

TileModel.RESOURCE_TO_FA = {
  forest: 'fa-tree',
  mountain: 'fa-cubes',
  field: 'fa-pagelines',
  town: 'fa-home',
  fortress: 'fa-building',
  person: 'fa-male',
  enemy: 'fa-user-secret'
};

TileModel.prototype.getFaStyles = function() {
  var styles = [];
  if (this.isDiscovered && TileModel.RESOURCE_TO_FA[this.resource]) {
    styles.push({style: TileModel.RESOURCE_TO_FA[this.resource]});
  }
  if (this.hasPerson) {
    styles.push({style: TileModel.RESOURCE_TO_FA['person']});
  }
  if (this.hasFortress) {
    styles.push({style: TileModel.RESOURCE_TO_FA['fortress'], playerCount: this.playerCount['fortress']});
  } else if (this.hasTown) {
    styles.push({style: TileModel.RESOURCE_TO_FA['town'], playerCount: this.playerCount['town']});
  }
  if (this.enemies) {
    for (var i = 0; i < this.enemies; i++) {
      styles.push({index: i, style: TileModel.RESOURCE_TO_FA['enemy']});
    }
  }
  return styles;
};


TileModel.prototype.discover = function() {
  if (!this.isDiscovered) {
    this.isDiscovered = true;
  } else if (!this.hasPerson) {
    this.hasPerson = true;
  } else if (!this.hasTown) {
    this.hasTown = true;
  } else {
    this.hasFortress = true;
  }
};

TileModel.prototype.updateSkins = function() {
  this.styles = {'grid-area': this.gridArea};
};

TileModel.prototype.advancePlayerCount_ = function(prop, playerNum) {
  var hasArg = 'has' + prop[0].toUpperCase() + prop.substr(1);
  if (!this.playerCount[prop]) {
    this.playerCount[prop] = 1;
    this[hasArg] = true;
    return;
  }
  if (this.playerCount[prop] < playerNum) {
    this.playerCount[prop]++;
    this[hasArg] = true;
    return;
  }
  this.playerCount[prop] = 0;
  this[hasArg] = false;
};

TileModel.prototype.advancePlacement = function(placement, playerNum) {
  if (!this.isDiscovered && placement != 'enemy') {
    this.isDiscovered = true;
  }
  if (placement == 'person') {
    this.hasPerson = !this.hasPerson;
    if (this.hasPerson) {
      this.enemies = 0;
    }
  } else if (placement == 'town') {
    this.advancePlayerCount_('town', playerNum);
  } else if (placement == 'fortress') {
    this.advancePlayerCount_('fortress', playerNum);
  } else if (placement == 'enemy') {
    this.enemies = (this.enemies + 1) % 6;
  } else {
    this.clearTile();
  }
  this.faStyles = this.getFaStyles();
};

TileModel.prototype.clearTile = function() {
  this.isDiscovered = false; 
  this.hasPerson = false;
  this.enemies = 0;
  this.hasTown = 0;
  this.hasFortress = 0;
  this.playerCount = {};
};

TileModel.prototype.putPlacement = function(placement, count) {
  if (placement == 'clear') {
    this.clearTile();
  }
  if (!this.isDiscovered && placement != 'enemy') {
    this.isDiscovered = true;
  }
  if (placement == 'enemy') {
    this.enemies = count;
  } else {
    var hasArg = 'has' + placement[0].toUpperCase() + placement.substr(1);
    this[hasArg] = !!count;
    this.playerCount[placement] = count;
  }
  this.faStyles = this.getFaStyles();
};