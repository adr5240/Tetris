let tetris = {};

// SFX

// Player input
const SFXPieceHold = new Audio('SFX/SFX_PieceHold.ogg');
const SFXPieceMoveLR = new Audio('SFX/SFX_PieceMoveLR.ogg');
const SFXHardDrop = new Audio('SFX/SFX_PieceHardDrop.ogg');
const SFXSoftDrop = new Audio('SFX/SFX_PieceFall.ogg');
const SFXRotate = new Audio('SFX/SFX_ButtonUp.ogg');

// Line Clears
const SFXClearLineSingle = new Audio('SFX/SFX_SpecialLineClearSingle.ogg');
const SFXClearLineDouble = new Audio('SFX/SFX_SpecialLineClearDouble.ogg');
const SFXClearLineTriple = new Audio('SFX/SFX_SpecialLineClearTriple.ogg');
const SFXClearTetris = new Audio('SFX/SFX_SpecialTetris.ogg');

// Game Over
const SFXGameOver = new Audio('SFX/SFX_GameOver.ogg');

window.shapes = ['L', 'L', 'L', 'L',
                'J', 'J', 'J', 'J',
                'O', 'O', 'O', 'O',
                'T', 'T', 'T', 'T',
                'S', 'S', 'S', 'S',
                'Z', 'Z', 'Z', 'Z',
                'I', 'I', 'I', 'I'];

tetris.currentShape = window.shapes[ Math.floor(Math.random() * window.shapes.length) ];
tetris.nextShape = window.shapes[ Math.floor(Math.random() * window.shapes.length) ];
tetris.origin = { row: -2, col: 5 };
tetris.colors = ['PURPLE', 'ORANGE', 'YELLOW', 'GREEN', 'RED', 'CYAN', 'BLUE'];
tetris.score = 0;
tetris.lines = 0;
tetris.speed = 0;

tetris.drawPlayField = function () {
    for (let row = 0; row < 20; row++) {
        $('#playfield').append(`<tr class=${row}></tr>`);
        for (let col = 0; col < 10; col++) {
            $(`.${row}`).append(`<td id=${col} blocked=${false}></td>`);
        }
    }

    for (let sideRow = 0; sideRow < 5; sideRow++) {
        $('#next-block').append(`<tr class=side${sideRow}></tr>`);
        $('#hold-block').append(`<tr class=hold${sideRow}></tr>`);
        for (let sideCol = 0; sideCol < 5; sideCol++) {
            $(`.side${sideRow}`).append(`<td id=side${sideCol}></td>`);
            $(`.hold${sideRow}`).append(`<td id=hold${sideCol}></td>`);
        }
    }
};


tetris.fillCells = function(coordinates, fillColor) {
    for (let i = 1; i < coordinates.length; i++) {
        let row = coordinates[i].row;
        let col = coordinates[i].col;
        let $coor = $(`.${row}`).find(`#${col}`);
        $coor.attr('bgcolor', `${fillColor}`);
    }
};


tetris.move = function(direction){

    this.fillCells(this.currentCoor,'');
    if (direction === 'right') {
        this.origin.col++;
    } else if (direction === 'left') {
        this.origin.col--;
    }

    this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);

    if(this.ifUndo()) {
        if (direction === 'right') {
            this.origin.col--;
        } else if (direction === 'left'){
            this.origin.col++;
        }
    } else {
        SFXPieceMoveLR.play();
    }

    this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
    this.fillCells(this.currentCoor, this.currentCoor[0].color);
};


tetris.drop = function () {
    let undo = false;
    this.fillCells(this.currentCoor, '');
    this.origin.row++;

    for (let i = 1; i < this.currentCoor.length; i++) {
        this.currentCoor[i].row++;
        let $coor = $(`.${this.currentCoor[i].row}`).find(`#${this.currentCoor[i].col}`);
        if (this.ifUndo() || $coor.attr('blocked') === 'true') {
            undo = true;
        }
    }

    if (undo) {
        for (let j = 1; j < this.currentCoor.length; j++) {
            this.currentCoor[j].row--;
        }
        this.origin.row--;
    }

    this.fillCells(this.currentCoor, this.currentCoor[0].color);

    if (undo) {
        for (let i = 1; i < this.currentCoor.length; i++) {
            let $coor = $(`.${this.currentCoor[i].row}`).find(`#${this.currentCoor[i].col}`);
            $coor.attr('blocked', true);
            if (this.currentCoor[i].row < 0 && !this.ended) {
                tetris.gameOver();
            }
        }

        this.fillCells(this.currentCoor, this.currentCoor[0].color);
        this.clearRow();
        this.spawn();
    }
};


