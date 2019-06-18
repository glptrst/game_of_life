/* 
   Generations are represented with arrays of 1s and 0s, where 1 is a live
   cell and 0 a dead cell.
   
   Generations are displayed in a grid of checkboxes, where a checked checkbox
   is a live cell and an unchecked checkbox is a dead cell.

   Rules:
   Any live cell with fewer than two or more than three live neighbors dies.
   Any live cell with two or three live neighbors lives on to the next generation.
   Any dead cell with exactly three live neighbors becomes a live cell.
   
   To decide what will happen to a cell we need a method to find its
   neighbors. This is my method. The following are the neighbors of a cell
   `cell`, in a grid n x n:

   cell + 1. Unless cell is in the last column.

   cell -1. Unless cell is in the first column.

   cell + (n - 1). Unless cell is in the first column or in the last row.

   cell - (n - 1). Unless cell is in the first row or in the last column.

   cell + n. Unless cell is in the last row.

   cell - n. Unless cell is in the first row.

   cell + (n + 1). Unless cell is in the last column or in the last row.

   cell - (n + 1) Unless cell is in the first row or in the first column.

*/

let autoInterval; // it should always be 1 or undefined

// Create grid
createGrid();

// Create life
let currentGeneration = createGen(50);
updateGrid(currentGeneration);

let stopButton = document.getElementById('stop');
stopButton.addEventListener('click', () => {
    clearInterval(autoInterval);
    autoInterval = undefined;
});

let resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
    clearInterval(autoInterval);
    autoInterval = undefined;
    currentGeneration = createGen(50);
    updateGrid(currentGeneration);
});

let startButton = document.getElementById('start');
startButton.addEventListener('click', () => {
    if (!autoInterval) { // if interval it's not on (it's undefined)
	autoInterval = setInterval(() => {
	    currentGeneration = nextGeneration(currentGeneration);
	    updateGrid(currentGeneration);
	}, 175);
    }
});

let clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
    clear();
});

let gosperGliderGunButton = document.getElementById('gosperGliderGun');
gosperGliderGunButton.addEventListener('click', () => {
    clearInterval(autoInterval);
    autoInterval = undefined;
    currentGeneration = createGen(50, gosperGliderGun);
    updateGrid(currentGeneration);
});

let checkboxes = document.querySelectorAll('input');
for (let checkbox of checkboxes) {
    checkbox.addEventListener('click', (ev) => {
	if (ev.target.checked) // if cell was dead
	    currentGeneration[ev.target.id] = 1;
	else // if cell was live
	    currentGeneration[ev.target.id] = 0;
    });
}

// Take generation, return next generation.
function nextGeneration(current, n = 50) {
    let next = [];

    for (let x = 0; x < n; x++) {
	for (let y = 0; y < n; y++) {
	    let cell = x*n + y;
	    if (x === n) {
		if (y === n) { // if it's last row and last column
		    neighborIndexes = [cell - 1, cell - n, cell - (n + 1)];
		    neighborValues = values(current, neighborIndexes);
		    next.push(updateCell(current[cell], neighborValues));
		} else if (y === 0) { // if it's first row and last column
		    neighborIndexes = [cell -1, cell + (n -1), cell + n];
		    neighborValues = values(current, neighborIndexes);;
		    next.push(updateCell(current[cell], neighborValues));
		} else { // if it's only last column
		    neighborIndexes = [cell - 1, cell + (n - 1), cell + n, cell - n, cell - (n + 1)];
		    neighborValues = values(current, neighborIndexes);;
		    next.push(updateCell(current[cell], neighborValues));
		}
	    } else if (x === 0) {
		if (y === 0) { // if it's first row and first column
		    neighborIndexes = [cell + 1, cell + n, cell + (n +1)];
		    neighborValues = values(current, neighborIndexes);;
		    next.push(updateCell(current[cell], neighborValues));
		} else if (y === n) { // if it's last row and first column
		    neighborIndexes = [cell + 1, cell - (n - 1), cell - n];
		    neighborValues = values(current, neighborIndexes);;
		    next.push(updateCell(current[cell], neighborValues));
		} else { // if it's first column
		    neighborIndexes = [cell + 1, cell - (n -1), cell + n, cell - n, cell + (n + 1)];
		    neighborValues = values(current, neighborIndexes);;
		    next.push(updateCell(current[cell], neighborValues));
		}
	    } else if (y === n) { // if it's last row
		neighborIndexes = [cell + 1, cell -1, cell - (n - 1), cell -n, cell - (n + 1)];
		neighborValues = values(current, neighborIndexes);;
		next.push(updateCell(current[cell], neighborValues));
	    } else if (y === 0) { // if it's first row
		neighborIndexes = [cell + 1, cell - 1, cell + (n - 1), cell + n, cell + (n + 1)];
		neighborValues = values(current, neighborIndexes);;
		next.push(updateCell(current[cell], neighborValues));
	    } else { // if it's neither first/last column, nor first/last row
		neighborIndexes = [cell + 1, cell -1, cell + (n - 1), cell - (n - 1), cell + n, cell - n,
				   cell + (n + 1), cell - (n + 1)];
		neighborValues = values(current, neighborIndexes);;
		next.push(updateCell(current[cell], neighborValues));
	    }
	}
    }
    return next;
}

