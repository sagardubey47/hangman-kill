// Hangman construction classes
// Study the following and use it in your code

function customJsInterface(object, virtual) {
    virtual.forEach(method => {
        try {
            let func = object[virtual];
        } catch (error) {
            throw Error("cannot instantiate object without " + method + " method");
        }
    });
}

/**
 * Hangman Model
 */
class Hangman {
    constructor(opts) {
        this.startX = opts.startX;
        this.startY = opts.startY;
        // Canvas
        if (!opts.canvas) throw Error("Canvas Element is required");
        this.canvas = opts.canvas;
        // Canvas Element
        if (!opts.ctx) throw Error("Context Element is required");
        this.ctx = opts.ctx;

        // Canvas Dimensions
        this.canvasX = this.canvas.width || 300;
        this.canvasY = this.canvas.height || 200;
        // Count for GAME OVER
        this.count = 0;
        // Starting position of cursor
        this.currX = opts.startX || this.canvasX * 0.02;
        this.currY = opts.startY || this.canvasY * 0.95; // this.canvasY - 10

        // Length of Base Line or Bottom Support
        this.baseLineWidth = opts.baseLineWidth || (this.canvasX - this.currX) * 0.4; // 100
        // Left Most Pillar Height
        this.leftPillarHeight = opts.leftPillarHeight || this.currY * 0.96; // 160
        // The gap between the end and beginning
        this.horizontalPoleGap = opts.horizontalPoleGap || this.leftPillarHeight * 0.07; // 10
        // Upper Horizontal pole Lenght
        this.horizontalPoleLength = opts.horizontalPoleLength || (this.canvasX - this.currX) * 0.4; // 125
        // Radius of Head
        this.headRadius = opts.headRadius || this.leftPillarHeight * 0.13; // 20
        // Height of Torso
        this.torsoHeight = opts.torsoHeight || this.headRadius * 2.34; // 50
        // The percentage of torso where hands should start defaulf 25% height of torso
        this.handStartAtRelativeToTorso = opts.handStartAtRelativeToTorso || this.torsoHeight * 0.25;
        // Size of hand default 75% of torso
        this.handSize = opts.handSize || this.torsoHeight * 0.75;
        // Angle W.R.T torso
        this.handAngle = opts.handAngle || 60;
        // Size of legs
        this.legSize = opts.legSize || this.torsoHeight * 0.75;
        // Angle WRT to torso line
        this.legAngle = opts.legAngle || 45;
        // This is the particular sequence to follow to make torso donot change this sequence
        this.sequence = [
            this.__head,
            this.__torso,
            this.__leftHand,
            this.__rightHand,
            this.__leftLeg,
            this.__rightLeg
        ]
        // Incorrect answers to complete game
        this.MAX = this.sequence.length;

        // Initialise Hangmans 
        this.__baseLine(),
            // Comment this section so that only first section fails
            this.__leftPillar(),
            this.__horizontalPole(),
            this.__rightPillar();
    }

    static __virtual_methods() {
        return ['__update_GUI_Circle', '__update_GUI_Line'];
    }

    __baseLine() {
        let { currX, currY, baseLineWidth } = this;

        let iniX = currX,
            iniY = currY;

        let nextX = iniX + baseLineWidth,
            nextY = iniY;

        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });

        this.currX = nextX, this.currY = nextY;
    }

    __leftPillar() {
        let { currX, currY, baseLineWidth, leftPillarHeight } = this;

        let iniX = (currX + (currX - baseLineWidth)) / 2,
            iniY = currY;

        let nextX = iniX,
            nextY = iniY - leftPillarHeight;

        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });

        this.currX = nextX, this.currY = nextY;
    }

    __horizontalPole() {
        let { currX, currY, ctx, horizontalPoleLength, horizontalPoleGap } = this;

        let iniX = currX - horizontalPoleGap,
            iniY = currY + horizontalPoleGap;

        let nextX = iniX + horizontalPoleLength,
            nextY = iniY;

        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });

        this.currX = nextX, this.currY = nextY;

    }

    __rightPillar() {
        let { currX, currY, horizontalPoleGap } = this;

        let iniX = currX - horizontalPoleGap * 2,
            iniY = currY;

        let nextX = iniX,
            nextY = currY + 10;

        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });

        this.currX = nextX, this.currY = nextY;

    }

    __head() {
        let { currX, currY, headRadius } = this;

        let iniX = currX,
            iniY = currY;

        let nextX = iniX,
            nextY = currY + 2 * headRadius;

        this.__update_GUI_Circle({
            iniX, iniY, radius: headRadius
        })

        this.currX = nextX, this.currY = nextY;
    }

    __torso() {
        let { currX, currY, ctx, torsoHeight } = this;

        let iniX = currX,
            iniY = currY;

        let nextX = iniX,
            nextY = currY + torsoHeight;

        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });

        this.currX = nextX, this.currY = nextY;
    }

    __leftHand() {
        let { currX, currY, ctx, handStartAtRelativeToTorso, handSize, handAngle, torsoHeight } = this;

        let iniX = currX,
            iniY = currY - torsoHeight + handStartAtRelativeToTorso;

        let nextX = iniX - handSize * Math.sin(Math.PI * handAngle / 180.0),
            nextY = iniY + handSize * Math.cos(Math.PI * handAngle / 180.0);


        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });

    }

    __rightHand() {
        let { currX, currY, ctx, handStartAtRelativeToTorso, handSize, handAngle, torsoHeight } = this;

        let iniX = currX,
            iniY = currY - torsoHeight + handStartAtRelativeToTorso;

        let nextX = iniX + handSize * Math.sin(Math.PI * handAngle / 180.0),
            nextY = iniY + handSize * Math.cos(Math.PI * handAngle / 180.0);


        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });

    }

    __leftLeg() {
        let { currX, currY, ctx, legSize, legAngle } = this;

        let iniX = currX,
            iniY = currY;

        let nextX = iniX - legSize * Math.sin(Math.PI * legAngle / 180.0),
            nextY = iniY + legSize * Math.cos(Math.PI * legAngle / 180.0);


        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });
    }

    __rightLeg() {
        let { currX, currY, ctx, legSize, legAngle } = this;

        let iniX = currX,
            iniY = currY;

        let nextX = iniX + legSize * Math.sin(Math.PI * legAngle / 180.0),
            nextY = iniY + legSize * Math.cos(Math.PI * legAngle / 180.0);


        this.__update_GUI_Line({
            iniX, iniY,
            nextX, nextY
        });
    }

    /**
     * Draws the Hangman Sequentially 
     * 
     */
    draw() {
        let { MAX, sequence } = this;

        if (this.count >= MAX) {
            return -1;
        }

        sequence[this.count].call(this);
        this.count++;
        return 1;
    }

    reset() {
        this.currX = this.startX || this.canvasX * 0.02;
        this.currY = this.startY || this.canvasY * 0.95; // this.canvasY - 10
        this.count = 0;
        this.__baseLine(),
            // comment to fail all test cases
            this.__leftPillar(),
            this.__horizontalPole(),
            this.__rightPillar();
    }
}

