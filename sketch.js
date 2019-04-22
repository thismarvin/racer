
const topRoadPercentage = 0.1;
const bottomRoadPercentage = 1.1;

let debugMode;
let horizon;
let distance;
let dir;

function setup() {
    createCanvas(windowWidth, windowHeight);
    debugMode = false;
    horizon = height - height * 0.3;
    distance = 0;
    dir = 1;
}

function middle(y){
    let i = y + distance;
    //return width / 2;
    return width / 2 * sin(i / width * 8) + width / 2;
    //return 100 * sin(i / 100) + width / 2;
}

function oscillator(num, modifier) {
    return abs(sin(modifier * num * num + 0.2 * distance));
    //return abs(sin(modifier * num * num + 0.1 * distance));
}

function drawGrass() {
    noStroke();
    for (let y = horizon; y >= 0; y-= 4) {
        if (oscillator(y, 0.00009) - oscillator(y - 1, 0.00009) > 0)
            fill(0, 135, 81);
        else
            fill(0, 231, 86);
        rect(0, height - y, width, 3);
    }
}

function drawKerbs(){
    const topKerbPercentage = topRoadPercentage + 0.015;
    const bottomKerbPercentage = bottomRoadPercentage * topKerbPercentage / topRoadPercentage;
    noStroke();
    let kerbWidth = 0;
    for (let y = horizon; y >= 0; y-= 4) {
        if (oscillator(y, 0.00008) - oscillator(y - 1, 0.00008) > 0)
            fill(255);
        else
            fill(255, 0, 0);
        kerbWidth = (topKerbPercentage - bottomKerbPercentage) / (horizon) * y + bottomKerbPercentage;
        kerbWidth *= width;
        rect(middle(y) - kerbWidth / 2, height - y, kerbWidth, 3);
    }
}

function drawRoad() {
    noStroke();
    fill(0);
    let roadWidth = 0;
    for (let y = horizon; y >= 0; y-= 2) {
        roadWidth = (topRoadPercentage - bottomRoadPercentage) / (horizon) * y + bottomRoadPercentage;
        roadWidth *= width;
        rect(middle(y) - roadWidth / 2, height - y, roadWidth, 3);
    }
}

function debugRacingLine(){
    if (!debugMode)
        return;

    stroke(255,0,0);
    beginShape(LINES);
    for (let y = horizon; y >= 0; y--) {
        vertex(middle(y), height - y);
    }
    endShape();
}

function keyPressed(){
    if (keyCode == 32){
        distance++;
    }
}

function draw() {
    background(0);
    distance+=1.5;
    drawGrass();
    drawKerbs();
    drawRoad();

    debugRacingLine();

}