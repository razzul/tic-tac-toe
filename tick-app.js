var game = new Phaser.Game(500, 500, Phaser.CANVAS, 'tick-app', { preload: preload, create: create });
var BLOCK_WIDTH, BLOCK_HEIGHT;
var BOARD_COLS, BOARD_ROWS;
var piecesGroup, piecesAmount, shuffledIndexArray = [];
var sign = 'X';
var DATA = {'X':[],'O':[]};
var game_is_over = false;
function preload() {
	
}

function create() {
	//
	BLOCK_WIDTH = Math.floor(game.world.width / 3);
	BLOCK_HEIGHT = Math.floor(game.world.width / 3);
	BOARD_COLS = Math.floor(game.world.width / BLOCK_WIDTH);
    BOARD_ROWS = Math.floor(game.world.height / BLOCK_HEIGHT);

    drawLines();
    piecesGroup();
}

function drawLines() {
	//
    var graphics = game.add.graphics(0, 0);
	graphics.lineStyle(1, 0xFF0000, 0.5);
	graphics.beginFill(0xFF700B, 1);

    for (var i = 1; i < BOARD_ROWS; i++) {
    	graphics.moveTo(0,BLOCK_WIDTH*i);
    	graphics.lineTo(game.world.width, BLOCK_WIDTH*i);
    }

    for (var j = 1; j < BOARD_COLS; j++) {
    	graphics.moveTo(BLOCK_HEIGHT*j,0);
    	graphics.lineTo(BLOCK_HEIGHT*j, game.world.width);
    }

    window.graphics = graphics;
}

function store_data(name, sign) {
    if(sign == 'X') {
        DATA.X.push(name);
        DATA.X.sort();
    } else {
        DATA.O.push(name);
        DATA.O.sort();
    }
}

function get_valid(arr, sign) {
    var a = [], diff = [], my_data = [];
    if(sign == 'X') {
        my_data = DATA.X;
    } else {
        my_data = DATA.O;
    }

    for (var i = 0; i < arr.length; i++) {
        a[arr[i]] = true;
    }

    var z = [];
    for (var i = 0; i < my_data.length; i++) {
        if (a[my_data[i]]) {
            z.push(my_data[i]);
        }
    }

    if (z.length == 3) {
        return z;
    }
}

function drawCross(sign) {
    Array.prototype.indexOfForArrays = function(search)
    {
      var searchJson = JSON.stringify(search); // "[3,566,23,79]"
      var arrJson = this.map(JSON.stringify); // ["[2,6,89,45]", "[3,566,23,79]", "[434,677,9,23]"]
      return arrJson.indexOf(searchJson);
    };

    var line = null, selected = null;
    var combo = [
        ["piece0x0", "piece1x1", "piece2x2"], // 058
        ["piece0x2", "piece1x1", "piece2x0"], // 840
        ["piece1x0", "piece1x1", "piece1x2"], // 345
        ["piece0x1", "piece1x1", "piece2x1"], // 147
        ["piece0x0", "piece1x0", "piece2x0"], // 036
        ["piece2x0", "piece2x1", "piece2x2"], // 258
        ["piece0x0", "piece0x1", "piece0x2"], // 012
        ["piece0x2", "piece1x2", "piece2x2"]  // 678
    ];

    for (var i = 0; i < combo.length; i++) {
        selected = get_valid(combo[i], sign);
        if(selected != null) break;
    }
    
    
    line = combo.indexOfForArrays(selected);
    draw_match_line(line);
}

function draw_match_line(line) {
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(1, 0xFFFFFF, BLOCK_WIDTH);
    graphics.beginFill(0xFFFFFF, 1);

    if (line == 0) { // 058
        graphics.moveTo(0,0);
        graphics.lineTo(game.world.width, game.world.height);
        graphics.events.onInputOut.add(game_over());
    } else if (line == 1) { // 840
        graphics.moveTo(0,game.world.height);
        graphics.lineTo(game.world.width, 0);
        game_over();
    } else if (line == 2) { // 345
        graphics.moveTo(0,game.world.height/2);
        graphics.lineTo(game.world.width, 0+game.world.height/2);
        game_over();
    } else if (line == 3) { // 147
        graphics.moveTo(game.world.height/2, 0);
        graphics.lineTo(0+game.world.height/2, game.world.width);
        game_over();
    } else if (line == 4) { // 036
        graphics.moveTo(game.world.height/2 - BLOCK_HEIGHT, 0);
        graphics.lineTo(0+game.world.height/2 - BLOCK_HEIGHT, game.world.width);
        game_over();
    } else if (line == 5) { // 678
        graphics.moveTo(0, game.world.height/2 + BLOCK_HEIGHT);
        graphics.lineTo(game.world.width, 0+game.world.height/2 + BLOCK_HEIGHT);
        game_over();
    } else if (line == 6) { // 012
        graphics.moveTo(0, BLOCK_HEIGHT/2);
        graphics.lineTo(game.world.width, BLOCK_HEIGHT/2);
        game_over();
    } else if (line == 7) { // 258
        graphics.moveTo(game.world.width - BLOCK_HEIGHT/2, 0);
        graphics.lineTo(game.world.height - BLOCK_HEIGHT/2, game.world.width);
        game_over();
    }
}

function game_over() {
    game_is_over = true;
}

function piecesGroup() {
	var i, j,
        piece;
	piecesGrp = game.add.group();

    for (i = 0; i < BOARD_ROWS; i++)
    {
        for (j = 0; j < BOARD_COLS; j++)
        {
            piece = piecesGrp.create(j * BLOCK_WIDTH, i * BLOCK_HEIGHT);
            piece.black = true;
            piece.name = 'piece' + i.toString() + 'x' + j.toString();
            piece.inputEnabled = true;
            piece.events.onInputDown.add(selectPiece, this);
            piece.height = BLOCK_HEIGHT;
            piece.width = BLOCK_WIDTH;
            piece.posX = j;
            piece.posY = i;
        }
    }
}

function selectPiece(piece) {

    //if there is a black piece in neighborhood
    if (piece.black && game_is_over == false) {
        addSign(piece);

    	piece.black = false;
    	if(sign == 'X') sign = 'O';
    	else sign = 'X';
    }
}

function addSign(piece) {
    
    var piece_width = piece.width*piece.posX;
    var piece_height = piece.height*piece.posY;
	var text = game.add.text(piece_width + 25, piece_height, sign, { font: BLOCK_WIDTH+"px Arial", fill: "#ff0044", align: "center" });
    store_data(piece.name, sign);
    drawCross(sign);
}