// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
class Automata {
    constructor(gameEngine) {
       
        this.once = true;
        this.startTime;
        this.endTime;

        this.color = 0;
        //grid background color
        //grid cell color
        //generate table of ...300 by 200 true or false
        this.tableWidth = 150;
        this.tableHeight = 65;
        this.cellSize = 10;
        this.tickCount = 0;
        this.ticks = 0;
        this.gapSize = 2;
        this.gap = true;
        //true means alive, false means dead
        this.currentTable = this.spawnTable();
        this.spawnRateValue = 0.5;
        //toggles
        this.pause = false;
        //reset
        //spawnRate
        //tick speed (min and max speed)
        //table size *ratio between height and width

        //restart button
        this.restartButton = document.getElementById('restartButton');
        this.restartButton.addEventListener('click', (e) => {
            this.ticks = 0;
            this.currentTable = this.spawnTable();
        });

        //Pause button
        this.togglePauseButton = document.getElementById('togglePauseButton');
        this.togglePauseButton.addEventListener('click', (e) => {
            this.pause = !this.pause;
        });

        //table Complement
        this.toggleComplement = document.getElementById('tableComplementButton');
        this.toggleComplement.addEventListener('click', (e) => {
            this.currentTable = this.generateComplement();
        });

        //gridless
        this.toggleGrid = document.getElementById('gridEnabled');
        this.toggleGrid.addEventListener('click', (e) => {
            if(this.gap) {
                this.gapSize = 0;
                this.gap = false;
            } else {
                this.gapSize = 2;
                this.gap = true;
            }
        });
    };

    //return table of specified dimensions
    spawnTable() {
        let newTable = [];
        for (var col = 0; col < this.tableWidth; col++) {
            newTable.push([]);
            for (var row = 0; row < this.tableHeight; row++) {
                this.spawnRateValue = parseInt(document.getElementById('spawnratePercent').value, 10) / 100;
                newTable[col][row] = this.spawnRate(this.spawnRateValue); // = spawnRate(rate)
            }
        }
        return newTable;
    };

    spawnRate(decimal) {
        //return Math.round(Math.random());
        if(decimal > Math.random()) {
            return true;
        }
        return false;
    };

    generateNewTable() {
        let newTable = [];

        for (var col = 0; col < this.tableWidth; col++) {
            newTable.push([]);
            for (var row = 0; row < this.tableHeight; row++) {
                newTable[col][row] = this.rules(this.currentTable[col][row], this.neighborCount(col,row))
            }
        }
        return newTable;
    };

    generateComplement() {
        let newTable = [];

        for (var col = 0; col < this.tableWidth; col++) {
            newTable.push([]);
            for (var row = 0; row < this.tableHeight; row++) {
                newTable[col][row] = !this.currentTable[col][row];
            }
        }
        return newTable;
    }
    
    //count neighbors from old table based on position
    //when at the edges, wrap to the other side
    neighborCount(col, row) {
        let count = 0;
        
        //3x3 ignore middle
        for(var i = col - 1; i <= col + 1; i++) {
            for(var j = row - 1; j <= row + 1; j++) {
                if (i === col && j === row) continue;
                const wrappedX = this.wrapValue(i,this.tableWidth);
                const wrappedY = this.wrapValue(j,this.tableHeight);
                //count += this.currentTable[wrappedX][wrappedY];
                if(this.currentTable[wrappedX][wrappedY] == true) count++;
            }
        }
        return count;
    };

    //return 'alive' or 'dead' depending on rules
    //
    rules(living, count) {
        if(living && count === 2 || count === 3) return 1;
        if(!living && count === 3) return 1;
        return 0;
        //if(living == 1) {
            //if(count == 2 || count == 3) {
            //    return 1;
            //}
            //return 0;
        //} else {
            //if(count == 3) {
                //return 1;
            //}
            //return 0;
        //}
    };

    wrapValue(val, max) {
        return (val + max) % max;
    }



    update(){
        //speed
        //flip the thing
        let speed = 120 - parseInt(document.getElementById("speed").value, 10);
        if(this.tickCount++ >= speed && speed != 120 && !this.pause){
            this.tickCount = 0;
            this.ticks++;
            document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;

            //makes new table
            this.currentTable = this.generateNewTable(); 
            //next table * dependent on tick speed
        }
    };

    draw(ctx) {
        ctx.fillStyle = rgb(17, 203, 240);
        //ctx.fillRect(100,100,100,100);
        let cellGap = this.gapSize;
        
        for(var i = 0; i < this.tableWidth; i++) {
            for(var j = 0; j < this.tableHeight; j++) {
                //column * size + gap
                //position x;           y
                //size - gap
                //width
                if(this.currentTable[i][j]) {
                    ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize - cellGap, this.cellSize - cellGap);
                }
            }
        }
    };
};
