let currentEntry = "0";
let isAns = false;
let currentNum = "0";
const MAX_LENGTH = 10;
const ERR = "Syntax Err";

setUpListeners();
function setUpListeners() {

    let buttons = document.querySelectorAll(".button");
    buttons.forEach((button) => {

        if (button.id === 'C') {
            // Clear screen
            button.addEventListener('click', () => {
                currentEntry = '0';
                currentNum = '0';
                updateScreen();
            });
        } else if (button.id === "=") {
            // Evaluate current screen
            button.addEventListener('click', equals);
        } else {
            // Show button click on screen
            button.addEventListener('click', function(){appendChoice(button.id)});
        }
    })
}



function equals() {

    try {
        // Evaluate what is currently on the screen
        currentEntry = eval(currentEntry);
        if (currentEntry.toString().length > MAX_LENGTH) {
            // The answer was too long, so put it in scientific notation
            currentEntry = expo(currentEntry);
        }
        currentEntry = currentEntry.toString();
        // Current number is the answer
        currentNum = currentEntry;
    } catch (err) {
        // The user entered something weird
        currentEntry = ERR;
        currentNum = "0";
    }


    // Toggle that the current answer is shown on the screen
    isAns = true;
    updateScreen();
}

function appendChoice(id) {
    if (!validateChoice(id)) {
        return;
    }

    !isOp(id) ? currentNum += id : currentNum = "0";

    // Check for initial state
    if (currentEntry === '0' || currentEntry === ERR || !isOp(id) && isAns) {
        // Replace the currently showing screen with the new calculation
        currentEntry = id;

    } else {
        if (id === "(" && !isOp(currentEntry[currentEntry.length - 1]) || 
                !isOp(id) && currentEntry[currentEntry.length - 1] === ")") {
            currentEntry += "*";
        }

        currentEntry += id;
    }

    isAns = false;

    updateScreen();
}

function updateScreen() {
    const screen = document.querySelector("#screen");
    let text = currentEntry.replace(/\*/g, "x");
    if (text.length > 10) {
        text = text.slice(text.length - 10);
    }
    screen.textContent = text;
}

function validateChoice(id) {
    if (isOp(currentEntry[currentEntry.length - 1]) && isOp(id) 
        && id !== "(" && id !== ")") {
        return false;
    }

    if (id === "." && currentNum.search(/\./g) !== -1) {
        return false;
    }

    return true;
}

function expo(x) {
    // Use 4 decimal places 
    // Put into scientific notation
    return Number.parseFloat(x).toExponential(4);
}

// Check if the current click is an operation
function isOp(id) {
    return !(Number.isInteger(+id) || id === ".");
}

