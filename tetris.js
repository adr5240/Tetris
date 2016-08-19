let tetris = {};
tetris.origin = { row: 5, col: 5 };


tetris.drawPlayField = function () {
    for (let row = 0; row < 20; row++) {
        $('#playfield').append(`<tr class=${row}></tr>`);
        for (let col = 0; col < 10; col++) {
            $(`.${row}`).append(`<td id=${col}></td>`);
        }
    }
};


tetris.fillCells = function(coordinates, fillColor) {
    for (let i = 0; i < coordinates.length; i++) {
        let row = coordinates[i].row;
        let col = coordinates[i].col;
        let $coor = $(`.${row}`).find(`#${col}`);
        $coor.attr('bgcolor', fillColor);
    }
};


tetris.move = function(direction){
    var reverse = false;

    this.fillCells(this.currentCoor,'');

    for(var i = 0; i < this.currentCoor.length; i++){
        if(direction === 'right'){
            this.currentCoor[i].col++;
            if(this.currentCoor[i].col > 9){
                reverse = true;
            }
        } else if (direction === 'left'){
            this.currentCoor[i].col--;
            if(this.currentCoor[i].col < 0){
                reverse = true;
            }
        }
    }

    if (direction === 'right') {
        this.origin.col++;
    } else if (direction === 'left') {
        this.origin.col--;
    }

    this.fillCells(this.currentCoor, 'black');

    if(reverse && direction === 'left'){
        this.move('right');
    } else if (reverse && direction === 'right'){
        this.move('left');
    }
};


tetris.shapeToCoor = function (shape, origin) {
    if (shape === 'L') {
        return [
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row - 1, col: origin.col + 1 }
        ];
    }

    if (shape === "L90") {
        return [
            { row: origin.row + 1, col: origin.col },
            { row: origin.row, col: origin.col },
            { row: origin.row - 1, col: origin.col },
            { row: origin.row - 1, col: origin.col - 1 }
        ];
    }

    if (shape === "L180") {
        return [
            { row: origin.row, col: origin.col + 1 },
            { row: origin.row, col: origin.col },
            { row: origin.row, col: origin.col - 1 },
            { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === "L270") {
        return [
            { row: origin.row - 1, col: origin.col },
            { row: origin.row, col: origin.col },
            { row: origin.row + 1, col: origin.col },
            { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'J') {
        return [
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row - 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'J90') {
        return [
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'J180') {
        return [
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'J270') {
        return [
                { row: origin.row + 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row - 1, col: origin.col },
                { row: origin.row - 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'I') {
        return [
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row, col: origin.col + 2 }
        ];
    }

    if (shape === 'I90') {
        return [
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 2, col: origin.col }
        ];
    }

    if (shape === 'O') {
        return [
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'S') {
        return [
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row + 1, col: origin.col - 1 }
        ];
    }

    if (shape === 'S90') {
        return [
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'Z') {
        return [
            { row: origin.row, col: origin.col - 1 },
            { row: origin.row, col: origin.col },
            { row: origin.row + 1, col: origin.col },
            { row: origin.row + 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'Z90') {
        return [
            { row: origin.row + 1, col: origin.col },
            { row: origin.row, col: origin.col },
            { row: origin.row, col: origin.col + 1 },
            { row: origin.row - 1, col: origin.col + 1 }
        ];
    }

    if (shape === 'T') {
        return [
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col - 1},
                { row: origin.row, col: origin.col + 1}
        ];
    }

    if (shape === 'T90') {
        return [
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row + 1, col: origin.col },
                { row: origin.row, col: origin.col - 1}
        ];
    }

    if (shape === 'T180') {
        return [
                { row: origin.row + 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col - 1},
                { row: origin.row, col: origin.col + 1}
        ];
    }

    if (shape === 'T270') {
        return [
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

    for (let i = 0; i < this.currentCoor.length; i++) {
        if (this.currentCoor[i].col < 0 || this.currentCoor[i].col > 9) {
            this.currentShape = prevShape;
        }
    }

    this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
    this.fillCells(this.currentCoor, 'blue');
};


tetris.currentShape = 'J';

$(document).ready(function () {
    tetris.drawPlayField();
    tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);
    tetris.fillCells(tetris.currentCoor, 'blue');

    $(document).keydown(function (e) {
        if (e.keyCode === 37) {
            tetris.move('left');
        } else if (e.keyCode === 39) {
            tetris.move('right');
        } else if (e.keyCode === 38) {
            tetris.rotate();
        }
    });
});
