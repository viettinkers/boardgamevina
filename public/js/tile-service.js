
TileService = function() {
  this.tileModels = [];
  this.cards = [];

  _.each(Object.keys(mapTiles), function(key) {
    this.cards.push(mapTiles[key].city);
  }.bind(this));
}

TileService.prototype.generateTiles = function() {
  this.tileModels = [];
  _.each(Object.keys(mapTiles), function(key) {
    var model = new TileModel(
        mapTiles[key].value,
        mapTiles[key].cells,
        mapTiles[key].neighbors,
        mapTiles[key].city);
    this.tileModels.push(model);
  }.bind(this));
  return this.tileModels;
};

TileService.prototype.generateCards = function() {
  return _.shuffle(this.cards);
};