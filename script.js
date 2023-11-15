let Gameboard = ( () => {
    let board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
    let moves = 0;

    
    let playMove = (move, playerName) => {
        if(board[move[0]][move[1]] == -1) {
            moves += 1;
            board[move[0]][move[1]] = playerName;
            if(checkWin(playerName)) {
                console.log('Win');
                return 'Win';
            }
            if(moves == 9) {
                console.log('Tie');
                return 'Tie';
            }
        }
        console.log(board);
        return;
    }

    let checkWin = (playerName) => {
        let checkDiag = () => {
            let pv = 0, nv = 0;
            for(let x = 0; x <= 2; x++){
                if (board[x][x] == playerName) {
                    pv += 1;
                } 
                if (board[x][2-x] == playerName) {
                    nv += 1;
                } 
                x += 1;
            }
            
            if(pv == 3) return true;
            if(nv == 3) return true;
            return false;
        }

        let checkRowCol = () => {
            let rowWin = 0, colWin = 0;
            for(let row = 0; row < 3; row++) {
                for(let col = 0; col < 3; col++) {
                    if(board[row][col] == playerName) {
                        rowWin += 1;
                    }
                    if(board[col][row] == playerName) {
                        colWin += 1;
                    }
                }
                if(rowWin == 3 || colWin == 3) return true;
                rowWin = 0; 
                colWin = 0;
            }
            return false;
        }
        return checkDiag() || checkRowCol();
    }

    let clearBoard = () => {
        board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
    }

    return {playMove, clearBoard};
})()


let ScoreBoard = ( () => {
    const scores = {};

    let getScore = (playerName) => {
        if(!scores.hasOwnProperty(playerName)) return scores[playerName];
        else return 'Player Not Found';
    }

    let addScore = (playerName) => {
        if(!scores.hasOwnProperty(playerName)) scores[playerName] = 1;
        else scores[playerName] += 1;
    }

    return {getScore, addScore};
})()

let Players = ( () => {
    const players = {};

    let addPlayer = (playerName) => {
        players[playerName] = 0;
    }

    let getPlayerScore = (playerName) => {
        return players[playerName];
    }

    let incrementPlayerScore = (playerName) => {
        players[playerName] += 1;
    }

    let clearPlayers = () => {
        players = {};
    }

    return {addPlayer, getPlayerScore, incrementPlayerScore, clearPlayers};
})()

let Game = ((playerOne, playerTwo) => {
   
    let playGame = () => { 
        Players.addPlayer(playerOne);
        Players.addPlayer(playerTwo);
        // TODO: Need to adapt to onclick action
        while (true) {
            let playerOneScore = Gameboard.playMove([], 'X');
            if(playerOneScore == 'Win') ScoreBoard.addScore(playerOne);
            let playerTwoScore = Gameboard.playMove([], 'O');
            if(playerTwoScore == 'Win') ScoreBoard.addScore(playerTwo);
            if(playerOneScore == 'Tie' || playerTwoScore == 'Tie') break;
        }
        Gameboard.clearBoard();
        Players.clearPlayers();
    }

    return {playGame};
})()

