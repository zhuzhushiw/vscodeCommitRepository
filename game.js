class Game2048 {
    constructor(gridSize = 4) {
        this.gridSize = gridSize;
        this.grid = [];
        this.score = 0;
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.setupEventListeners();
        this.renderGrid();
    }

    initGrid() {
        this.grid = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(0)
        );
    }

    addRandomTile() {
        const emptyCells = [];
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (this.grid[r][c] === 0) {
                    emptyCells.push({r, c});
                }
            }
        }

        if (emptyCells.length > 0) {
            const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    renderGrid() {
        const gridElement = document.getElementById('grid');
        gridElement.innerHTML = '';
        
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const tileValue = this.grid[r][c];
                const tileElement = document.createElement('div');
                tileElement.classList.add('tile');
                
                if (tileValue !== 0) {
                    tileElement.textContent = tileValue;
                    tileElement.classList.add(`tile-${tileValue}`);
                }
                
                gridElement.appendChild(tileElement);
            }
        }

        document.getElementById('score').textContent = this.score;
    }

    move(direction) {
        let moved = false;

        const rotateGrid = () => {
            const newGrid = [];
            for (let c = 0; c < this.gridSize; c++) {
                const newRow = [];
                for (let r = this.gridSize - 1; r >= 0; r--) {
                    newRow.push(this.grid[r][c]);
                }
                newGrid.push(newRow);
            }
            this.grid = newGrid;
        };

        const slide = () => {
            for (let r = 0; r < this.gridSize; r++) {
                let row = this.grid[r].filter(val => val !== 0);
                
                for (let i = 0; i < row.length - 1; i++) {
                    if (row[i] === row[i + 1]) {
                        row[i] *= 2;
                        this.score += row[i];
                        row.splice(i + 1, 1);
                        moved = true;
                    }
                }

                while (row.length < this.gridSize) {
                    row.push(0);
                }

                this.grid[r] = row;
            }
        };

        // Rotate grid to standardize movement
        switch(direction) {
            case 'ArrowLeft':
                break;
            case 'ArrowRight':
                rotateGrid();
                rotateGrid();
                break;
            case 'ArrowUp':
                for (let i = 0; i < 3; i++) rotateGrid();
                break;
            case 'ArrowDown':
                rotateGrid();
                break;
        }

        slide();

        // Rotate back
        switch(direction) {
            case 'ArrowLeft':
                break;
            case 'ArrowRight':
                rotateGrid();
                rotateGrid();
                break;
            case 'ArrowUp':
                rotateGrid();
                break;
            case 'ArrowDown':
                for (let i = 0; i < 3; i++) rotateGrid();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.renderGrid();
            this.checkGameStatus();
        }
    }

    checkGameStatus() {
        // Check for 2048
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                if (this.grid[r][c] === 2048) {
                    alert('Congratulations! You reached 2048!');
                    return;
                }
            }
        }

        // Check for game over
        const hasEmptyCell = this.grid.some(row => row.includes(0));
        const canMerge = this.checkMergePossible();

        if (!hasEmptyCell && !canMerge) {
            alert('Game Over! Your score: ' + this.score);
        }
    }

    checkMergePossible() {
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize - 1; c++) {
                if (this.grid[r][c] === this.grid[r][c + 1]) return true;
            }
        }

        for (let c = 0; c < this.gridSize; c++) {
            for (let r = 0; r < this.gridSize - 1; r++) {
                if (this.grid[r][c] === this.grid[r + 1][c]) return true;
            }
        }

        return false;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                this.move(e.key);
            }
        });

        // Touch support
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, false);

        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, false);

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal movement
                this.move(diffX > 0 ? 'ArrowRight' : 'ArrowLeft');
            } else {
                // Vertical movement
                this.move(diffY > 0 ? 'ArrowDown' : 'ArrowUp');
            }
        }, false);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
