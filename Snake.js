const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Spielfeld-Größe
const tileSize = 40;  // Doppelt so groß wie zuvor
let snake = [{x: 160, y: 160}];  // Startposition der Schlange
let dx = tileSize;  // Bewegung auf der X-Achse
let dy = 0;  // Bewegung auf der Y-Achse
let foodX;
let foodY;
let changingDirection = false; // Verhindert doppelte Richtungsänderung im gleichen Frame
let speed = 200; // Geschwindigkeit der Schlange

// Bild für den Schlangenkopf laden
const headImage = new Image();
headImage.src = 'snake_head.png';  // Pfad zu deinem Bild

// Bild für das Futter laden
const foodImage = new Image();
foodImage.src = 'food.png';  // Pfad zu deinem Futterbild

// Funktion zur Änderung der Bewegungsrichtung
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = dy === -tileSize;
    const goingDown = dy === tileSize;
    const goingRight = dx === tileSize;
    const goingLeft = dx === -tileSize;

    if (changingDirection) return;
    changingDirection = true;

    if (keyPressed === 37 && !goingRight) {  // Links
        dx = -tileSize;
        dy = 0;
    }
    if (keyPressed === 38 && !goingDown) {  // Hoch
        dx = 0;
        dy = -tileSize;
    }
    if (keyPressed === 39 && !goingLeft) {  // Rechts
        dx = tileSize;
        dy = 0;
    }
    if (keyPressed === 40 && !goingUp) {  // Runter
        dx = 0;
        dy = tileSize;
    }
}

// Funktion zum Zeichnen der Schlange
function drawSnake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Spielfeld leeren
    
    snake.forEach((part, index) => {
        if (index === 0) {
            // Zeichne den Kopf als Bild
            ctx.drawImage(headImage, part.x, part.y, tileSize, tileSize);
        } else {
            // Zeichne den Körper als grünes Quadrat
            ctx.fillStyle = 'green';
            ctx.fillRect(part.x, part.y, tileSize, tileSize);
        }
    });
}

// Funktion zum Bewegen der Schlange
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Prüfen, ob die Schlange die Wand berührt
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        alert('Game Over!');  // Nachricht, wenn das Spiel vorbei ist
        document.location.reload();  // Seite neu laden, um das Spiel neu zu starten
    }

    snake.unshift(head);  // Kopf der Schlange hinzufügen
    snake.pop();  // Letztes Teil der Schlange entfernen
    changingDirection = false; // Nach der Bewegung erlauben wir wieder eine Richtungsänderung
}

// Futter erstellen
function createFood() {
    // Zufällige Position für das Futter generieren
    foodX = Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize;
    foodY = Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize;
}

// Futter zeichnen (mit den tatsächlichen Bildmaßen)
function drawFood() {
    const foodWidth = foodImage.width;
    const foodHeight = foodImage.height;
    
    // Berechne die Position, sodass das Bild in der Mitte des Quadrats platziert wird
    const foodXCenter = foodX + (tileSize - foodWidth) / 2;
    const foodYCenter = foodY + (tileSize - foodHeight) / 2;
    
    ctx.drawImage(foodImage, foodXCenter, foodYCenter, foodWidth, foodHeight);
}

// Prüfen, ob die Schlange das Futter isst
function checkIfEaten() {
    if (snake[0].x === foodX && snake[0].y === foodY) {
        snake.push({});  // Schlange verlängern
        createFood();  // Neues Futter erstellen
    }
}

// Spiel-Schleife
function gameLoop() {
    setTimeout(function onTick() {
        moveSnake();  // Bewege die Schlange
        checkIfEaten();  // Prüfen, ob das Futter gegessen wurde
        drawSnake();  // Zeichne die Schlange
        drawFood();  // Zeichne das Futter
        gameLoop();  // Wiederhole das Spiel
    }, speed);
}

createFood();  // Erstes Futter erstellen
gameLoop();  // Spiel starten
