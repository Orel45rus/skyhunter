$(document).ready(init);
function init() {
    function getCanvas() {
        let canvas = document.getElementById("map");
        return canvas;
    }

    function getCtx() {
        let canvas = getCanvas();
        let ctx = canvas.getContext("2d");
        return ctx;
    }

    function setBg() {
        let canvas = getCanvas();
        let ctx = getCtx();
        
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    setBg();
}