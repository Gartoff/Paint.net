const grid = document.getElementById('grid');
const clearBtn = document.getElementById('clear');
const colorPicker = document.getElementById('colorPicker');
const gridSizeInput = document.getElementById('gridSize');
const drawBtn = document.getElementById('draw');
const fillBtn = document.getElementById('fill');

let currentColor = '#000000';
let isDrawing = false;
let gridSize = localStorage.getItem('gridSize') ? parseInt(localStorage.getItem('gridSize')) : 30;
let drawMode = 'normal';

function createGrid() {
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 20px)`;
  grid.style.gridTemplateRows = `repeat(${gridSize}, 20px)`;

  for (let i = 0; i < gridSize * gridSize; i++) {
    const pixel = document.createElement('div');
    pixel.addEventListener('mousedown', startDrawing);
    pixel.addEventListener('mouseenter', draw);
    grid.appendChild(pixel);
  }
}

function startDrawing(event) {
  isDrawing = true;
  draw(event);
}

function stopDrawing() {
  isDrawing = false;
}

function draw(event) {
  if (isDrawing) {
    if (drawMode === 'normal') {
      event.target.style.backgroundColor = currentColor;
    } else if (drawMode === 'fill') {
      fill();
    }
    saveDrawing();
  }
}

function fill() {
  document.querySelectorAll('#grid div').forEach(pixel => {
    pixel.style.backgroundColor = currentColor;
  });
}

function saveDrawing() {
  const pixelColors = Array.from(document.querySelectorAll('#grid div')).map(pixel => pixel.style.backgroundColor);
  localStorage.setItem('savedGrid', JSON.stringify(pixelColors));
}

function loadDrawing() {
  const savedGrid = JSON.parse(localStorage.getItem('savedGrid'));
  if (!savedGrid) return;
  document.querySelectorAll('#grid div').forEach((pixel, index) => {
    pixel.style.backgroundColor = savedGrid[index] || 'white';
  });
}

colorPicker.addEventListener('input', (event) => {
  currentColor = event.target.value;
});

gridSizeInput.value = gridSize;
gridSizeInput.addEventListener('input', (event) => {
  gridSize = parseInt(event.target.value);
  localStorage.setItem('gridSize', gridSize);
  createGrid();
});

drawBtn.addEventListener('click', () => {
  drawMode = 'normal';
  drawBtn.classList.add('active');
  fillBtn.classList.remove('active');
});

fillBtn.addEventListener('click', () => {
  drawMode = 'fill';
  fillBtn.classList.add('active');
  drawBtn.classList.remove('active');
});

clearBtn.addEventListener('click', () => {
  document.querySelectorAll('#grid div').forEach(pixel => pixel.style.backgroundColor = 'white');
  saveDrawing();
});

document.body.addEventListener('mouseup', stopDrawing);

createGrid();
loadDrawing();
