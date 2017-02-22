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

class Tetris {

    constructor() {
        this.piece = new Pieces();
        this.currentShape = this.piece.shapes[ Math.floor(Math.random() * this.piece.shapes.length) ];
        this.nextShape = this.piece.shapes[ Math.floor(Math.random() * this.piece.shapes.length) ];
        this.origin = { row: -2, col: 5 };
        this.colors = ['PURPLE', 'ORANGE', 'YELLOW', 'GREEN', 'RED', 'CYAN', 'BLUE'];
        this.score = 0;
        this.lines = 0;
        this.speed = 0;
    }

    clearBoard() {

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
    }

    clearRow() {
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
                    $newCoor.attr('bgcolor', ($coor.attr('bgcolor') || ''));
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
    }


    drawPlayField() {
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
    }


    drop() {
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
                    this.gameOver();
                }
            }

            this.fillCells(this.currentCoor, this.currentCoor[0].color);
            this.clearRow();
            this.spawn();
        }
    }


    fillCells(coordinates, fillColor) {
        for (let i = 1; i < coordinates.length; i++) {
            let row = coordinates[i].row;
            let col = coordinates[i].col;
            let $coor = $(`.${row}`).find(`#${col}`);
            $coor.attr('bgcolor', `${fillColor}`);
        }
    }


    fillHoldPreview(coordinates, fillColor) {
        for (let i = 1; i < coordinates.length; i++) {
            let row = coordinates[i].row;
            let col = coordinates[i].col;
            let $coor = $(`.hold${row}`).find(`#hold${col}`);
            $coor.attr('bgcolor', `${fillColor}`);
        }
    }


    fillSpawnPreview(coordinates, fillColor) {
        for (let i = 1; i < coordinates.length; i++) {
            let row = coordinates[i].row;
            let col = coordinates[i].col;
            let $coor = $(`.side${row}`).find(`#side${col}`);
            $coor.attr('bgcolor', `${fillColor}`);
        }
    }


    gameOver() {
        this.ended = true;
        this.pauseGame();
        this.setHighscore();
        SFXGameOver.play();
        document.getElementById('background_audio').muted = true;
        $('.gameover').addClass('visible');
    }


    hardDrop() {

        this.fillCells(this.currentCoor, '');
        let blocked = false;

        while(!(blocked || this.ifUndo())) {
            blocked = false;
            for (let i = 1; i < this.currentCoor.length; i++) {
                let $coor = $(`.${this.currentCoor[1].row}`).find(`#${this.currentCoor[1].col}`);
                if ($coor.attr('blocked') === 'true') {
                    blocked = true;
                }
                this.currentCoor[i].row++;
            }
            this.origin.row++;
            this.score += 10;
        }

        for (let j = 1; j < this.currentCoor.length; j++) {
            this.currentCoor[j].row--;
        }
        this.fillCells(this.currentCoor, this.currentCoor[0].color);

        for (let k = 1; k < this.currentCoor.length; k++) {
            let $coor = $(`.${this.currentCoor[k].row}`).find(`#${this.currentCoor[k].col}`);
            $coor.attr('blocked', 'true');
            if (this.currentCoor[k].row < 0 && !this.ended) {
                this.gameOver();
            }
        }

        this.score -= 10;
        this.setScore();

        this.clearRow();
        this.spawn();

        SFXHardDrop.play();
    }


    holdPiece() {

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
            this.currentCoor = this.piece.shapeToCoor(this.currentShape, this.origin);
        }
    }


    holdPreview(shape) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let $coor = $(`.hold${i}`).find(`#hold${j}`);
                $coor.attr('bgcolor', ``);
            }
        }
        let coordinates = this.piece.shapeToCoor(shape, { row: 2, col: 2 });
        this.fillHoldPreview(coordinates, coordinates[0].color);
    }


    ifUndo() {
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
    }



    move(direction){

        this.fillCells(this.currentCoor,'');
        if (direction === 'right') {
            this.origin.col++;
        } else if (direction === 'left') {
            this.origin.col--;
        }

        this.currentCoor = this.piece.shapeToCoor(this.currentShape, this.origin);

        if(this.ifUndo()) {
            if (direction === 'right') {
                this.origin.col--;
            } else if (direction === 'left'){
                this.origin.col++;
            }
        } else {
            SFXPieceMoveLR.play();
        }

        this.currentCoor = this.piece.shapeToCoor(this.currentShape, this.origin);
        this.fillCells(this.currentCoor, this.currentCoor[0].color);
    }


    nextShapePreview (shape) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                let $coor = $(`.side${i}`).find(`#side${j}`);
                $coor.attr('bgcolor', ``);
            }
        }
        let coordinates = this.piece.shapeToCoor(shape, { row: 2, col: 2 });
        this.fillSpawnPreview(coordinates, coordinates[0].color);
    }


    pauseGame() {
        let $play = $('.play');
        let $pause = $('.pause');
        if (this.isPaused === true) {
            $play.removeClass('play');
            $play.addClass('pause');
            $play.html('Pause');
            this.isPaused = false;
        } else if (this.isPaused === false){
            $pause.removeClass('pause');
            $pause.addClass('play');
            $pause.html('Play');
            this.isPaused = true;
        }
    }


    rotate() {
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

        this.currentCoor = this.piece.shapeToCoor(this.currentShape, this.origin);

        for (let i = 1; i < this.currentCoor.length; i++) {
            if (this.ifUndo()) {
                this.currentShape = prevShape;
            }
        }

        SFXRotate.play();
        this.currentCoor = this.piece.shapeToCoor(this.currentShape, this.origin);
        this.fillCells(this.currentCoor, this.currentCoor[0].color);
    }


    setHighscore() {
        let newHighscore = (this.score > myStorage.getItem('highscore5'));
        let i = 5;
        let name;

        while (newHighscore && i > 0) {
            name = name || prompt("You set a new highscore! Please enter your name!", "AAA");
            if (i === 5) {
                myStorage.setItem('highscore5', this.score);
                myStorage.setItem('name5', name);
                myStorage.setItem('lines5', this.lines);
            } else if (this.score > myStorage.getItem(`highscore${i}`)) {
                let scoreHold = myStorage.getItem(`highscore${i}`);
                let nameHold = myStorage.getItem(`name${i}`);
                let linesHold = myStorage.getItem(`lines${i}`);

                myStorage.setItem(`highscore${i}`, this.score);
                myStorage.setItem(`name${i}`, name);
                myStorage.setItem(`lines${i}`, this.lines);

                myStorage.setItem(`highscore${i + 1}`, scoreHold);
                myStorage.setItem(`name${i + 1}`, nameHold);
                myStorage.setItem(`lines${i + 1}`, linesHold);
                newHighscore = (this.score >= myStorage.getItem(`highscore${i - 1}`));
            } else {
                newHighscore = false;
            }
            i--;
        }

        for (var k = 1; k <= 5; k++) {
            $(`.hs${k}`).html(myStorage.getItem(`highscore${k}`));
            $(`.name${k}`).html(myStorage.getItem(`name${k}`));
            $(`.lines${k}`).html(myStorage.getItem(`lines${k}`));
        }
    }


    setScore() {
        let $points = $('#points');
        let $linesCleared = $('#linesCleared');

        $points.html(this.score);
        $linesCleared.html(this.lines);
    }


    spawn() {
        if (this.shapes === undefined || this.shapes.length <= 1) {
            this.shapes = [];
            for (let i = 0; i < this.piece.shapes.length; i++) {
                this.shapes.push(this.piece.shapes[i]);
            }
        }

        let randomIdx = Math.floor(Math.random() * this.shapes.length);
        this.currentShape = this.nextShape;
        this.nextShape = this.shapes.splice(randomIdx, 1)[0];
        this.nextShapePreview(this.nextShape);
        this.origin = { row: -2, col: 5 };
        this.swapped = false;
        this.currentCoor = this.piece.shapeToCoor(this.currentShape, this.origin);
    }
}
