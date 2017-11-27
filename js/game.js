$(document).ready(main);

var stars = [];

var map;
var ctxMap;

var pl;
var ctxPlayer;
var player;

var meteorite;
var ctxMeteor;
var meteorites = [];

var requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;

var isPlaying;

var spawnAmount = 6;

var starsCount = 200;

var stats;
var ctxStats;

var starImg = new Image();
starImg.src = "./img/star.png";

var shipImg = new Image();
shipImg.src = "./img/ship.png";

var meteoriteImg = new Image();
meteoriteImg.src = "./img/meteorite.png";

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

    stats = document.getElementById("stats");
    ctxStats = stats.getContext("2d");

    meteorite = document.getElementById("meteorite");
    
    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);

    //Размер карты
    map.width = 1024;
    map.height = 768;

    //Размер модели игрока
    pl.width = 180;
    pl.height = 100;

    //Размер метеорита
    meteorite.width = 165;
    meteorite.height = 145;
    
    ctxStats.fillStyle = "#3d3d3d";
    ctxStats.font = "bold 15pt Arial";

    player = new Player();
    
    updateStats();
}

//Очистить экран
function clearScreen() {
    ctxMap.clearRect(0, 0, map.width, map.height);
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
    this.width = pl.width;
    this.height = pl.height;
    
    this.isUp = false;
    this.isDown = false;
    this.isLeft = false;
    this.isRight = false;

    this.speed = 7;

    this.draw = function () {
        clearScreen();
        ctxMap.drawImage(shipImg, 0, 0, 578, 298, this.x, this.y, this.width, this.height);
    };
    
    this.move = function () {
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
    this.x = getRand(map.width, map.width * 3);
    this.y = getRand(0, map.height - meteorite.height);
    this.width = meteorite.width;
    this.height = meteorite.height;

    this.speed = 4;

    this.draw = function () {
        ctxMap.drawImage(meteoriteImg, 0, 0, 658, 580, this.x, this.y, this.width, this.height);
    };
    
    this.move = function () {
        this.x -= this.speed;
        
        if (this.x < 0 - meteorite.width) {
            this.x = getRand(map.width, map.width * 1.5);
            this.y = getRand(0, map.height - meteorite.height);
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

function spawnMeteor(count) {
    for (var i = 0; i < spawnAmount; i++) {
        meteorites[i] = new Meteorite();
    }
}

function drawStars() {
    for (var i = 0; i < starsCount; i++) {
        stars[i] = new Star();
    }
}

function loop() {
    if (isPlaying) {
        drawScreen();
        update();
        requestAnimFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
    spawnMeteor();
    drawStars();
}

function stopLoop() {
    isPlaying = false;
}

function drawScreen() {
    player.draw();
    
    for (var i = 0; i < stars.length; i++) {
        stars[i].draw();
    }
    
    for (var i = 0; i < meteorites.length; i++) {
        meteorites[i].draw();
    }
}

function update() {
    player.move();
    
    for (var i = 0; i < meteorites.length; i++) {
        meteorites[i].move();
    }
    
    for (var i = 0; i < stars.length; i++) {
        stars[i].move();
    }
}

function updateStats() {
    ctxStats.clearRect(0, 0, map.width, map.height);
    ctxStats.fillText("Player", 20, 20);
}

//function drawScreen() {
//    let stars = [];
//    let count = 0;
//    setInterval(function () {
//        clearScreen();
//
//        //Создаём массив из движущихся звёзд
//        stars[count] = new Star();
//        count++;
//        for (let i = 0; i < count; i++) {
//            stars[i].drawStar();
//        }
//        //Рисуем игрока
//        player.draw();
//        meteorite.draw();
//    }, 50);
//}