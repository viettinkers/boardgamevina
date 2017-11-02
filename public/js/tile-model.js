
TileModel = function(value, cells, neighbors, city) {
  this.value = value;

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
    styles.push({style: TileModel.RESOURCE_TO_FA['fortress']});
  } else if (this.hasTown) {
    styles.push({style: TileModel.RESOURCE_TO_FA['town']});
  }
  if (this.enemies) {
    for (var i = 0; i < this.enemies; i++) {
      styles.push({index: i, style: TileModel.RESOURCE_TO_FA['enemy']});
    }
  }
  return styles;
};

TileModel.prototype.nextColor = function() {
  this.colorIndex = (this.colorIndex + 1) % this.colors.length;
  this.updateSkins();
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
  this.styles = {'grid-area': this.gridArea,
      'background-color': this.colors[this.colorIndex].bg,
      'color': this.colors[this.colorIndex].color};
};

TileModel.prototype.place = function(placement) {
  if (!this.isDiscovered && placement != 'enemy') {
    this.isDiscovered = true;
  }
  if (placement == 'person') {
    this.hasPerson = !this.hasPerson;
  } else if (placement == 'town') {
    this.hasTown = !this.hasTown;
  } else if (placement == 'fortress') {
    this.hasFortress = !this.hasFortress;
  } else if (placement == 'enemy') {
    this.enemies = (this.enemies + 1) % 6;
  }
  this.faStyles = this.getFaStyles();
};