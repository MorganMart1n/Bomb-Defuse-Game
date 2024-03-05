const five = require("johnny-five");
const board = new five.Board({
    port: "COM5"
});
//Terminal Custom
require('terminal-kit').Terminal;
//Allows for inline user input
const PS = require("prompt-sync");
const prompt = PS();
var codeArray = [];
let buttonLength = 0;
let hint = ["","","",""];
var buttonArray = [];
var bombPlanted = false;
var bombDefused = false;
var bombExploded = false;
var motionDetected = false;
let beeps = 0; // starts from 0 to whichever beep Pace.
beatPace = [700, 500, 300, 100] //pace at which the beeps will be initalised for faster beep speeds.
checkpoints = [15, 30, 45, 60] // Counting starts from 0
let z = 0; // Increamented value for beeping
let lives = 3;
let ledOn = false;

board.on("ready", function() {

    var motion = new five.Motion(9);
    const piezo = new five.Piezo(7);
    const flashLED = new five.Led(6);
    const threeLives = new five.Led(5);
    const twoLives = new five.Led(4);
    const oneLives = new five.Led(3);

    function bombBeep() {
        if (!motionDetected) {
            // If motion is not detected yet, do nothing
            return;
        }
        // Checks if the beeps are less than the total ammount of a checkpoint.
        if (beeps <= checkpoints[z])

            piezo.play({
                song: [
                    ["E6", 1 / 4]
                ],
                tempo: 200
            });
        beeps++
        beepPacing()
        //Counts beeps for terminal validation - Testing
        console.log(60 - beeps)
        //checks if the beeps reach a certain time within the bomb timer, if so stop beeping. as well as checks if bomb has been defused, if so stop beeping. (Need to make this sound less stupid)
        beepCheckPoint();
        if (ledOn == false){
            flashLED.on();
            ledOn = true;
        }
        else{
            flashLED.off();
            ledOn = false;
        }
        
    }
    //sets beep pacing to index 0
    let bombCheckPoint = setInterval(bombBeep, beatPace[z])

    function beepPacing() {
        if (beeps === checkpoints[0]) {
            console.log("Faster")
            z++
            //Clears interval for next Interval
            clearBeep();
            //sets beep pacing to indexed z'd value
            bombCheckPoint = setInterval(bombBeep, beatPace[z])

        }
        if (beeps === checkpoints[1]) {
            console.log("Fasterer")
            z++
            //Clears interval for next Interval
            clearBeep();
            //sets beep pacing to indexed z'd value
            bombCheckPoint = setInterval(bombBeep, beatPace[z])
        }
        if (beeps === checkpoints[2]) {
            console.log("Fastest")
            z++
            //Clears interval for next Interval
            clearBeep();
            //sets beep pacing to indexed z'd value
            bombCheckPoint = setInterval(bombBeep, beatPace[z])
        }
        if (beeps === checkpoints[3]) {
            //Clears interval
            clearBeep();
            failSound();
            bombExploded = true;
            console.log("BOMB EXPLODED (Maybe Defuse The Bomb In Time)")
        }
    }

    function checkLives(){
        if(lives == 3){
            threeLives.on();
            twoLives.off();
            oneLives.off();
        }
        else if (lives == 2){
            threeLives.off();
            twoLives.on();
            oneLives.off();
        }
        else if (lives == 1){
            threeLives.off();
            twoLives.off();
            oneLives.on();
        }
        else{
            threeLives.off();
            twoLives.off();
            oneLives.off();
        }
    }

    var b1 = new five.Button({
        pin: 13,
    });
    var b2 = new five.Button({
        pin: 12,
    });
    var b3 = new five.Button({
        pin: 11,
    });
    var b4 = new five.Button({
        pin: 10,
    });

    //checks if buttonLength is = 4
    function Length() {
        if (buttonLength === 4) {
            defuse()
        }

    }

    //Calls function for allowing bomb planting input 
    setCodeArray();

    b1.on("press", function() {
        buttonLength++
        //Pushes the counter value without a need of array positioning
        buttonArray.push(1)
        //Checks constantly ran .on function
        Length()
        console.log("1")
    });
    b2.on("press", function() {
        buttonLength++
        //Pushes the counter value without a need of array positioning
        buttonArray.push(2)
        //Checks constantly ran .on function
        Length()
        console.log("2")

    });
    b3.on("press", function() {
        buttonLength++
        //Pushes the counter value without a need of array positioning          
        buttonArray.push(3)
        //Checks constantly ran .on function
        Length()
        console.log("3")

    });
    b4.on("press", function() {
        buttonLength++
        //Pushes the counter value without a need of array positioning
        buttonArray.push(4)
        //Checks constantly ran .on function
        Length()
        console.log("4")

    });
    //Clears Interval
    function clearBeep() {
        clearInterval(bombCheckPoint)
    }

    function beepCheckPoint() {
        if (beeps === checkpoints[3] || bombDefused === true) {
            clearBeep();
        }
    }

    function setCodeArray() {
        let setCode = prompt("Enter a 4 digit Bomb-Code (consisting of the numbers 1, 2, 3, and 4): ");
    
        // ensure the entered code consists only of 1, 2, 3, or 4
        let isValid = true;
        if (setCode.length === 4) {
            for (let i = 0; i < setCode.length; i++) {
                if (setCode[i] !== '1' && setCode[i] !== '2' && setCode[i] !== '3' && setCode[i] !== '4') {
                    isValid = false;
                    break;
                }
            }
        } else {
            isValid = false;
        }
    
        if (isValid) {
            codeArray = setCode.split('');
            bombPlanted = true;
            setBomb();
        } else {
            console.log("Please enter a 4-digit code consisting only of the numbers 1, 2, 3, and 4");
            setCodeArray();
        }
    }
    

    motion.on("change", function() {
        console.log("MOTION DETECTED: TIMER STARTED!");
        motionDetected = true;
    });

    function codeHint() {
        for (let i = 0; i < codeArray.length; i++) {
            const digit = codeArray[i];
            if (digit == buttonArray[i]) {
                hint[i] = digit;
            } else if (hint[i] == "") {
                hint[i] = '*';
            }
        }
        buttonArray = [];
        buttonLength = 0;
        console.log('Hint: ' + hint);
    }

    //Initiates bomb plant
    function setBomb() {
        if (bombPlanted === true) {
            console.log("Bomb has been planted");
            checkLives();
        }
    }
    //Allows for defused
    function defuse() {
        if (!bombExploded){ //Technically you could defuse the bomb after it had exploded, probably didn't really need fixed but better safe than sorry.
        //Uses Array function to compare both array values into strings 
        if (buttonArray.toString() === codeArray.toString()) {
            bombDefused = true
            clearBeep();
            console.log(buttonArray + "  -  " + codeArray);
            console.log("Bomb has been defused");
            winSound();
        } else {
            if (lives > 1){
                codeHint();
                lives--;
                console.log("ATTEMPTS REMAINING: " + lives);
                console.log("CODE INCORRECT");
                incorrectSound();
                checkLives();
            }
            else{
                lives--;
                checkLives();
                clearBeep();
                failSound();
                console.log("WRONG CODE ENTERED 3 TIMES!!!");
                console.log("BOMB EXPLODED");
                bombExploded = true;
            }

        }
        }
    }

    function failSound() {
        piezo.play({
            song: [
                ["E3", 0.5],
                ["E1", 2]
            ],
            tempo: 200
        });
    }    function winSound() {
        piezo.play({
            song: [
                ["E1", 0.5],
                ["E3", 0.5],
                ["E5", 2],
            ],
            tempo: 200
        });
    }     function incorrectSound() {
        piezo.play({
            song: [
                ["E4", 0.5],
                ["E2", 2]
            ],
            tempo: 200
        });
    }
})