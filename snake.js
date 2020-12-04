window.alert("The objective is to eat the white squares and avoid the green squares. Alter the game's speed in between attempts")
let canvas = document.querySelector("#myCanvas");
let context = canvas.getContext('2d');
let calls = 0; // velocity control. moves the box every third animation frame(calls %modSpeed(slow = 6, fast = 4, extreme = 2))
let boxSize = 15;
let modSpeed = 4;
//create a grid array that will be assigned to the model object.
//rows = height/boxSize cols = width/boxSize
let bools = new Array(canvas.width/boxSize);
    for (i = 0; i < canvas.width/boxSize; i ++)
    {
        bools[i] = new Array(canvas.height/boxSize);
        for (j = 0; j < canvas.height/boxSize; j ++)
        {
            //will be used to determine if a spot on the screen contains a box or not,
            //the game will end if a box tries to move into another box
            bools[i][j] = false;
        }
    }

let model = {boxes: [], enemies: [],targetRow: 10, targetCol: 10, right:true, down:true, direction:false, moving:false, gameOver:false, maxScore:1, speed:"Fast", gamesPlayed:1 };
    //direction = false means vertical, true means horizontal
    //right = true for movement in the positive x direction
    //down = true for movement in the negative y direction

    model.grid = bools;

    //box constructor for each box of the snake
    function Box(row,col) {
      this.row = row;
      this.col = col;
      model.grid[row][col] = true;
    }

    model.boxes[0] = new Box(2,2);
    //displays the screen
    render(0,0);

    function render(xVel,yVel) {
        clear();
        displayBackground();
        context.fillStyle = "blue";
        context.strokeStyle = "black";
        //checks if the front box can move where it is supposed to
        validMove(xVel,yVel);
        displayEnemies();
        if (model.boxes.length >1 )  {
            //have to define the location of this box because it is based on xVel and yVel whereas all the other just take the location of the preceding box in the chain
            displayBox2(xVel,yVel);
            for (i = model.boxes.length-1;i > 1; i--) {
              //removes the makes the previous location in the grid array false if it is the last box in the snake
                if (i == model.boxes.length -1 ) {
                    moveTo(model.boxes[i].row,model.boxes[i].col,model.boxes[i-1].row, model.boxes[i-1].col, i, true);
                }
                else {
                    moveTo(model.boxes[i].row,model.boxes[i].col,model.boxes[i-1].row, model.boxes[i-1].col, i, false);
                }
                //displays boxes
                context.fillRect(model.boxes[i].row*boxSize,model.boxes[i].col*boxSize, boxSize, boxSize);
                context.strokeRect(model.boxes[i].row*boxSize, model.boxes[i].col*boxSize, boxSize, boxSize);
            }
            document.querySelector("p").innerText = "";
            let length = model.boxes.length;
            if (length != 1) {
                length--;
            }
            if (length > model.maxScore) {
                model.maxScore = length;
            }
            let str = "Length: " + length + " High Score: " + model.maxScore + " Speed: " + model.speed
            document.querySelector("p").insertAdjacentText("beforeend", str);
        }
    }
    function displayEnemies() {
        for (i = 0; i < model.enemies.length; i ++)
        {
            context.fillStyle = "green"
            context.fillRect(model.enemies[i].row*boxSize,model.enemies[i].col*boxSize, boxSize, boxSize);
        }
    }
    function validMove(xVel,yVel) {
        model.grid[model.boxes[0].row][model.boxes[0].col] = false;
        model.boxes[0].row += xVel;
        model.boxes[0].col += yVel;

        if ((model.boxes[0].row <0) || (model.boxes[0].row >= canvas.width/boxSize) || (model.boxes[0].col < 0) || (model.boxes[0].col >= canvas.height/boxSize)){
            window.alert("Try not to hit the walls. Game over. Press Play Again.")
            model.gameOver = true;
        }
        if (model.grid[model.boxes[0].row][model.boxes[0].col] == true) {
            window.alert("Snakes can not eat themselves. Game over. Press Play Again.");
            model.gameOver = true;
        }
        model.grid[model.boxes[0].row][model.boxes[0].col] = true;
        if (model.boxes[0].row == model.targetRow &&  model.boxes[0].col == model.targetCol)
        {
            createNewTarget();
            for (i = 1; i < 6; i ++)  {
                model.boxes[model.boxes.length] = new Box(model.boxes[model.boxes.length-1].row, model.boxes[model.boxes.length-1].col);
            }
        }
        context.fillStyle = "red";
        context.strokeStyle = "black";
        context.fillRect(model.boxes[0].row*boxSize, model.boxes[0].col*boxSize, boxSize,boxSize);
        context.strokeRect(model.boxes[0].row*boxSize,model.boxes[0].col*boxSize, boxSize, boxSize);
    }

    function moveTo(oldR,oldC,newR,newC,boxIndex,deletePrev) {
        if (deletePrev) {
            model.grid[oldR][oldC] = false;
        }
        model.grid[newR][newC] = true;
        model.boxes[boxIndex].row = newR;
        model.boxes[boxIndex].col = newC;
    }


    function createNewTarget() {
       // console.log("entered", model.gamesPlayed)
        let acceptable = false;
        let row = 0;
        let col = 0;
        while (!acceptable) {
            model.targetRow = Math.floor(Math.random()*canvas.height/boxSize);
            model.targetCol = Math.floor(Math.random() *canvas.width/boxSize);
            row = Math.floor(Math.random()* canvas.height/boxSize);
            col = Math.floor(Math.random()* canvas.width/boxSize);
            if (model.grid[model.targetRow][model.targetCol] == false && model.grid[row][col] == false) {
               acceptable = true;
               model.enemies[model.enemies.length] = new Box(row, col); 
            }
        }
        console.log("entered", model.gamesPlayed, model.targetRow, model.targetCol, canvas.width/boxSize)
    }

    function clear() {
        context.clearRect(0,0,canvas.height, canvas.width);
    }

    function displayBackground() {
        context.fillStyle = "black";
        context.fillRect(0,0,canvas.width, canvas.height);
        context.fillStyle = "white";
        context.fillRect(model.targetRow*boxSize, model.targetCol*boxSize, boxSize, boxSize );
    }

    function displayBox2(xVel,yVel) {
      context.fillStyle = "blue";
      context.strokStyle = "black";
      moveTo(model.boxes[1].row,model.boxes[1].col,model.boxes[0].row-xVel,model.boxes[0].col-yVel,1);
      context.fillRect(model.boxes[1].row*boxSize,model.boxes[1].col*boxSize, boxSize, boxSize);
      context.strokeRect(model.boxes[1].row*boxSize, model.boxes[1].col*boxSize, boxSize, boxSize);
    }

    function driver() {
    let x  = 0;
    let y = 1;
      if (model.moving) {//an arrow key has been pressed
         if (model.direction) {//if moving in the horizontal plane
            if (model.right) { //if moving right
               x= 1;
               y = 0
            }
            else {
               x = -1;
               y = 0
            }
         }
         else {
            if (model.down) {//if moving down
               x = 0;
               y = 1;
            }
            else { //if moving up
               x = 0;
               y = -1;
            }
         }
         calls++;
         if (calls%modSpeed == 0) {
           render(x,y);
         }
      }
      if (!model.gameOver) {
          window.requestAnimationFrame(driver);
      }
      else {
          console.log("Game over");
      }
    }
    window.requestAnimationFrame(driver);

    document.addEventListener("keydown", (e) =>
    {
          if(e.keyCode == 37) { //Left
              model.right = false;
              model.direction = true;
              model.moving= true;
          }
          else if (e.keyCode == 38) {// up
              model.down = false;
              model.direction = false;
              model.moving= true;
          }
          else if (e.keyCode ==39) {// right
              model.right = true;
              model.direction = true;
              model.moving= true;
          }
          else if (e.keyCode == 40) {// down
              model.down = true;
              model.direction = false;
              model.moving= true;
          }
    });
    //change speeds
    document.querySelector("#slow").addEventListener("click", () => {
        console.log("im trying")
        model.speed = "Slow"
        modSpeed = 6;
    });
    document.querySelector("#fast").addEventListener("click", () => {
        model.speed = "Fast"
        modSpeed = 4;
    });
    document.querySelector("#extreme").addEventListener("click", () => {
        console.log("im trying")
        model.speed = "Extreme"
        modSpeed = 2;
    });
    document.querySelector("#replay").addEventListener("click", () =>{
        model.gameOver = false;
        for (i = 0; i < canvas.width/boxSize; i ++) {
            for (j = 0; j < canvas.height/boxSize;j++){
                model.grid[i][j] = false;
            }
        }
        model.gamesPlayed++;
        model.boxes = [new Box(4,4)];
        model.enemies = [];
        model.targetRow = 20;
        model.targetCol = 20;
        model.direction = true;
        model.right = true;
        window.requestAnimationFrame(driver);
    });
