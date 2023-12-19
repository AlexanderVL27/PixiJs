// Crear el lienzo
let app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: 1
});
document.body.appendChild(app.view);
const vueltasParaGanar = 3;
// Cargar la imagen de la pista
let fondoTexture = PIXI.Texture.from('http://127.0.0.1:3001/Imagenes/pista.jpg');
let fondoSprite = new PIXI.Sprite(fondoTexture);
fondoSprite.width = window.innerWidth;
fondoSprite.height = window.innerHeight;
fondoSprite.position.set(0, 0);
app.stage.addChild(fondoSprite);

// Cargar las texturas de los semáforos
let semaforoRojoTexture = PIXI.Texture.from('http://127.0.0.1:3001/Imagenes/semaforor.png');
let semaforoAmarilloTexture = PIXI.Texture.from('http://127.0.0.1:3001/Imagenes/semaforoa.png');
let semaforoVerdeTexture = PIXI.Texture.from('http://127.0.0.1:3001/Imagenes/semaforov.png');

// Crear el sprite del semáforo inicial
let semaforo = new PIXI.Sprite(semaforoRojoTexture);
semaforo.anchor.set(0.5); // Establecer el punto de anclaje en el centro del sprite
semaforo.position.set(app.screen.width / 2.1, app.screen.height / 1.35); // Posicionar en el centro
semaforo.interactive = true;
semaforo.buttonMode = true;
app.stage.addChild(semaforo);

// Array con las texturas de los semáforos en orden
let semaforoTextures = [semaforoRojoTexture, semaforoAmarilloTexture, semaforoVerdeTexture];
let currentIndex = 0;

// Hacer el semáforo interactivo para cambiar las texturas al hacer clic
semaforo.on('click', () => {
    currentIndex = (currentIndex + 1) % semaforoTextures.length;
    semaforo.texture = semaforoTextures[currentIndex];
});

// Cargar las texturas del carro
let carroTexture = PIXI.Texture.from('http://127.0.0.1:3001/Imagenes/carro.png');

// Crear el sprite del carro
let carro = new PIXI.Sprite(carroTexture);
carro.anchor.set(0.5); // Establecer el punto de anclaje en el centro del sprite
carro.position.set(app.screen.width / 2.6, app.screen.height / 1.16); // Posicionar el carro
carro.scale.set(0.2); // Escalar el tamaño del carro si es necesario
app.stage.addChild(carro);

// Variables para el movimiento del carro en ejes X e Y
let speedX = 0;
let speedY = 0;
const speedValue = 5; // Velocidad de movimiento del carro

// Manejar eventos de teclado para mover el carro en múltiples direcciones
function onKeyUp(event) {
    const { keyCode } = event;
    if (keyCode === 37 || keyCode === 39) { // Flecha izquierda o derecha
        speedX = 0;
    } else if (keyCode === 38 || keyCode === 40) { // Flecha arriba o abajo
        speedY = 0;
    }
}

function onKeyDown(event) {
    const { keyCode } = event;
    if (keyCode === 37) { // Flecha izquierda
        speedX = -speedValue;
    } else if (keyCode === 39) { // Flecha derecha
        speedX = speedValue;
    } else if (keyCode === 38) { // Flecha arriba
        speedY = -speedValue;
    } else if (keyCode === 40) { // Flecha abajo
        speedY = speedValue;
    }
}
let pasoSemaforo = false;
let vueltas = 0;
// Agregar eventos de teclado
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// Función para mover el carro
function moveCar() {
    carro.x += speedX;
    carro.y += speedY;
    if (carro.x > semaforo.x && carro.x < semaforo.x + semaforo.width && carro.y > semaforo.y && !pasoSemaforo) {
        pasoSemaforo = true;
        vueltas++;
        document.getElementById('counter').innerText = `Vueltas: ${vueltas}`;
    } else if (carro.y < semaforo.y) {
        pasoSemaforo = false;
    }
    if (vueltas >= vueltasParaGanar) {
        showWinMessage();
        return; // Detener el movimiento del carro
    }
    requestAnimationFrame(moveCar);
    
}


// Crear los puntos para la cuerda sinoidal
const points = [];
const count = 25; // Cantidad de puntos para la cuerda
const spacing = 20; // Espacio entre los puntos
for (let i = 0; i < count; i++) {
    points.push(new PIXI.Point(i * spacing, 0)); // Espacio entre los puntos
}

// Crear la textura de la nube
const nubeTexture = PIXI.Texture.from('http://127.0.0.1:3001/Imagenes/nube.png');

// Crear la cuerda sinoidal usando PIXI.SimpleRope
const nubeRope = new PIXI.SimpleRope(nubeTexture, points);

// Ajustar la posición y escala de la cuerda
nubeRope.position.set(app.screen.width / 2, 130);
nubeRope.scale.set(0.5);

// Añadir la cuerda al stage
app.stage.addChild(nubeRope);

// Variables para controlar el movimiento sinoidal en el eje X
let timeX = 0;
const amplitudeX = 15; // Amplitud del movimiento en X
const frequencyX = 0.02; // Frecuencia del movimiento en X

function updateRope() {
    const speed = 1; // Velocidad del movimiento horizontal

    for (let i = 0; i < count; i++) {
        // Simular movimiento sinoidal ajustando la posición X de los puntos
        points[i].x = i * spacing + Math.sin(timeX + i * 0.5) * amplitudeX;
        // Desplazar la cuerda horizontalmente
        points[i].y = Math.sin(timeX + i * 0.5) * amplitudeX; // Cambia la coordenada Y para el movimiento horizontal
    }

    timeX += frequencyX; // Aumentar el tiempo para el movimiento sinusoide en X

    // Desplazar la cuerda horizontalmente
    nubeRope.position.x += speed;

    // Si quieres que se reinicie al llegar al borde derecho de la pantalla
    if (nubeRope.position.x > app.screen.width + nubeRope.width) {
        nubeRope.position.x = -nubeRope.width;
    }

    // Actualizar la cuerda con los nuevos puntos
    nubeRope.points = points;

    requestAnimationFrame(updateRope);
}

// Llamar a la función para iniciar el movimiento sinoidal de la cuerda
updateRope();
function showWinMessage() {
    const winText = new PIXI.Text('¡Has ganado!', { fontFamily: 'Arial', fontSize: 48, fill: 0x000000 });
    winText.anchor.set(0.5);
    winText.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(winText);
}
moveCar();