tetris.hardDrop = function () {
    SFXHardDrop.play();
};


tetris.clearBoard = function () {

    for (let row = 0; row < 20; row++) {

        for(let col = 0; col < 10; col++) {
            let $coor = $(`.${row}`).find(`#${col}`);
            $coor.attr('blocked', 'false');
            $coor.attr('bgcolor', '');
        }
    }

    for (let row = 0; row < 5; row++) {

        for(let col = 0; col < 5; col++) {
            let $coor = $(`.hold${row}`).find(`#hold${col}`);
            $coor.attr('blocked', 'false');
            $coor.attr('bgcolor', '');
        }
    }

    this.score = 0;
    this.lines = 0;
    this.speed = 0;
    this.holdShape = undefined;
    this.setScore();
};


tetris.clearRow = function () {
    let drops = 0;

    for (let row = 19; row >= 0; row--) {
        let rowIsFull = true;

        for(let col = 0; col < 10; col++) {
            let $coor = $(`.${row}`).find(`#${col}`);
            if($coor.attr('blocked') === 'false') {
                rowIsFull = false;
            }

            if (drops > 0) {
                let $newCoor = $(`.${row + drops}`).find(`#${col}`);
                $newCoor.attr('bgcolor', $coor.attr('bgcolor'));
                $newCoor.attr('blocked', $coor.attr('blocked'));
            }
        }
        if (rowIsFull) {
            drops++;
        }
    }
    if (drops > 0) {
        let points = 0;
        if (drops === 4) {
            points = 1600;
            this.tetris++;
            SFXClearTetris.play();
            if (this.tetris > 1) {
                points += 800;
            }
        } else if (drops === 3) {
            points = 800;
            this.tetris = 0;
            SFXClearLineTriple.play();
        } else if (drops === 2) {
            points = 400;
            this.tetris = 0;
            SFXClearLineDouble.play();
        } else {
            points = 200;
            this.tetris = 0;
            SFXClearLineSingle.play();
        }


        let level = this.lines % 5;
        this.lines += drops;
        this.score += points;
        if (level === 0) {
            this.speed += 1;
        }
        this.setScore();
    } else {
        this.tetris = 0;
    }
};


tetris.setScore = function () {
    let $points = $('#points');
    let $linesCleared = $('#linesCleared');

    $points.html(this.score);
    $linesCleared.html(this.lines);
};


tetris.holdPiece = function () {

    if (this.holdShape === undefined) {
        this.fillCells(this.currentCoor, '');
        this.holdShape = this.currentShape;
        this.holdPreview(this.holdShape);
        SFXPieceHold.play();
        this.spawn();
    } else if (!this.swapped){
        let hold = this.holdShape;
        this.holdShape = this.currentShape;
        this.currentShape = hold;
        SFXPieceHold.play();
    }

    if (!this.swapped) {
        this.holdPreview(this.holdShape);
        this.fillCells(this.currentCoor, '');
        this.swapped = true;
        this.origin = { row: -1, col: 5 };
        this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
    }
};


tetris.holdPreview = function (shape) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let $coor = $(`.hold${i}`).find(`#hold${j}`);
            $coor.attr('bgcolor', ``);
        }
    }
    let coordinates = this.shapeToCoor(shape, { row: 2, col: 2 });
    this.fillHoldPreview(coordinates, coordinates[0].color);
};


tetris.fillHoldPreview = function (coordinates, fillColor) {
    for (let i = 1; i < coordinates.length; i++) {
        let row = coordinates[i].row;
        let col = coordinates[i].col;
        let $coor = $(`.hold${row}`).find(`#hold${col}`);
        $coor.attr('bgcolor', `${fillColor}`);
    }
};


tetris.spawn = function () {
    if (this.shapes === undefined || this.shapes.length <= 1) {
        this.shapes = [];
        for (let i = 0; i < window.shapes.length; i++) {
            this.shapes.push(window.shapes[i]);
        }
    }

    let randomIdx = Math.floor(Math.random() * this.shapes.length);
    this.currentShape = this.nextShape;
    this.nextShape = this.shapes.splice(randomIdx, 1)[0];
    this.nextShapePreview(this.nextShape);
    this.origin = { row: -2, col: 5 };
    this.swapped = false;
    this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
};


tetris.fillSpawnPreview = function (coordinates, fillColor) {
    for (let i = 1; i < coordinates.length; i++) {
        let row = coordinates[i].row;
        let col = coordinates[i].col;
        let $coor = $(`.side${row}`).find(`#side${col}`);
        $coor.attr('bgcolor', `${fillColor}`);
    }
};


