
TileService = function() {
  this.tileModels = [];
  this.cityToTile = {};
  this.cards = [];

  _.each(Object.keys(mapTiles), function(key) {
    this.cards.push(mapTiles[key].city);
  }.bind(this));
}

TileService.prototype.generateTiles = function() {
  this.tileModels = [];
  this.cityToTile = {};
  _.each(Object.keys(mapTiles), function(key) {
    var model = new TileModel(
        mapTiles[key].value,
        mapTiles[key].cells,
        mapTiles[key].neighbors,
        mapTiles[key].city);
    this.tileModels.push(model);
    this.cityToTile[model.city] = model;
  }.bind(this));

  _.each(this.tileModels, function(tile) {
    var neighborTiles = [];
    _.each(tile.neighbors, function(neighborCity) {
      neighborTiles.push(this.cityToTile[neighborCity]);
    }.bind(this));
    tile.setNeighborTiles(neighborTiles);
  }.bind(this));
  return this.tileModels;
};

TileService.prototype.generateCards = function() {
  return _.shuffle(this.cards);
};