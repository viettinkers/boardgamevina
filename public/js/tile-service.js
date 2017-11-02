
TileService = function() {
  this.tileModels = [];

  _.each(Object.keys(mapTiles), function(key) {
    var model = new TileModel(
        mapTiles[key].value,
        mapTiles[key].cells,
        mapTiles[key].neighbors,
        mapTiles[key].city);
    this.tileModels.push(model);
  }.bind(this));
}

TileService.prototype.getTiles = function() {
  return this.tileModels;
};