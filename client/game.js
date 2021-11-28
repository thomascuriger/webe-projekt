var ctx = null;
var canvas = null;
function addCanvas() {
  // Create the canvas
  canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  ctx = canvas.getContext('2d');
  canvas.width = 12 * 64;
  canvas.height = 12 * 64;
  document.body.appendChild(canvas);
}

function removeCanvas() {
  ctx = null;
  canvas = null;
  document.getElementById('gameCanvas').outerHTML = '';
}

function generateBlock2dMatrix(n) {
  a = Array(n)
    .fill(0)
    .map(x => Array(n).fill(0));
  return a;
}

var map = {
  cols: 12,
  rows: 12,
  tsize: 64,
  tiles: [
    [119, 119, 119, 60, 119, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 119, 60, 119, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 60, 60, 119, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 60, 119, 119, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 60, 119, 119, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 60, 119, 119, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 60, 60, 60, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 119, 119, 60, 119, 119, 119, 119, 119, 119, 119],
    [119, 119, 119, 119, 60, 60, 119, 119, 119, 119, 119, 119],
    [119, 119, 119, 119, 119, 60, 119, 119, 119, 119, 119, 119],
    [119, 119, 119, 119, 119, 60, 119, 119, 119, 119, 119, 119],
    [119, 119, 119, 119, 119, 60, 119, 119, 119, 119, 119, 119]
  ],
  getTile: function (col, row) {
    return this.tiles[row][col];
  },
  // 245-248
  enemiesMoving: [],
  towersAlive: []
};

function handleGameUpdate(event) {
  let x = event.value.x;
  let y = event.value.y;
  let type = event.value.type;
  switch (event.value.updateType) {
    case 0:
      map.enemiesMoving = event.value.enemiesMoving;
      render();
      console.log(event.value.enemiesMoving)
      // enemy moves
      // handle moves
      break;
    case 1:
      // enemy spawns
      let hp = 100;
      map.enemiesMoving.push([x, y, hp, type]);
      break;
    case 2:
      // push tower
      map.towersAlive.push([x, y, type]);
      break;
  }
}

function handleGameExit() {
  // reset everything to zero
  map.enemiesMoving = [];
  map.towersAlive = [];
}


function renderHit(event) {
  // render here, sound, draw etc.

  // if dead, remove
  if (event.value.enemyHp <= 0) {
    map.enemiesMoving.shift();
  }

}

function spawnTowerPlayerOne() {
  let x = Math.floor(Math.random() * 13);
  let y = Math.floor(Math.random() * 13);
  let value = {
    x: x,
    y: y,
    updateType: 2,
    type: 247
  };
  let message = createMessage(messageType.GAMEUPDATE, value);
  websocketGame.socket.send(message);
}

function spawnTowerPlayerTwo() {
  let x = Math.floor(Math.random() * 13);
  let y = Math.floor(Math.random() * 13);
  let value = {
    x: x,
    y: y,
    updateType: 2,
    type: 248
  };
  let message = createMessage(messageType.GAMEUPDATE, value);
  websocketGame.socket.send(message);
}



// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = 'images/background.png';

// Tiles
var tilesReady = false;
var tiles = new Image();
tiles.onload = function () {
  tilesReady = true;
};
tiles.src = 'images/towerDefense_tilesheet.png';

// Draw everything
var render = function () {
  // if (bgReady) {
  // 	ctx.drawImage(bgImage, 0, 0);
  // }
  if (tilesReady) {
    for (var c = 0; c < map.cols; c++) {
      for (var r = 0; r < map.rows; r++) {
        var tile = map.getTile(c, r);
        if (tile !== 0) {
          // 0 => empty tile
          ctx.drawImage(
            tiles, // image
            (tile % 23) * map.tsize, // source x
            Math.floor(tile / 23) * map.tsize, // source y
            map.tsize, // source width
            map.tsize, // source height
            c * map.tsize, // target x
            r * map.tsize, // target y
            map.tsize, // target width
            map.tsize // target height
          );
        }
      }
    }

    // draw enemies
    for (i = 0; i < map.enemiesMoving.length; i++) {
      let enemy = map.enemiesMoving[i];
      let tile = enemy[3];
      if (tile !== 0) {
        // 0 => empty tile
        ctx.drawImage(
          tiles, // image
          (tile % 23) * map.tsize, // source x
          Math.floor(tile / 23) * map.tsize, // source y
          map.tsize, // source width
          map.tsize, // source height
          enemy[0] * map.tsize, // target x
          enemy[1] * map.tsize, // target y
          map.tsize, // target width
          map.tsize // target height
        );
      }
    }

    // draw towers
    for (i = 0; i < map.towersAlive.length; i++) {
      let tower = map.towersAlive[i];
      let tile = tower[2];
      if (tile !== 0) {
        // 0 => empty tile
        ctx.drawImage(
          tiles, // image
          (tile % 23) * map.tsize, // source x
          Math.floor(tile / 23) * map.tsize, // source y
          map.tsize, // source width
          map.tsize, // source height
          tower[0] * map.tsize, // target x
          tower[1] * map.tsize, // target y
          map.tsize, // target width
          map.tsize // target height
        );
      }
    }
  }
};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  // update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
// reset();
// main();
