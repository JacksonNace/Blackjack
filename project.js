
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;
// How often certain symbols appear
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}
// what each symbol multiplier is worth
const SYMBOL_VALUES = {
    A: 8,
    B: 6,
    C: 4,
    D: 2
}
// this function helps deposit money and verifies you have a valid deposit amount
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

            if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
                console.log("Invalid deposit amount, try again.")
        } else {
            return numberDepositAmount
        }
    }
};
// this function takes the number of lines you bet on and verifies its a valid number
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

            if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
                console.log("Invalid number of lines, try again.")
        } else {
            return numberOfLines;
        }
    }
};
// this function is similar to the two before, it takes the valid bet amount. if it exceeds your balance, is NaN it will not work.
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);

            if (isNaN(numberBet) || numberBet <= 0 || numberBet > (balance/lines)) {
                console.log("Invalid bet, try again.")
        } else {
            return numberBet;
        }
    }
}
// this function has several functions inside, but generally it is the spinning mechanic
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
            for (let i = 0; i < count; i++) {
                symbols.push(symbol)
            }
    }
    // this function handles how the computer calculates it and verifies the number doesnt round up with the math.floor which would break the money. 
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
}
// this function "transposes" our previous few functions, basically turning the columns we previously calculated with our reels function into rows we can calculate more easily.
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }

    return rows
}
// this function helps change the output and makes it a little more aesthetic.
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}
// this function delivers the SYMBOL_VALUES variable from the global variables at the top and calculates your winnings, but doesnt add it just yet
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for(const symbol of symbols) {
            if(symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }

    return winnings;
}
// this function is what controls the game, adds or subtracts balance money.
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You win $" + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money! :(");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)?")

        if (playAgain != "y") break;
    }    
};



game();




