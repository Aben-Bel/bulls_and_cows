const gameBoard = document.querySelector(".game-board");
const side = document.querySelector(".side");
const game = document.querySelector(".game");
const nav = document.querySelector(".nav");
const liPlay = document.querySelector(".nav ul li:nth-child(1)");
const liChat = document.querySelector(".nav ul li:nth-child(2)");
const sideNav = document.querySelector(".side-nav");
const chat = document.querySelector(".chat");
const create = document.querySelector("#createGame");
const token = document.querySelector("#submitToken");
const chooseType = document.querySelector(".choose-type");
const createGameForm = document.querySelector(".create-game-form");
const tokenForm = document.querySelector(".token-form");
const playCreate = document.querySelector("#playCreate");
const playToken = document.querySelector("#playToken");

let gameStarted = false;

const hideEverything = () => {
    nav.classList.add("hide");
    sideNav.classList.add("hide");
    chat.classList.add("hide");
    chooseType.classList.add("hide");
    tokenForm.classList.add("hide");
    createGameForm.classList.add("hide");
}

const startGame = ()=>{
    hideEverything();
    gameStarted = true;
    adjustDisplay();

    gameBoard.classList.remove("hide");


}

const startToken = ()=>{
    hideEverything();
    gameStarted = true;
    adjustDisplay();

    gameBoard.classList.remove("hide");


}

const createGame = ()=>{
    hideEverything();
    createGameForm.classList.remove("hide");
}

const submitToken = ()=>{
    hideEverything();
    tokenForm.classList.remove("hide");


}

const adjustDisplay = ()=>{
    const mq = window.matchMedia( "(max-width: 1030px)" );
    if (mq.matches) {
        // window width is at less than 1030px
        side.classList.add('hide');
        if (gameStarted){
            sideNav.classList.add("hide");

            nav.classList.remove("hide");
        }
    }
    else {
        // window width is greater than 1030px
        side.classList.remove('hide');
        if (gameStarted){
            nav.classList.add("hide");

            gameBoard.classList.remove("hide");
            game.classList.remove("hide");
            sideNav.classList.remove("hide");
            chat.classList.remove("hide");
        }
    }
}


liChat.addEventListener("click", ()=>{
    liChat.classList.add("active");
    liPlay.classList.remove("active");

    gameBoard.classList.add("hide");
    chat.classList.remove("hide");
    side.classList.remove("hide");
    game.classList.add("hide");
});
liPlay.addEventListener("click", ()=>{
    liChat.classList.remove("active");
    liPlay.classList.add("active");

    gameBoard.classList.remove("hide");
    chat.classList.add("hide");
    game.classList.remove("hide");
});
playCreate.addEventListener("click", startGame);
playToken.addEventListener("click", startToken);
create.addEventListener("click", createGame );
token.addEventListener("click", submitToken);
window.addEventListener("resize", adjustDisplay);
