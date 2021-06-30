'use strict';
const MAX_ENEMY = 6;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    recordText = document.querySelector('.record');

let recording = 0;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    traffic: 3,
    speed: 3,
};

let audio = new Audio('ride.mp3');
audio.volume = 0.1;

const changeLevel = (lvl) => {
    switch(lvl) {
        case '1':
            setting.traffic = 4;
            setting.speed = 5;
            break;
        case '2':
            setting.traffic = 4;
            setting.speed = 7;
            break;
        case '3':
            setting.traffic = 4;
            setting.speed = 11;
            break;
    }
};

function getQuantityElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

function startGame(event) {
    const target = event.target;
    if (!target.classList.contains('speedbtn')) return;
    const levelGame = target.dataset.levelGame;
    changeLevel(levelGame);
    start.classList.add('hide');
    gameArea.innerHTML = '';
    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * HEIGHT_ELEM) + 'px';
        line.style.height = (HEIGHT_ELEM / 2) + 'px';
        line.y = i * HEIGHT_ELEM;
        gameArea.append(line);
    }
    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.background = `
            transparent 
            url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png) 
            center / cover 
            no-repeat`;
        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    car.style.bottom = '10px';
    car.style.top = 'auto';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    audio.play();
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = 'SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }
        if (keys.ArrowDown  && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        if (setting.score > recording) {
            recording = setting.score;
            recordText.innerHTML = recording;
        }
        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function play() {
    audio.play();
}

function stop() {
    audio.pause();
    audio.currentTime = 0;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        if (line.y >= gameArea.offsetHeight) {
            line.y = -HEIGHT_ELEM;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
            stop();
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= gameArea.offsetHeight) {
            item.y = -HEIGHT_ELEM * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);