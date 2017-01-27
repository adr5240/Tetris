const Pieces = {

    constructor() {
        this.shapes = ['L', 'L', 'L', 'L',
                       'J', 'J', 'J', 'J',
                       'O', 'O', 'O', 'O',
                       'T', 'T', 'T', 'T',
                       'S', 'S', 'S', 'S',
                       'Z', 'Z', 'Z', 'Z',
                       'I', 'I', 'I', 'I'];
    },

    shapeToCoor: function (shape, origin) {
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
    }
};

module.exports = Pieces;
