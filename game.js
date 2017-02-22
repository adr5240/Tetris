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


$(document).ready(function () {
    window.myStorage = localStorage;
    if (myStorage.length === 0) {
        myStorage.setItem('highscore1', 20000);
        myStorage.setItem('highscore2', 15000);
        myStorage.setItem('highscore3', 10000);
        myStorage.setItem('highscore4', 5000);
        myStorage.setItem('highscore5', 1000);

        myStorage.setItem('name1', 'Oliver');
        myStorage.setItem('name2', 'Jess');
        myStorage.setItem('name3', 'Sarah');
        myStorage.setItem('name4', 'John');
        myStorage.setItem('name5', 'Tom');

        myStorage.setItem('lines1', 35);
        myStorage.setItem('lines2', 28);
        myStorage.setItem('lines3', 18);
        myStorage.setItem('lines4', 9);
        myStorage.setItem('lines5', 2);

    }

    for (var i = 1; i <= 5; i++) {
        $(`.hs${i}`).html(myStorage.getItem(`highscore${i}`));
        $(`.name${i}`).html(myStorage.getItem(`name${i}`));
        $(`.lines${i}`).html(myStorage.getItem(`lines${i}`));
    }

    let game = new Tetris();

    game.drawPlayField();
    game.currentCoor = game.piece.shapeToCoor(game.currentShape, game.origin);
    game.nextShapePreview(game.nextShape);
    game.fillCells(game.currentCoor, 'blue');
    game.isPaused = true;
    game.ended = false;
    game.muted = false;

    let music = document.getElementById("background_audio");
    music.volume = 1;


    // instuctions modal
    let modal = document.getElementById('myModal');
    let hsmodal = document.getElementById('hsModal');
    let btn = document.getElementById("myBtn");
    let hsbtn = document.getElementById("highscoresBtn");
    let span = document.getElementsByClassName("close")[0];
    let hsspan = document.getElementsByClassName("close")[1];
    let $playAgain = $('.playAgain');
    let $gameOver = $('.gameover');
    let $playMusic = $('.play-music');
    let $pauseMusic = $('.pause-music');
    $playMusic.hide();

    btn.onclick = function() {
        if (game.isPaused === false){
            let $pause = $('.pause');
            $pause.removeClass('pause');
            $pause.addClass('play');
            $pause.html('Play');
            game.isPaused = true;
        }
        modal.style.display = "block";
    };

    hsbtn.onclick = function () {
        if (game.isPaused === false){
            let $pause = $('.pause');
            $pause.removeClass('pause');
            $pause.addClass('play');
            $pause.html('Play');
            game.isPaused = true;
        }
        hsmodal.style.display = "block";
    };

    span.onclick = function() {
        modal.style.display = "none";
    };

    hsspan.onclick = function () {
        hsmodal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal || event.target == hsmodal) {
            modal.style.display = "none";
            hsmodal.style.display = "none";
        }
        if (event.target === $playAgain[0]) {
            game.ended = false;
            game.clearBoard();
            $gameOver.removeClass('visible');
            if (game.muted === false) {
                document.getElementById('background_audio').muted = false;
            }

            game.pauseGame();
        }
        if (event.target === $playMusic[0]) {
            document.getElementById('background_audio').muted = false;
            $playMusic.hide();
            $pauseMusic.show();
            game.muted = false;
        }
        if (event.target === $pauseMusic[0]) {
            document.getElementById('background_audio').muted = true;
            $pauseMusic.hide();
            $playMusic.show();
            game.muted = true;
        }
    };

    // controls
    $(document).keydown(function (e) {

        if (game.isPaused === false) {
            if (e.keyCode === 37) {
                e.preventDefault();
                game.move('left');
            } else if (e.keyCode === 39) {
                e.preventDefault();
                game.move('right');
            } else if (e.keyCode === 38) {
                e.preventDefault();
                game.rotate();
            } else if (e.keyCode === 40) {
                e.preventDefault();
                game.score += 5;
                game.setScore();
                SFXSoftDrop.play();
                game.drop();
            } else if (e.keyCode === 32){
                e.preventDefault();
                game.hardDrop();
            } else if (e.keyCode === 16) {
                e.preventDefault();
                game.holdPiece();
            }
        }

        if (e.keyCode === 27) {
            game.pauseGame();
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
            game.isPaused = false;
        });

        $pause.on('click', function(e) {
            e.preventDefault();

            $pause.removeClass('pause');
            $pause.addClass('play');
            $pause.html('Play');
            game.isPaused = true;
        });

        if (!game.isPaused) {
            game.drop();
        }
        window.setTimeout(gravity, 500 - (game.speed * 50));
    };
    window.setTimeout(gravity, 500 - (game.speed * 50));

});
