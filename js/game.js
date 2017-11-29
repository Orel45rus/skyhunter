$(document).ready(main);

var gameWidth;
var gameHeight;

var stars = [];

var map;
var ctxMap;

var pl;
var ctxPlayer;
var player;

var meteorite;
var ctxMeteor;
var meteorites = [];

var fuel;
var score;
var scoreSec = 0;
var scoreMin = 0;

var canister;
var ctxCanister;

var bonusCount = 0;
var bonus;
var ctxBonus;

var requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;

var isPlaying;
var pause = false;

var spawnAmount = 6;

var starsCount = 200;

var stats;
var ctxStats;

var gameOver;
var ctxGameOver;

var starImg = new Image();
starImg.src = "./img/star.png";

var shipImg = new Image();
shipImg.src = "./img/ship.png";

var meteoriteImg = new Image();
meteoriteImg.src = "./img/meteorite.png";

var canisterImg = new Image();
canisterImg.src = "./img/canister.png";

var bonusImg = new Image();
bonusImg.src = "./img/bonus.png";

function main() {
    init();
    startLoop();
}

//Инициализация
function init() {
    map = document.getElementById("map");
    ctxMap = map.getContext("2d");

    pl = document.getElementById("player");
    ctxPlayer = pl.getContext("2d");

    meteorite = document.getElementById("meteorite");
    ctxMeteor = pl.getContext("2d");

    canister = document.getElementById("canister");
    ctxCanister = canister.getContext("2d");

    bonus = document.getElementById("bonus");
    ctxBonus = bonus.getContext("2d");

    stats = document.getElementById("stats");
    ctxStats = stats.getContext("2d");

    gameOver = document.getElementById("gameover");
    ctxGameOver = gameOver.getContext("2d");

    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);

    gameWidth = 1024;
    gameHeight = 768;

    map.width = gameWidth;
    map.height = gameHeight;

    pl.width = gameWidth;
    pl.height = gameHeight;

    meteorite.width = gameWidth;
    meteorite.height = gameHeight;

    canister.width = gameWidth;
    canister.height = gameHeight;

    bonus.width = gameWidth;
    bonus.height = gameHeight;

    stats.width = gameWidth;
    stats.height = gameHeight;
    ctxStats.fillStyle = "red";
    ctxStats.font = "bold 30px Arial";

    gameOver.width = gameWidth;
    gameOver.height = gameHeight;
    ctxGameOver.fillStyle = "#fff";
    ctxGameOver.font = "bold 25pt Courier";

    fuel = 51;

    player = new Player();
    canister = new Canister();
    bonus = new Bonus();

    updateStats();
}

function clearMap() {
    ctxMap.clearRect(0, 0, gameWidth, gameHeight);
}

function clearPlayer() {
    ctxPlayer.clearRect(0, 0, gameWidth, gameHeight);
}

function clearMeteor() {
    ctxMeteor.clearRect(0, 0, gameWidth, gameHeight);
}

function clearStats() {
    ctxStats.clearRect(0, 0, gameWidth, gameHeight);
}

function clearCanister() {
    ctxCanister.clearRect(0, 0, gameWidth, gameHeight);
}

function clearBonus() {
    ctxBonus.clearRect(0, 0, gameWidth, gameHeight);
}

function clearScreen() {
    clearMap();
    clearPlayer();
    clearMeteor();
    clearStats();
    clearCanister();
    clearBonus();
}

//Случайное значение (min, max)
function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Звезда
function Star() {
    //Задаём размер звезды
    this.size = getRand(5, 10);
    //Задаём начальную точку звезды по (x)
    this.x = getRand(0, map.width);
    //Задаём случайное значение по (y)
    this.y = getRand(0, map.height - this.size * 2);

    this.draw = function () {
        ctxMap.drawImage(starImg, 0, 0, 50, 50, this.x, this.y, this.size, this.size);
        this.move();

        if (this.x < 0 - this.size) {
            this.x = map.width;
            this.y = getRand(0, map.height - this.size);
        }
    };

    this.move = function () {
        this.x += -1;
    };
}

//Игрок
function Player() {
    this.x = 0;
    this.y = 0;
    this.width = 180;
    this.height = 100;

    this.isUp = false;
    this.isDown = false;
    this.isLeft = false;
    this.isRight = false;

    this.speed = 7;

    this.draw = function () {
        ctxPlayer.drawImage(shipImg, 0, 0, 578, 298, this.x, this.y, this.width, this.height);
    };

    this.move = function () {
        //Проверка на столкновение (метеорит)
        for (var i = 0; i < meteorites.length; i++) {
            if (this.x + this.width - 40 > meteorites[i].x &&
                    this.y + this.height - 20 > meteorites[i].y &&
                    this.x < meteorites[i].x + meteorites[i].width - 20 &&
                    this.y < meteorites[i].y + meteorites[i].height - 20) {
                fuel = 0;
            }
        }

        //Проверка на столкновение (канистра)
        if (this.x + this.width > canister.x &&
                this.y + this.height > canister.y &&
                this.x < canister.x + canister.width &&
                this.y < canister.y + canister.height) {
            canister.y = 0 - gameHeight * 1.2;
            fuel += 15;
        }

        //Проверка на столкновение (бонус)
        if (this.x + this.width > bonus.x &&
                this.y + this.height > bonus.y &&
                this.x < bonus.x + bonus.width &&
                this.y < bonus.y + bonus.height) {
            bonus.x = gameWidth * 2.5;
            bonus.y = getRand(0, gameHeight - bonus.height);
            bonusCount++;
        }

        //направление
        this.chooseDir();

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x > map.width - this.width) {
            this.x = map.width - this.width;
        } else if (this.y < 0) {
            this.y = 0;
        } else if (this.y > map.height - this.height) {
            this.y = map.height - this.height;
        }
    };

    this.chooseDir = function () {
        if (this.isUp) {
            this.y -= this.speed;
        } else if (this.isDown) {
            this.y += this.speed;
        } else if (this.isLeft) {
            this.x -= this.speed;
        } else if (this.isRight) {
            this.x += this.speed;
        }
    };
}