// For SVG

class HangmanSvg extends Hangman {
    constructor(svg) {

        super({
            canvas: {
                width: svg.getAttribute("width") || 300,
                height: svg.getAttribute("height") || 200
            },
            ctx: svg
        });
        customJsInterface(this, Hangman.__virtual_methods() || []);
    }

    __update_GUI_Line(opts) {
        let { iniX, iniY, nextX, nextY } = opts;
        let { currX, currY, ctx } = this;

        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
        newElement.setAttribute("x1", iniX || currX);
        newElement.setAttribute("y1", iniY || currY);
        newElement.setAttribute("x2", nextX);
        newElement.setAttribute("y2", nextY);
        newElement.setAttribute("stroke", " #f8958a");
        newElement.setAttribute("stroke-width", "2");
        newElement.setAttribute("stroke-linecap", "round");
        newElement.setAttribute("class", "figure-part");
        newElement.setAttribute("data-ns-test", "figure-part");
        ctx.appendChild(newElement);
    }

    __update_GUI_Circle(opts) {
        let { iniX, iniY, radius } = opts;
        let { currX, currY, ctx } = this;

        var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
        newElement.setAttribute("cx", iniX || currX);
        newElement.setAttribute("cy", (iniY + radius) || currY);
        newElement.setAttribute("r", radius);
        newElement.setAttribute("stroke", " #f8958a");
        newElement.setAttribute("fill", "#334f79");
        newElement.setAttribute("stroke-width", "2");
        newElement.setAttribute("class", "figure-part");
        newElement.setAttribute("data-ns-test", "figure-part");
        ctx.appendChild(newElement);
    }
}

// Optional :- Can you make canvas image using Hangman as parent class
// PS :- tester will check SVG

/**
 * Draw hangman
 *
 */
    var hangman = new HangmanSvg(document.getElementById("hangman")) // hangman svg context
    
    // the real programming start here

    const words = ['application', 'programming', 'interface', 'wizard', 'frizar'];
    var wrongWord = "WRONG WORDS : ";

    var word = getRandomWord();
    var ans = word;
    var totalCount = word.length;
    var totalMistakesLeft = 6; 
    generateDash(word);
    
    window.addEventListener("keydown", handleKey);
    document.getElementById("play-again-won").addEventListener("click", () => {
     location.reload();
    });
    
    document.getElementById("play-again-lost").addEventListener("click", () => {
     location.reload();
    });

    function handleKey() {
        let key = event.key;

        if(word.includes(key)) {
            let index = word.indexOf(key);
            word = word.replace(key, index);
            console.log(word);
            document.getElementById(`${index}`).innerText = key;
            totalCount -= 1;
            if(totalCount == 0) {
                won();
            }
        } else {
             hangman.draw();
            totalMistakesLeft -= 1;
           if(wrongWord == "WRONG WORDS : ") {
               wrongWord += key;
           } else {
               wrongWord += ",";
               wrongWord += key;
           }
            showWrong();

            if(totalMistakesLeft == 0) {
                lost();
            }
        }

    }

    function getRandomWord() {
        let ele = words[Math.floor(Math.random()*5)];
        return ele;
    }

    function generateDash(newWord) {
        
        console.log(newWord);
        let length = newWord.length;

        let node1 = document.getElementById("words"); 
        node1.innerHTML = "";
       
        for(let i=0; i<length; i++) {
            node1.insertAdjacentHTML('beforeend', `<span id='${i}' class='letter' data-ns-test="letter"></span>`);
           
        } 
    }
    
    function showWrong() {
        let node = document.getElementById("wrongs");
        node.innerHTML = "";
        node.insertAdjacentHTML('beforeend', `<span data-ns-test="wrong-letter" class='wrong'>${wrongWord}</span>`);
    }
   
    function lost() {
        document.getElementById("ans").innerText = `the answer was "${ans}"`;
        document.getElementById("lost").style.display = "block";
        window.removeEventListener("keydown", handleKey);
    }

    function won() {
        document.getElementById("won").style.display = "block";
        window.removeEventListener("keydown", handleKey);
    } 
