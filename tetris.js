let tetris = {};

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
        for (let sideCol = 0; sideCol < 5; sideCol++) {
            $(`.side${sideRow}`).append(`<td id=side${sideCol}></td>`);
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
        }

        this.fillCells(this.currentCoor, this.currentCoor[0].color);
        this.clearRow();
        this.spawn();
    }
};





tetris.clearRow = function () {
    let drops = 0;

    for (let row = 19; row >= 0; row--) {
        let rowIsFull = true;

        for(let col = 0; col < 10; col++) {
            var $coor = $(`.${row}`).find(`#${col}`);
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
        let level = this.lines % 5;
        this.score += 1000 * drops;
        this.lines += drops;
        if (level === 0) {
            this.speed += 1;
        }
        this.setScore();
    }
};


tetris.setScore = function () {
    let $points = $('#points');
    let $linesCleared = $('#linesCleared');

    $points.html(this.score);
    $linesCleared.html(this.lines);
};


tetris.spawn = function () {
    if (this.shapes === undefined || this.shapes.length <= 1) {
        this.shapes = [];
        for (var i = 0; i < window.shapes.length; i++) {
            this.shapes.push(window.shapes[i]);
        }
    }

    let randomIdx = Math.floor(Math.random() * this.shapes.length);
    this.currentShape = this.nextShape;
    this.nextShape = this.shapes.splice(randomIdx, 1)[0];
    this.nextShapePreview(this.nextShape);
    this.origin = { row: -2, col: 5 };
    this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
};


tetris.fillPreview = function (coordinates, fillColor) {
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
    this.fillPreview(coordinates, coordinates[0].color);
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
    $('.gameover').addClass('visible');

};


$(document).ready(function () {
    tetris.drawPlayField();
    tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);
    tetris.nextShapePreview(tetris.nextShape);
    tetris.fillCells(tetris.currentCoor, 'blue');
    tetris.isPaused = true;

    $(document).keydown(function (e) {
        if (e.keyCode === 37) {
            tetris.move('left');
        } else if (e.keyCode === 39) {
            tetris.move('right');
        } else if (e.keyCode === 38) {
            tetris.rotate();
        } else if (e.keyCode === 40) {
            tetris.drop();
        } else if (e.keyCode === 27) {
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
