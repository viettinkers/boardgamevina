
TileService = function() {
  this.tileModels = [];
  this.cards = [];

  _.each(Object.keys(mapTiles), function(key) {
    var model = new TileModel(
        mapTiles[key].value,
        mapTiles[key].cells,
        mapTiles[key].neighbors,
        mapTiles[key].city);
    this.tileModels.push(model);

    this.cards.push(mapTiles[key].city);
  }.bind(this));
  this.cards = _.shuffle(this.cards);
}

TileService.prototype.getTiles = function() {
  return this.tileModels;
};

TileService.prototype.getCards = function() {
  return this.cards;
};