//Метеорит
function Meteorite() {
    this.x = getRand(gameWidth, gameWidth * 1.5);
    this.y = getRand(0, gameHeight - this.height);
    this.width = 124;
    this.height = 109;

    this.speed = 4;

    this.draw = function () {
        ctxMeteor.drawImage(meteoriteImg, 0, 0, 658, 580, this.x, this.y, this.width, this.height);
    };

    this.move = function () {
        this.x -= this.speed;

        if (this.x < 0 - this.width) {
            this.x = getRand(gameWidth, gameWidth * 1.5);
            this.y = getRand(0, gameHeight - this.height);
        }
    };
}

//Канистра
function Canister() {
    this.width = 83;
    this.height = 118;
    this.x = getRand(0, gameWidth - this.width * 3);
    this.y = 0 - gameHeight;

    this.speed = 1.5;

    this.draw = function () {
        ctxCanister.drawImage(canisterImg, 0, 0, 246, 355, this.x, this.y, this.width, this.height);
    };

    this.move = function () {
        this.x += getRand(-1, 1);
        this.y += this.speed;
    };
}

function Bonus() {
    this.width = 62;
    this.height = 60;
    this.x = gameWidth * 2;
    this.y = getRand(0, gameHeight - this.height);

    this.draw = function () {
        ctxBonus.drawImage(bonusImg, 0, 0, 370, 356, this.x, this.y, this.width, this.height);
    };

    this.move = function () {
        this.x -= 4;

        //Не даём улететь звезде
        if (this.x < 0 - this.width) {
            this.x = gameWidth * 2;
        }
    };
}

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        player.isUp = true;
        e.preventDefault();
    }
    if (keyChar == "S") {
        player.isDown = true;
        e.preventDefault();
    }
    if (keyChar == "A") {
        player.isLeft = true;
        e.preventDefault();
    }
    if (keyChar == "D") {
        player.isRight = true;
        e.preventDefault();
    }
    if (e.keyCode == 32) {
        setPause();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        player.isUp = false;
        e.preventDefault();
    }
    if (keyChar == "S") {
        player.isDown = false;
        e.preventDefault();
    }
    if (keyChar == "A") {
        player.isLeft = false;
        e.preventDefault();
    }
    if (keyChar == "D") {
        player.isRight = false;
        e.preventDefault();
    }
}

function checkFuel() {
    if (fuel <= 0) {
        stopLoop();
        gameOverScreen();
    } else {
        fuel -= 0.016;
    }
}

function spawnMeteor() {
    for (let i = 0; i < spawnAmount; i++) {
        meteorites[i] = new Meteorite();
    }
}

function drawStars() {
    for (let i = 0; i < starsCount; i++) {
        stars[i] = new Star();
    }
}

function timer() {
    if (isPlaying) {
        scoreSec += 0.016;
        if (Math.floor(scoreSec) > 9) {
            score = Math.floor(scoreMin) + ":" + Math.floor(Math.floor(scoreSec) - Math.floor(scoreMin) * 60);
        } else {
            score = Math.floor(scoreMin) + ":0" + Math.floor(Math.floor(scoreSec) - Math.floor(scoreMin) * 60);
        }
        if (scoreSec >= 60) {
            scoreMin = Math.floor(scoreSec / 60);
        } else {
            if (Math.floor(scoreSec) > 9) {
                score = Math.floor(scoreSec);
            } else {
                score = "0" + Math.floor(scoreSec);
            }
        }
    }
}

function setPause() {
    if (pause == false)
        pause = true;
    else
        pause = false;
}

function startLoop() {
    isPlaying = true;
    loop();
    spawnMeteor();
    drawStars();
}

function loop() {
    if (isPlaying) {
        clearScreen();
        drawScreen();
        update();
        requestAnimFrame(loop);
    }
}

function stopLoop() {
    isPlaying = false;
}

function drawScreen() {
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw();
    }

    canister.draw();
    bonus.draw();

    for (let i = 0; i < meteorites.length; i++) {
        meteorites[i].draw();
    }
    player.draw();
}

function update() {
    updateStats();
    if (!pause) {
        checkFuel();
        timer();
        player.move();

        for (let i = 0; i < meteorites.length; i++) {
            meteorites[i].move();
        }

        canister.move();
        bonus.move();

        for (let i = 0; i < stars.length; i++) {
            stars[i].move();
        }
    }
}

function updateStats() {
    clearStats();
    if (!pause) {
        ctxStats.fillText("Bonus: " + bonusCount + "\r\n Fuel: " + Math.floor(fuel) + "\r\n Time: " + score, 20, 30);
    } else {
        ctxStats.fillText("Game is paused", 20, 30);
    }
}

function gameOverScreen() {
    clearScreen();
    ctxGameOver.clearRect(0, 0, gameWidth, gameHeight);
    ctxGameOver.fillText("GAME OVER!" + "\r\n TIME: " + score + "\r\n SCORE: " + bonusCount, gameWidth / 2 - 350, gameHeight / 2 - 15);
    ctxGameOver.fillText("Нажмите F5, чтобы попробовать ещё!", gameWidth / 2 - 300, gameHeight / 1.7);
}
