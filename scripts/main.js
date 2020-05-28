// A record of the user's current calculation
let currentEntry = "0";

// Whether or not the current number is the answer to
// a calculation or is still a calculation in progress
let isAns = false;

// The current number in the calculation
// Changes after every operand is typed
let currentNum = "0";

// Maximum length of the string in the typing box
const MAX_LENGTH = 10;

// Error message to show
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
            button.addEventListener('click', compute);
        } else {
            // Show button click on screen
            button.addEventListener('click', function(){appendChoice(button.id)});
        }
    })
}

// Computes the current entry, called when the user hits =
function compute() {

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

// Add the button click to the current calcultions
function appendChoice(id) {
    // Check for valid input
    if (!validateChoice(id)) {
        return;
    }

    // If it is an operand, reset the current number
    !isOp(id) ? currentNum += id : currentNum = "0";

    // Check for initial state
    if (currentEntry === '0' || currentEntry === ERR || !isOp(id) && isAns) {
        // Replace the currently showing screen with the new calculation
        currentEntry = id;

    } else {
        // If it is a parenthesis preceeded or followed by a number,
        // make sure to add a multiplication symbol
        if (id === "(" && !isOp(currentEntry[currentEntry.length - 1]) || 
                !isOp(id) && currentEntry[currentEntry.length - 1] === ")") {
            currentEntry += "*";
        }

        // Append the chosen button to the current entry
        currentEntry += id;
    }

    // Equals was not hit, so this currentEntry is not an answer
    isAns = false;

    updateScreen();
}

function updateScreen() {
    // Select the screen
    const screen = document.querySelector("#screen");

    // Use regex to find and replace all * with x symbol
    let text = currentEntry.replace(/\*/g, "x");

    // Make sure the text length is always under max
    if (text.length > 10) {
        text = text.slice(text.length - 10);
    }

    // Update the screen
    screen.textContent = text;
}

function validateChoice(id) {
    // Two operands cannot be typed in succession
    if (isOp(currentEntry[currentEntry.length - 1]) && isOp(id) 
        && id !== "(" && id !== ")") {
        return false;
    }

    // There cannot be two decimal points in the same number
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

