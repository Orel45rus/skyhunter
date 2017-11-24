$(document).ready(main);

var canvas;
var ctx;

function main() {
    init();

    move();
}

function init() {
    canvas = document.getElementById("map");
    ctx = canvas.getContext("2d");
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setBg() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function move() {
    let x = 0;
    let y = 0;
    ctx.fillstyle = "#777";
    ctx.fillRect(x, y, 100, 100);
    setTimeout(function () {
        setInterval(function () {
            if (x < canvas.width - 100 && y == 0) {
                x++;
            } else if (y < canvas.height - 100 && x == canvas.width - 100) {
                y++;
            } else if (y == canvas.height - 100 && x > 0) {
                x--;
            } else if (x < canvas.width - 100 && y > 0) {
                y--;
            }
            clear();
            ctx.fillstyle = "#777";
            ctx.fillRect(x, y, 100, 100);
            $("p").html("("+x+");("+y+")"); 
        }, 0.1);
    }, 100);
}