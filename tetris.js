let tetris = {};
tetris.origin = { row: 5, col: 5 };
tetris.currentShape = 'J';


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
                { row: origin.row, col: origin.col -1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row - 1, col: origin.col + 1 }
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

    if (shape === 'I') {
        return [
                { row: origin.row, col: origin.col - 1 },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col + 1 },
                { row: origin.row, col: origin.col + 2 }
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

    if (shape === 'T') {
        return [
                { row: origin.row - 1, col: origin.col },
                { row: origin.row, col: origin.col },
                { row: origin.row, col: origin.col - 1},
                { row: origin.row, col: origin.col + 1}
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
};


$(document).ready(function () {
    tetris.drawPlayField();
    tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);
    tetris.fillCells(tetris.currentCoor, 'blue');

    $(document).keydown(function (e) {
        if (e.keyCode === 37) {
            tetris.move('left');
        } else if (e.keyCode === 39) {
            tetris.move('right');
        }
    });
});
