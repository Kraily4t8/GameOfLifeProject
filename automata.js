// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
class Automata {
    constructor() {
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
        //true means alive, false means dead
        this.currentTable = [];
        this.spawnTable(this.tableWidth,this.tableHeight);
        //toggles
        //reset
        //spawnRate
        //tick speed (min and max speed)
        //table size *ratio between height and width
    };

    //return table of specified dimensions
    spawnTable(x, y) {
        this.currentTable = [];
        for (var i = 0; i < y; i++) {
            this.currentTable.push([]);
            for (var j = 0; j < x; j++) {
                this.currentTable[i][j] = this.spawnRate(0.5); // = spawnRate(rate)
            }
        }
    };

    spawnRate(decimal) {
        if(decimal > Math.random) {
            return true;
        }
        return false;
    };

    generateNewTable(x,y) {
        let newTable = [];
        for (var i = 0; i < y; i++) {
            newTable.push([]);
            for (var j = 0; j < x; j++) {
                newTable[i][j] = this.rules(this.currentTable[i][j], this.neighborCount(i,j))
            }
        }
        return newTable;
    };
    
    //count neighbors from old table based on position
    //when at the edges, wrap to the other side
    neighborCount(x, y) {
        let count = 0;
        
        //3x3 ignore middle
        for(var i = x - 1; i < x + 2; i++) {
            i = this.wrapValue(i,this.tableHeight);
            for(var j = y - 1; j < y + 2; j++) {
                j = this.wrapValue(j,this.tableWidth);
                if(i != x || j != y) {
                    //console.log("i " + i + " j " + j);
                    //console.log("currentTable " + this.currentTable[i][j]);
                    if(this.currentTable[i][j] == true) {
                        count++;
                    }
                }
            }
        }
        return count;
    };

    //return 'alive' or 'dead' depending on rules
    rules(living, count) {
        if(living) {
            if(count < 2 || count > 3) {
                return false;
            }
            return true;
        } else {
            if(count == 3) {
                return true;
            }
        }
    };

    wrapValue(val, max) {
        return (val + max) % max;
    }



    update(){
        //speed
        let speed = parseInt(document.getElementById("speed").value, 10);
        if(this.once){
            if(this.tickCount++ >= speed && speed != 120){
                this.tickCount = 0;
                //this.tisks++

                //makes new table
                this.currentTable = this.generateNewTable(this.tableWidth,this.tableHeight); 
                //next table * dependent on tick speed
            }
        }

        
        if(this.once) {
            this.startTime;
        }

        

        if(this.once) {
            this.once = false;
            this.endTime;
            console.log(this.getDuration);
        }
    };

    draw(ctx) {
        ctx.fillStyle = rgb(0,100,10);
        //ctx.fillRect(100,100,100,100);
        let cellGap = 1;
        
        for(var i = 0; i < this.tableHeight; i++) {
            for(var j = 0; j < this.tableWidth; j++) {
                //column * size + gap
                //position x;           y
                //size - gap
                //width
                console.log("i " + i + " j " + j);
                console.log(this.currentTable[i][j]);
                if(this.currentTable[i][j] == true) {
                    ctx.fillRect(i * this.cellSize + cellGap, j * this.cellSize + cellGap, this.cellSize - cellGap, this.cellSize - cellGap);
                }
            }
        }
    };

    startTimer() {
        startTime = Date.Now();
    }

    endTimer() {
        endTime = Date.Now();;
    }

    getDuration() {
        return endTime - startTime;
    }
};
