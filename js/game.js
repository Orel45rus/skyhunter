$(document).ready(main);

var map;
var ctxMap;

var starImg = new Image();
starImg.src = "./img/star.png";

function main() {
    init();
    drawScreen();
}

//Инициализация
function init() {
    map = document.getElementById("map");
    ctxMap = map.getContext("2d");
}

//Очистить экран
function clearScreen() {
    ctxMap.clearRect(0, 0, map.width, map.height);
}

//Случайное значение (min, max)
function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Установить таймер
function setTimer(a, b) {
    let timer = getRand(a, b);
    return timer;
}

//Рисуем звезду
function Star() {
    //Задаём размер звезды
    this.size = getRand(5, 10);
    //Задаём начальную точку звезды по (x)
    this.x = map.width;
    //Задаём случайное значение по (y)
    this.y = getRand(0, map.height - this.size*2);

    this.drawStar = function () {
        ctxMap.drawImage(starImg, 0, 0, 50, 50, this.x, this.y, this.size, this.size);
        this.moveStar();
    };

    this.moveStar = function () {
        this.x += -15;
    };
}

function drawScreen() {
    let stars = [];
    let count = 0;
    setInterval(function () {
        clearScreen();

        stars[count] = new Star();
        count++;
        for (let i = 0; i < count; i++) {
            stars[i].drawStar();
        }
    }, 50);
}