# Tetris

[Play the game here][live]

[live]: https://www.adam-reiter/Tetris.com

## Features


Falling blocks uses only HTML5, CSS3, and jQuery to run smoother than the original. Only the important
components are re-renders which greatly improves performance. The User can save their high score in
their local browser's cache so they can always strive to be better. The scoring of Falling Blocks is dynamic, meaning it
is based off of lines cleared as well as how far the user hard/soft drops blocks. This can lead to an ever changing way of
attaining the high scores. FB also uses a classical take on the original theme song so the user can play and not be stuck in
silence. However, they are able to mute and unmute the song incase they have their own tunes to listen to.


## Screenshot
![Live Game](./images/game.jpg?raw=true)


## A few methods used

### Move
![Move Method](./images/move.png?raw=true)

This method is used to move the blocks left and right. #ifUndo() checks to see if the block is out of bounds.
If it returns true, it simply moves the shape back to its original position.

### Window.shapes
![window.shapes](./images/shapes.png?raw=true)

The following method is reliant on this array. It makes the next spawned piece be as random as possible while making sure
the user will see an equal number of every piece available to them.

### Spawn
![Spawn Method](./images/spawn.png?raw=true)

The spawn method is used to create a new block as well as create a preview for the following block. This populates the Next Block
preview box for the user. There is also a this.swapped that is set to false so that the user can then hold this new piece. The origin
places the piece above the board so that it looks like it is falling into place, and only after all of this is the block finally drawn.

### Gravity
![Gravity Method](./images/gravity.png?raw=true)

The gravity method uses the setTimeout function to continually be called until the game ends. I used setTimeout instead of setInterval
so that the game could increase speed the further along the user got. It also allows the user to pause and un-pause the game.
