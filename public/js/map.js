var RAW_MAP = [
    [1, 1, 2, 2, 0, 0, 0, 0, 0, 0],
    [3, 4, 5, 5, 6, 7, 0, 0, 0, 0],
    [3, 4, 8, 8, 6, 7, 0, 0, 0, 0],
    [0, 9, 9,10,10, 0, 0, 0, 0, 0],
    [0, 0,11,11, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,12,12, 0, 0, 0, 0, 0],
    [0, 0, 0, 0,13, 0, 0, 0, 0, 0],
    [0, 0, 0, 0,13, 0, 0, 0, 0, 0],
    [0, 0, 0, 0,14,14, 0, 0, 0, 0],
    [0, 0, 0,15,15,16,16, 0, 0, 0],
    [0, 0, 0, 0,17,17,18,18, 0, 0],
    [0, 0, 0,19,19,20,21, 0, 0, 0],
    [0, 0, 0,22,22,20,21, 0, 0, 0],
    [0, 0,23,23,24,24, 0, 0, 0, 0],
    [0, 0, 0,25, 0, 0, 0, 0, 0, 0],
    [0, 0, 0,25, 0, 0, 0, 0, 0, 0]
];
var CITIES = {
  1: 'Tuyên Quang',
  2: 'Cao Bằng',
  3: 'Sơn La',
  4: 'Yên Bái',
  5: 'Thái Nguyên',
  6: 'Hải Dương',
  7: 'Quảng Ninh',
  8: 'Hà Nội',
  9: 'Hoà Bình',
  10: 'Thái Bình',
  11: 'Thanh Hoá',
  12: 'Nghệ An',
  13: 'Huế',
  14: 'Quảng Nam',
  15: 'Kon Tum',
  16: 'Quảng Ngãi',
  17: 'Gia Lai',
  18: 'Phú Yên',
  19: 'Đắk Lắk',
  20: 'Lâm Đồng',
  21: 'Khánh Hoà',
  22: 'Tây Ninh',
  23: 'Kiên Giang',
  24: 'Gia Định',
  25: 'Cà Mau'
//  26: 'H. Sa',
//  27: 'Tr. Sa'
};
var RESOURCES = {
  1: 'mountain',
  2: 'mountain',
  3: 'mountain',
  4: 'forest',
  5: 'forest',
  6: 'field',
  7: 'forest',
  8: 'field',
  9: 'mountain',
  10: 'field',
  11: 'forest',
  12: 'forest',
  13: 'forest',
  14: 'forest',
  15: 'mountain',
  16: 'forest',
  17: 'mountain',
  18: 'field',
  19: 'mountain',
  20: 'forest',
  21: 'field',
  22: 'field',
  23: 'field',
  24: 'field',
  25: 'field'
};
var DIRECTIONS = [
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0},
    {x: 0, y: -1}
];

var mapTiles = {};
var mapGraph = {};

function processMap() {
  for (var k = 0; k < RAW_MAP.length; k++) {
    for (var i = 0; i < RAW_MAP[0].length; i++) {
      var tileValue = RAW_MAP[k][i];
      if (mapTiles[tileValue] || !tileValue) {
        continue;
      }
      mapTiles[tileValue] = {};
      mapTiles[tileValue].value = tileValue;
      mapTiles[tileValue].cells = findCells(i, k);
      mapTiles[tileValue].neighbors = findNeighbors(i, k);
      mapTiles[tileValue].city = CITIES[tileValue];
    }
  }
}

function isValid(x, y) {
  return x >= 0 && x < RAW_MAP[0].length && y >= 0 && y < RAW_MAP.length;
}

function findCells(x, y) {
  var value = RAW_MAP[y][x];
  var matches = _.filter(DIRECTIONS, function(dir) {
    return isValid(x + dir.x, y + dir.y) &&
        RAW_MAP[y + dir.y][x + dir.x] == value;
  });
  matchesCells = _.map(matches, function(dir) {
    return {x: x + dir.x, y: y + dir.y};
  });
  return [{x: x, y: y}].concat(matchesCells);
}

function findNeighbors(x, y) {
  tileValue = RAW_MAP[y][x];
  if (!mapGraph[tileValue]) {
    mapGraph[tileValue] = {};
  }
  var neighbors = [];
  _.each(mapTiles[tileValue].cells, function(cell) {
    var matches = _.filter(DIRECTIONS, function(dir) {
      return isValid(cell.x + dir.x, cell.y + dir.y) &&
          RAW_MAP[cell.y + dir.y][cell.x + dir.x] &&
          RAW_MAP[cell.y + dir.y][cell.x + dir.x] != tileValue;
    });
    _.each(matches, function(dir) {
      var matchedTile = RAW_MAP[cell.y + dir.y][cell.x + dir.x];
      if (!mapGraph[tileValue][matchedTile]) {
        mapGraph[tileValue][matchedTile] = true;
        neighbors.push(CITIES[matchedTile]);
      }
    });
  });
  return neighbors;
}

processMap();
