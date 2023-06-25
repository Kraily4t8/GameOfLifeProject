// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
class Automata {
    constructor(gameEngine) {
        Object.assign(this, { gameEngine});
        
        this.once = true;
        this.startTime;
        this.endTime;

        this.color = 0;
        //grid background color
        //grid cell color
        //generate table of ...300 by 200 true or false
        this.tableWidth = 50;
        this.tableHeight = 50;
        this.cellSize = 10;
        this.tickCount = 0;
        //true means alive, false means dead
        this.currentTable;
        this.spawnTable();
        //toggles
        //reset
        //spawnRate
        //tick speed (min and max speed)
        //table size *ratio between height and width
    };

    //return table of specified dimensions
    spawnTable() {
        this.currentTable = [];
        for (var col = 0; col < this.tableWidth; col++) {
            this.currentTable.push([]);
            for (var row = 0; row < this.tableHeight; row++) {
                this.currentTable[col][row] = this.spawnRate(0.5); // = spawnRate(rate)
            }
        }
    };

    spawnRate(decimal) {
        //return Math.round(Math.random());
        if(decimal > Math.random()) {
            return 1;
        }
        return 0;
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
                count += this.currentTable[wrappedX][wrappedY];
            }
        }
        return count;
    };

    //return 'alive' or 'dead' depending on rules
    //
    rules(living, count) {
        if(living == 1 && count === 2 || count === 3) return 1;
        if(living == 0 && count === 3) return 1;
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
        let speed = 120 - parseInt(document.getElementById("speed").value, 10);
        if(this.tickCount++ >= speed && speed != 120){
            this.tickCount = 0;
            //this.tisks++

            //makes new table
            this.currentTable = this.generateNewTable(); 
            //next table * dependent on tick speed
        }
    };

    draw(ctx) {
        ctx.fillStyle = rgb(0,0,0);
        //ctx.fillRect(100,100,100,100);
        let cellGap = 1;
        
        for(var i = 0; i < this.tableWidth; i++) {
            for(var j = 0; j < this.tableHeight; j++) {
                //column * size + gap
                //position x;           y
                //size - gap
                //width
                if(this.currentTable[i][j] === 1) {
                    ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize - cellGap, this.cellSize - cellGap);
                }
            }
        }
    };
};
