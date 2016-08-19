# Tetris

[Heroku link][heroku]

[heroku]: https://www.google.com

## Minimum Viable Product

a.	myTetris will be my take on the classic block dropping game. There are 7 different shaped blocks that the user must place in such a way that they fit together. When an entire row is filled, those blocks are destroyed and the remaining blocks fall into their place. myTetris should satisfy:


- [ ] 7 different shaped/colored blocks
- [ ] should have game board that is a tall rectangle
- [ ] blocks should not be able to leave the game board
- [ ] should have a preview of next block
- [ ] should have score based on how many rows are deleted
- [ ] blocks should land on each other (not go through)
- [ ] should have smooth transitions and follow user input
- [ ] controls listed
- [ ] potential music?
- [ ] once a block is off the top of the screen, the game is over


## Design Docs
* [View Wireframes][views]

[views]: docs/views

## Implementation Timeline

### Phase 1: Build game pieces

**Objective:** Create 7 different blocks and game board

- [ ] map key input to game actions
- [ ] create game board
- [ ] create 7 individual blocks

### Phase 2: Game physics

**Objective:** Work out the physics of the dropping blocks

- [ ] speed up after 10 cleared rows
- [ ] create score based on cleared rows
- [ ] create game over screen

### Phase 3: Finish up remaining features

**Objective:** Implement music and high scores

- [ ] create mute/unmute button
- [ ] create high score using cookies
- [ ] shadow where block will land



[phase-one]: docs/phases/phase1.md
[phase-two]: docs/phases/phase2.md
[phase-three]: docs/phases/phase3.md
