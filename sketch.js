const topRoadPercentage = 0.05;
const bottomRoadPercentage = 0.9;

let debugMode;
let horizon;
let end;
let distance;

let moving;
let endIndex;
let dir;

let playerX;
let playerY;
let carWidth;
let carHeight;

let playerSpeed;
let maxSpeed;
let acceleration;
let deceleration;

function setup() {
    createCanvas(windowWidth, windowHeight);
    debugMode = false;
    end = width / 2;
    horizon = height * 0.5;
    distance = 0;

    moving = false;
    endIndex = 0;
    dir = 1;

    playerX = end;
    playerY = horizon * 0.2;
    carWidth = width * 0.2;
    carHeight = height * 0.16;

    playerSpeed = 0;
    maxSpeed = 0.75;
    acceleration = 0;
    deceleration = 0;
}

function middle(y) {
    let a = (end - width / 2) / -pow(horizon, 3);
    return -a * pow(y, 3) + width / 2;
}

function oscillator(y, modifier) {
    let x = 8 / horizon * y + 0.5;
    return abs(sin(modifier * pow(x, 2) + 0.5 * distance));
}

function drawGrass() {
    noStroke();
    for (let y = horizon - 1; y >= 0; y--) {
        if (oscillator(y, 0.5) - oscillator(y - 1, 0.5) > 0)
            fill(0, 104, 0);
        else
            fill(0, 88, 0);
        rect(0, height - y, width, 2);
    }
}

function drawKerbs() {
    const bottomKerbPercentage = bottomRoadPercentage + 0.1;
    const topKerbPercentage = topRoadPercentage * bottomKerbPercentage / bottomRoadPercentage;
    noStroke();
    let kerbWidth = 0;
    for (let y = 0; y < horizon; y++) {
        kerbWidth = (topKerbPercentage - bottomKerbPercentage) / (horizon) * y + bottomKerbPercentage;
        kerbWidth *= width;
        if (oscillator(y, 0.2) - oscillator(y - 1, 0.2) > 0)
            fill(255);
        else
            fill(228, 0, 88);
        rect(middle(y) - kerbWidth / 2, height - y, kerbWidth, 2);
    }
}

function roadWidth(y) {
    return ((topRoadPercentage - bottomRoadPercentage) / (horizon) * y + bottomRoadPercentage) * width;
}

function drawRoad() {
    noStroke();
    fill(0, 0, 0);
    let w = 0;
    for (let y = 0; y < horizon; y++) {
        w = roadWidth(y);
        rect(middle(y) - w / 2, height - y, w, 2);
    }
}

function drawRoadLines() {
    const bottomLinePercentage = 0.005;
    const topLinePercentage = topRoadPercentage * bottomLinePercentage / bottomRoadPercentage;
    noStroke();
    let lineWidth = 0;
    for (let y = 0; y < horizon; y++) {
        fill(255);
        lineWidth = (topLinePercentage - bottomLinePercentage) / (horizon) * y + bottomLinePercentage;
        lineWidth *= width;
        rect(middle(y) - lineWidth / 2, height - y, lineWidth, 2);

        fill(255);
        rect(middle(y) - roadWidth(y) / 2 - lineWidth * 1, height - y, lineWidth * 4, 2);
        rect(middle(y) + roadWidth(y) / 2 - lineWidth * 3, height - y, lineWidth * 4, 2);
    }
}

function debugRacingLine() {
    if (!debugMode)
        return;

    stroke(255, 0, 0);
    beginShape(LINES);
    for (let y = 0; y < horizon; y++) {
        vertex(middle(y), height - y);
    }
    endShape();
}

function drawTrack() {
    drawGrass();
    drawKerbs();
    drawRoad();
    drawRoadLines();
}

function pseudoRetroEffect() {
    noStroke();
    fill(0);
    for (let y = 0; y < height; y += 2) {
        rect(0, y, width, 1);
    }
}

function drawCar() {
    noStroke();
    
    fill(200, 0, 0);
    // 65 = A, 37 = Left Arrow
    if (keyIsDown(65) || keyIsDown(37)) {
        rect(playerX - carWidth * 0.9 / 2 - carHeight * 0.3, height - playerY - carHeight * 1, carWidth * 0.9, carHeight * 0.6);
    }
    // 68 = D, 39 = Right Arrow
    else if (keyIsDown(68) || keyIsDown(39)) {
        rect(playerX - carWidth * 0.9 / 2 + carHeight * 0.3, height - playerY - carHeight * 1, carWidth * 0.9, carHeight * 0.6);
    } else {
        rect(playerX - carWidth * 0.9 / 2, height - playerY - carHeight * 1, carWidth * 0.9, carHeight * 0.6);
    }

    fill(255, 0, 0);
    rect(playerX - carWidth / 2, height - playerY - carHeight * 0.8, carWidth, carHeight);

    fill(255);
    circle(playerX - carWidth / 2 * 0.8, height - playerY - carHeight / 2 * 0.8, width * 0.025);
    circle(playerX - carWidth / 2 * 0.55, height - playerY - carHeight / 2 * 0.8, width * 0.02);
    circle(playerX + carWidth / 2 * 0.8, height - playerY - carHeight / 2 * 0.8, width * 0.025);
    circle(playerX + carWidth / 2 * 0.55, height - playerY - carHeight / 2 * 0.8, width * 0.02);

    if (debugMode) {
        fill(255);
        circle(playerX, height - playerY, width * 0.01);
    }
}

function updatePlayer() {
    // Moving Forward Logic.         
    // 87 = W, 38 = Up Arrow    
    if (keyIsDown(87) || keyIsDown(38)) {
        // Off Road
        if (playerX - carWidth / 2 < middle(playerY) - roadWidth(playerY) / 2 || playerX + carWidth / 2 > middle(playerY) + roadWidth(playerY) / 2) {
            playerSpeed = playerSpeed + acceleration > maxSpeed * 0.1 ? playerSpeed + acceleration : maxSpeed * 0.1;
            acceleration += deceleration;
            deceleration -= 0.00001;
        }
        // On Road
        else {
            if (acceleration < 0) {
                acceleration = 0.00001;
            }
            playerSpeed = playerSpeed + acceleration < maxSpeed ? playerSpeed + acceleration : maxSpeed;
            acceleration += 0.00002;
        }
    } else {
        if (moving) {
            playerSpeed = playerSpeed + acceleration > 0 ? playerSpeed + acceleration : 0;
            acceleration += deceleration;
            deceleration -= 0.000002;
        }
    }

    distance += playerSpeed;
    moving = playerSpeed > 0;

    if (!moving){
        deceleration = 0;
    }

    // Moving Laterally Logic
    // 65 = A, 37 = Left Arrow
    if (keyIsDown(65) || keyIsDown(37)) {
        playerX -= 4 / (playerSpeed + 1);
    }
    // 68 = D, 39 = Right Arrow
    if (keyIsDown(68) || keyIsDown(39)) {
        playerX += 4 / (playerSpeed + 1);
    }
}

function updateTrack() {
    if (moving) {
        if (distance < 100) {
            end = width / 2;
        } else {
            end = width / 2 + dir * sin(endIndex) * width / 2;
            endIndex += playerSpeed * 0.01;

            playerX += 5 * playerSpeed * dir * -1;

            if (sin(endIndex) <= 0) {
                distance = 0;
                endIndex = 0;
                dir = random() * 10 < 5 ? -1 : 1;
            }
        }
    }
}

function draw() {
    background(0);

    updatePlayer();
    updateTrack();

    drawTrack();
    debugRacingLine();

    drawCar();

    pseudoRetroEffect();
}