// Take cell (0 or 1) and array of neighbors (0s and 1s), return updated cell.
function updateCell(cell, neighbors) {
    let liveNeighbors = 0;
    for (n of neighbors)
	if (n === 1)
	    liveNeighbors++;

    if (cell === 1) {
	if (liveNeighbors < 2 || liveNeighbors > 3)
	    return 0; // cell dies :(
	else if (liveNeighbors === 2 || liveNeighbors == 3)
	    return 1; // cell keeps surviving :)
    } else if (cell === 0) {
	if (liveNeighbors === 3)
	    return 1; // cell becomes alive :O
	else
	    return 0;
    }
}

// Take array of values and an array of indexes of those values.
// Return array of the values of those indexes.
// Example: 
// [a, b, c], [0, 2] => [a, c]
function values(array, indexes) {
    let result = [];
    for (let i = 0; i < indexes.length; i++) {
	result.push(array[indexes[i]]);
    }
    return result;
}

// Take generation. Change grid accordingly.
function updateGrid(generation, rows = 50) {
    if (generation.length !== rows * rows) console.log('Error 1');
    let cells = Array.from(document.querySelectorAll('input'));
    for (let i = 0; i < generation.length; i++) {
	if (generation[i] === 1) {
	    cells[i].checked = 'true';
	} else {
	    cells[i].checked = '';
	}
    }
}


// Create grid of checkboxes.
function createGrid(n = 50) {
    let grid = document.querySelector('#grid');

    for (let i = 0; i < n; i++) {
	let row = document.createElement('div');
	for (let j = 0; j < n; j++) {
	    let checkbox = document.createElement('input');
	    checkbox.type = 'checkbox';
	    checkbox.id = i === 0 ? j : j + (n*i);
	    row.appendChild(checkbox);
	}
	grid.appendChild(row);
    }
}

// Return random generation.
function life(rows = 50) {
    let totalCellNumber = rows * rows; 
    let gen = [];
    for (let i = 0; i < totalCellNumber; i++) {
	if (Math.random() > 0.7) gen.push(1);
	else gen.push(0);
    }
    return gen;
}

// clear grid
function clear(n = 50) {
    clearInterval(autoInterval);
    autoInterval = undefined;
    let gen = [];
    for (let i = 0; i < n*n; i++) {
	gen.push(0);
    }
    currentGeneration = gen;
    updateGrid(currentGeneration);
}

// Take number of rows and string input. Create generation, random
// generation if not input is given.
// Inputs are strings of 0s and 1s, white spaces are ignored.
function createGen(rows, input) {
    if (!input) {
	let totalCellNumber = rows * rows; 
	let gen = [];
	for (let i = 0; i < totalCellNumber; i++) {
	    if (Math.random() > 0.7) gen.push(1);
	    else gen.push(0);
	}
	return gen;
    } else {
	if (rows != input.split('\n')[0].length)
	    throw new Error('wrong rows for input given');
	let gen = [];
	input = input.split('\n').map((r)=> skipSpace(r)).join('');
	for (let i = 0; i < rows*rows; i++) {
	    if (input[i] === '0') gen.push(0);
	    else gen.push(1);
	}
	return gen;
    }
}

function skipSpace(string) {
    let first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
}

