let Gameboard = (() => {
    let board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
    let moves = 0;


    let playMove = (move, playerName) => {
        if (board[move[0]][move[1]] == -1) {
            moves += 1;
            board[move[0]][move[1]] = playerName;
            if (checkWin(playerName)) {
                return 'Win';
            }
            if (moves == 9) {
                return 'Tie';
            }
        }
        return;
    }

    let checkWin = (playerName) => {
        let checkDiag = () => {
            let pv = 0, nv = 0;
            for (let x = 0; x <= 2; x++) {
                if (board[x][x] == playerName) {
                    pv += 1;
                }
                if (board[x][2 - x] == playerName) {
                    nv += 1;
                }
            }

            if (pv == 3) return true;
            if (nv == 3) return true;
            return false;
        }

        let checkRowCol = () => {
            for (let row = 0; row <= 2; row++) {
                let rowWin = 0, colWin = 0;
                for (let col = 0; col <= 2; col++) {
                    if (board[row][col] == playerName) {
                        rowWin += 1;
                    }
                    if (board[col][row] == playerName) {
                        colWin += 1;
                    }
                }
                if (rowWin == 3 || colWin == 3) return true;
            }
            return false;
        }
        return checkDiag() || checkRowCol();
    }

    let clearBoard = () => {
        board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
        moves = 0;
    }

    return { playMove, clearBoard };
})()


let ScoreBoard = (() => {
    const scores = {};

    let getScore = (playerName) => {
        if (!scores.hasOwnProperty(playerName)) return scores[playerName];
        else return 'Player Not Found';
    }
    
    let addScore = (playerName) => {
        if (!scores.hasOwnProperty(playerName)) scores[playerName] = 1;
        else scores[playerName] += 1;
    }

    let getAllScores = () => {
        return scores;
    }

    return { getScore, addScore, getAllScores};
})()

let Players = (() => {
    let players = {};

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

    return { addPlayer, getPlayerScore, incrementPlayerScore, clearPlayers };
})()

let InputHandler = (() => {

    let getPlayerNames = (e) => {
        e.preventDefault();
        const form = document.getElementById('play-settings');
        const formData = new FormData(form);
        const playerNames = {};
        formData.forEach((value, key) => {
            playerNames[key] = value;
        });

        const playerOne = playerNames['p1'];
        const playerTwo = playerNames['p2'];

        if (playerOne.length > 0 && playerTwo.length > 0) {
                return { playerOne, playerTwo };
        }
        else {
            alert('Please enter valid player names');
        }
    }


    return { getPlayerNames }
})()

let BoardController = (() => {
    let gameState = () => { return { state: false } };

    let playmove = (e) => {
        let move = e.srcElement.className.split('-').slice(1);
        if (!gameState.state) {
            document.getElementById('current-state').innerHTML = 'Turn: O';
            showMove(e, 'X');
            let playerOneScore = Gameboard.playMove(move, 'X');
            checkMove(playerOneScore, 'p1');
            gameState.state = true;
        }
        else {
            document.getElementById('current-state').innerHTML = 'Turn: X';
            showMove(e, 'O');
            let playerTwoScore = Gameboard.playMove(move, 'O');
            checkMove(playerTwoScore, 'p2');
            gameState.state = false;
        }
        e.srcElement.removeEventListener('click', playmove);
        return;
    }

    let showMove = (event, move) => {
        event.srcElement.innerHTML = move;
    } 

    let checkMove = (score, player) => {
        if (score == 'Tie') Game.endGame('Tie', player);
        if (score == 'Win') Game.endGame('Win', player);
    }

    let addListeners = () => {
        let cells = document.querySelectorAll('td[class^=cell]');
        cells.forEach((ele) => {
            ele.addEventListener('click', playmove);
            ele.innerHTML = '';
        })
    }

    let removeListeners = () => {
        let cells = document.querySelectorAll('td[class^=cell]');
        cells.forEach((ele) => {
            ele.removeEventListener('click', playmove);
        })
    }

    return { addListeners, removeListeners, gameState };
})()

let Game = (() => {
    let currPlayers = () => { return { playerOne:'p1', playerTwo:'p2' } };

    let playGame = (gameStartEvent) => {
        let { playerOne, playerTwo } = InputHandler.getPlayerNames(gameStartEvent);
        Players.addPlayer(playerOne);
        Players.addPlayer(playerTwo);
        currPlayers.playerOne = playerOne;
        currPlayers.playerTwo = playerTwo;
        BoardController.gameState.state = false;
        document.getElementById('current-state').innerHTML = 'Turn: X';
        BoardController.removeListeners();
        BoardController.addListeners();
    }

    let endGame = (state, player) => {
        if (state == 'Win') {
            if(player == 'p1'){
                document.getElementById('current-state').innerHTML = `${currPlayers.playerOne} won!!`;
                ScoreBoard.addScore(currPlayers.playerOne);
            }
            else{
                document.getElementById('current-state').innerHTML = `${currPlayers.playerTwo} won!!`;
                ScoreBoard.addScore(currPlayers.playerTwo);
            }
        }
        else{
            document.getElementById('current-state').innerHTML = `It was tie!!`;
        }
        
        Gameboard.clearBoard();
        Players.clearPlayers();
        BoardController.removeListeners();
        ScoreBoardController.displayScores();
    }
    return { playGame, endGame };
})()

let ScoreBoardController = (() => {
    let displayScores = () => {
        removeOldScores();
        let playersList = document.getElementsByClassName('players')[0];
        let scoresList = document.getElementsByClassName('scores')[0];
        for(player of getScores()) {
            let currPlayer = document.createElement('p');
            currPlayer.innerHTML = `${player[0]}`;
            playersList.appendChild(currPlayer);
            
            let currScore = document.createElement('p');
            currScore.innerHTML = `${player[1]}`;
            scoresList.appendChild(currScore);
        }
    }
    
    let removeOldScores = () => {
        for(val of Array.from(document.getElementsByClassName('players')[0].childNodes)){
            val.remove();
        }
        for(val of Array.from(document.getElementsByClassName('scores')[0].childNodes)){
            val.remove();
        }
    }
    
    let getScores = () => {
        let sortedScores = [];
        let scores = ScoreBoard.getAllScores();
        for (let key in scores){
            let curr = [];
            curr.push(key);
            curr.push(scores[key]);
            sortedScores.push(curr);
        }
        sortedScores.sort( (a, b) => b[1]-a[1]);
        return sortedScores;
    }

    return { displayScores } 
})()

document.getElementById('start-game').addEventListener('click', Game.playGame);