tetris.nextShapePreview = function (shape) {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let $coor = $(`.side${i}`).find(`#side${j}`);
            $coor.attr('bgcolor', ``);
        }
    }
    let coordinates = this.shapeToCoor(shape, { row: 2, col: 2 });
    this.fillSpawnPreview(coordinates, coordinates[0].color);
};


tetris.shapeToCoor = function (shape, origin) {
    if (shape === 'L') {
        return [
                { color: 'orange' },
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row - 1, col: origin.col + 1 }
        ];
    }

    if (shape === "L90") {
        return [
            { color: 'orange'},
            { row: origin.row + 1, col: origin.col },
            { row: origin.row, col: origin.col },
            { row: origin.row - 1, col: origin.col },
            { row: origin.row - 1, col: origin.col - 1 }
        ];
    }

    if (shape === "L180") {
        return [
            { color: 'orange'},
            { row: origin.row, col: origin.col + 1 },
            { row: origin.row, col: origin.col },
            { row: origin.row, col: origin.col - 1 },
            { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === "L270") {
        return [
            { color: 'orange'},
            { row: origin.row - 1, col: origin.col },
            { row: origin.row, col: origin.col },
            { row: origin.row + 1, col: origin.col },
            { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'J') {
        return [
                { color: 'blue'},
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row - 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'J90') {
        return [
                { color: 'blue'},
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'J180') {
        return [
                { color: 'blue'},
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'J270') {
        return [
                { color: 'blue'},
                { row: origin.row + 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row - 1, col: origin.col },
                { row: origin.row - 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'I') {
        return [
                { color: 'cyan'},
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row, col: origin.col + 2 }
        ];
    }

    if (shape === 'I90') {
        return [
                { color: 'cyan'},
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 2, col: origin.col }
        ];
    }

    if (shape === 'O') {
        return [
                { color: 'yellow'},
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'S') {
        return [
                { color: 'green'},
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'S90') {
        return [
                { color: 'green'},
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'Z') {
        return [
            { color: 'red'},
            { row: origin.row, col: origin.col - 1 },
            { row: origin.row, col: origin.col },
            { row: origin.row + 1, col: origin.col },
            { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'Z90') {
        return [
            { color: 'red'},
            { row: origin.row + 1, col: origin.col },
            { row: origin.row, col: origin.col },
            { row: origin.row, col: origin.col + 1 },
            { row: origin.row - 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'T') {
        return [
                { color: 'purple'},
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col - 1},
                { row: origin.row, col: origin.col + 1}
        ];
    }

    if (shape === 'T90') {
        return [
                { color: 'purple'},
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row, col: origin.col - 1}
        ];
    }

    if (shape === 'T180') {
        return [
                { color: 'purple'},
                { row: origin.row + 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col - 1},
                { row: origin.row, col: origin.col + 1}
        ];
    }

    if (shape === 'T270') {
        return [
                { color: 'purple'},
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row, col: origin.col + 1}
        ];
    }
};


tetris.rotate = function () {
    let prevShape = this.currentShape;
    this.fillCells(this.currentCoor, '');

    if (this.currentShape === 'L') {
        this.currentShape = 'L90';
    } else if (this.currentShape === 'L90') {
        this.currentShape = 'L180';
    } else if (this.currentShape === 'L180') {
        this.currentShape = 'L270';
    } else if (this.currentShape === 'L270') {
        this.currentShape = 'L';
    }

    if (this.currentShape === 'J') {
        this.currentShape = 'J90';
    } else if (this.currentShape === 'J90') {
        this.currentShape = 'J180';
    } else if (this.currentShape === 'J180') {
        this.currentShape = 'J270';
    } else if (this.currentShape === 'J270') {
        this.currentShape = 'J';
    }

    if (this.currentShape === 'T') {
        this.currentShape = 'T90';
    } else if (this.currentShape === 'T90') {
        this.currentShape = 'T180';
    } else if (this.currentShape === 'T180') {
        this.currentShape = 'T270';
    } else if (this.currentShape === 'T270') {
        this.currentShape = 'T';
    }

    if (this.currentShape === 'S') {
        this.currentShape = 'S90';
    } else if (this.currentShape === 'S90') {
        this.currentShape = 'S';
    }

    if (this.currentShape === 'Z') {
        this.currentShape = 'Z90';
    } else if (this.currentShape === 'Z90') {
        this.currentShape = 'Z';
    }

    if (this.currentShape === 'I') {
        this.currentShape = 'I90';
    } else if (this.currentShape === 'I90') {
        this.currentShape = 'I';
    }

    this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);

    for (let i = 1; i < this.currentCoor.length; i++) {
        if (this.ifUndo()) {
            this.currentShape = prevShape;
        }
    }

    SFXRotate.play();
    this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
    this.fillCells(this.currentCoor, this.currentCoor[0].color);
};


tetris.ifUndo = function () {
    for (let i = 1; i < this.currentCoor.length; i++) {
        let row = this.currentCoor[i].row;
        let col = this.currentCoor[i].col;
        let $coor = $(`.${row}`).find(`#${col}`);
        if (row < 0 && (col >= 0 && col < 10)) {
            return false;
        }

        if ($coor.length === 0 ||
            jQuery.inArray($coor.attr('bgcolor'), this.colors) >= 0 ||
            $coor.attr('blocked') === 'true') {
                return true;
        }
    }
    return false;
};


tetris.pauseGame = function () {
    let $play = $('.play');
    let $pause = $('.pause');
    if (tetris.isPaused === true) {
        $play.removeClass('play');
        $play.addClass('pause');
        $play.html('Pause');
        tetris.isPaused = false;
    } else if (tetris.isPaused === false){
        $pause.removeClass('pause');
        $pause.addClass('play');
        $pause.html('Play');
        tetris.isPaused = true;
    }
};


tetris.gameOver = function () {
    this.ended = true;
    this.pauseGame();
    SFXGameOver.play();
    document.getElementById('background_audio').muted = true;
    $('.gameover').addClass('visible');
};


$(document).ready(function () {
    tetris.drawPlayField();
    tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);
    tetris.nextShapePreview(tetris.nextShape);
    tetris.fillCells(tetris.currentCoor, 'blue');
    tetris.isPaused = true;
    tetris.ended = false;
    tetris.muted = false;

    let music = document.getElementById("background_audio");
    music.volume = 0.2;


    // instuctions modal
    let modal = document.getElementById('myModal');
    let btn = document.getElementById("myBtn");
    let span = document.getElementsByClassName("close")[0];
    let $playAgain = $('.playAgain');
    let $gameOver = $('.gameover');
    let $playMusic = $('.play-music');
    let $pauseMusic = $('.pause-music');
    $playMusic.hide();

    btn.onclick = function() {
        if (tetris.isPaused === false){
            let $pause = $('.pause');
            $pause.removeClass('pause');
            $pause.addClass('play');
            $pause.html('Play');
            tetris.isPaused = true;
        }
        modal.style.display = "block";
    };

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
        if (event.target === $playAgain[0]) {
            tetris.ended = false;
            tetris.clearBoard();
            $gameOver.removeClass('visible');
            if (tetris.muted === false) {
                document.getElementById('background_audio').muted = false;
            }
        }
        if (event.target === $playMusic[0]) {
            document.getElementById('background_audio').muted = false;
            $playMusic.hide();
            $pauseMusic.show();
            tetris.muted = false;
        }
        if (event.target === $pauseMusic[0]) {
            document.getElementById('background_audio').muted = true;
            $pauseMusic.hide();
            $playMusic.show();
            tetris.muted = true;
        }
    };

    // controls
    $(document).keydown(function (e) {

        if (tetris.isPaused === false) {
            if (e.keyCode === 37) {
                tetris.move('left');
            } else if (e.keyCode === 39) {
                tetris.move('right');
            } else if (e.keyCode === 38) {
                tetris.rotate();
            } else if (e.keyCode === 40) {
                tetris.score += 5;
                tetris.setScore();
                SFXSoftDrop.play();
                tetris.drop();
            } else if (e.keyCode === 16) {
                tetris.holdPiece();
            }
        }

        if (e.keyCode === 27) {
            tetris.pauseGame();
        }
    });

    let gravity = function() {
        let $play = $('.play');
        let $pause = $('.pause');
        $play.on('click', function(e) {
            e.preventDefault();

            $play.removeClass('play');
            $play.addClass('pause');
            $play.html('Pause');
            tetris.isPaused = false;
        });

        $pause.on('click', function(e) {
            e.preventDefault();

            $pause.removeClass('pause');
            $pause.addClass('play');
            $pause.html('Play');
            tetris.isPaused = true;
        });

        if (!tetris.isPaused) {
            tetris.drop();
        }
        window.setTimeout(gravity, 500 - (tetris.speed * 50));
    };
    window.setTimeout(gravity, 500 - (tetris.speed * 50));
});
