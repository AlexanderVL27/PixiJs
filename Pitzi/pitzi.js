
const app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);

// Crear el fondo del mar
const marTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/mar1.png');
const mar = new PIXI.TilingSprite(marTexture, app.screen.width, app.screen.height);
app.stage.addChild(mar);

// Ajustar el tamaño del fondo del mar al ancho de la ventana
mar.width = window.innerWidth;

// Crear la isla
const islaTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/isla2.png');
const isla = new PIXI.Sprite(islaTexture);
isla.anchor.set(0.5);
isla.x = app.screen.width + isla.width; // Posicionar la isla fuera de la pantalla inicialmente
isla.y = app.screen.height * 0.55; // Posicionar la isla un poco más abajo
app.stage.addChild(isla);

// Crear el barco
const barcoTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/varco.png');
const barco = new PIXI.Sprite(barcoTexture);
barco.anchor.set(0.5);
barco.x = app.screen.width / 2;
barco.y = app.screen.height * 0.72; // Posicionar el barco un poco más arriba
app.stage.addChild(barco);

// Variable para el movimiento del mar, del barco y de la isla
const amplitudeMar = 30; // Amplitud del movimiento del mar
const amplitudeBarco = 15; // Amplitud del movimiento del barco
const islaSpeed = 2; // Velocidad de desplazamiento de la isla
let angleMar = 0;
let angleBarco = 0;
let velocidadBarcoX = 1;

// Función para mover el fondo del mar en una onda sinusoidal
function moverMar() {
    const offsetY = amplitudeMar * Math.sin(angleMar); // Obtener el desplazamiento vertical para el fondo del mar
    mar.tilePosition.y = offsetY;
    angleMar += 0.02; // Cambiar el ángulo para simular el movimiento de las olas del mar
}

function moverBarco() {
    // Movimiento sinoidal en el eje Y (opcional, para simular el oleaje)
    const offsetY = amplitudeBarco * Math.sin(app.ticker.lastTime * 0.002);
    barco.y = app.screen.height * 0.72 + offsetY; // Ajusta la posición en Y del barco según el movimiento sinoidal

    // Movimiento horizontal del barco a lo largo de la pantalla
    barco.x += velocidadBarcoX;

    // Si el barco sale completamente de la pantalla por la derecha, reposicionarlo al otro extremo
    if (barco.x > app.screen.width + barco.width) {
        barco.x = -barco.width;
    }
}

// Función para mover la isla horizontalmente y reiniciar su posición al salir de la pantalla
function moverIsla() {
    isla.x -= islaSpeed; // Mover la isla hacia la izquierda

    // Si la isla sale completamente de la pantalla, reposicionarla al lado derecho de la ventana
    if (isla.x < -isla.width) {
        isla.x = app.screen.width + isla.width;
    }
}


app.ticker.add(() => {
    moverMar();
    moverBarco();
    moverIsla();
    moverGaviota();
    detectarColisiones();
});


function crearProyectil(startX, startY, endX, endY) {
    const proyectil = new PIXI.Graphics();
    proyectil.beginFill(0xFF0000); // Color del proyectil (puedes cambiarlo)
    proyectil.drawRect(0, 0, 10, 10); // Tamaño del proyectil (puedes ajustarlo)
    proyectil.endFill();
    proyectil.position.set(startX, startY);

    // Calcular la dirección y la distancia para el movimiento del proyectil
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = 5; // Velocidad del proyectil (puedes ajustarlo)

    const moveX = (deltaX / distance) * speed;
    const moveY = (deltaY / distance) * speed;

    // Función de actualización del proyectil en cada fotograma
    proyectil.update = function () {
        proyectil.position.x += moveX;
        proyectil.position.y += moveY;

        // Eliminar el proyectil cuando sale de la pantalla
        if (proyectil.position.x < 0 || proyectil.position.x > app.screen.width ||
            proyectil.position.y < 0 || proyectil.position.y > app.screen.height) {
            app.stage.removeChild(proyectil);
            app.ticker.remove(proyectil.update);
        }
    };

    app.stage.addChild(proyectil);
    app.ticker.add(proyectil.update);
}
// Contador de golpes a la gaviota
let contadorGolpes = 0;

// Elemento HTML para mostrar el contador en pantalla
const contadorHTML = document.getElementById('contador');

// Evento de clic en la ventana (en cualquier lugar)
app.view.addEventListener('click', (event) => {
    const clickX = event.clientX;
    const clickY = event.clientY;

    crearProyectil(barco.x, barco.y, clickX, clickY);
    
});

// Crear una textura base para la gaviota
const gaviotaTextures = []; // Aquí almacenaremos las texturas de la animación de las alas

// Cargar las texturas de la animación de las alas de la gaviota
for (let i = 1; i <= 4; i++) { // Cambia el rango según la cantidad de imágenes de la animación
    const texture = PIXI.Texture.from(`http://127.0.0.1:3000/imagenes/gaviota_${i}.PNG`); // Reemplaza con la ruta y nombres correctos
    gaviotaTextures.push(texture);
}

// Crear el sprite animado de la gaviota
const gaviota = new PIXI.AnimatedSprite(gaviotaTextures);
gaviota.animationSpeed = 0.02; // Velocidad de la animación
gaviota.play(); // Iniciar la animación

// Posicionar la gaviota y configurar su movimiento
gaviota.position.set(-gaviota.width, 100); // Posición inicial fuera de la pantalla a la izquierda
app.stage.addChild(gaviota);

// Función para mover la gaviota de izquierda a derecha
function moverGaviota() {
    gaviota.x += 2; // Velocidad horizontal de movimiento de la gaviota

    // Si la gaviota sale completamente de la pantalla, reposicionarla a la izquierda
    if (gaviota.x > app.screen.width + gaviota.width) {
        gaviota.x = -gaviota.width;
    }
}

// Guardar la posición inicial de la gaviota
const gaviotaInicioX = -gaviota.width; // Modificar según la posición inicial en X
const gaviotaInicioY = 100; // Modificar según la posición inicial en Y

// Función para detectar colisiones entre la gaviota y los proyectiles

function detectarColisiones() {
    for (let i = 0; i < app.stage.children.length; i++) {
        const child = app.stage.children[i];

        // Verificar si el objeto es un proyectil
        if (child !== gaviota && child !== mar && child !== isla) {
            if (hitTestRectangle(child, gaviota)) {
                if (child.update) { // Verificar si el proyectil tiene la función de actualización
                    child.update(); // Actualizar la posición del proyectil
                }
                app.stage.removeChild(child); // Eliminar el proyectil
                contadorGolpes++; // Incrementar el contador
                contadorHTML.textContent = `Golpes: ${contadorGolpes}`; // Actualizar el contador en el elemento HTML
                console.log('¡Le diste a la gaviota!');
                console.log(`Golpes: ${contadorGolpes}`);
            }
        }
    }
}


// Función para verificar colisiones entre dos sprites
function hitTestRectangle(obj1, obj2) {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();
    return bounds1.x + bounds1.width > bounds2.x &&
        bounds1.x < bounds2.x + bounds2.width &&
        bounds1.y + bounds1.height > bounds2.y &&
        bounds1.y < bounds2.y + bounds2.height;
}

const delfinTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/delfin.png');
const delfin = new PIXI.Sprite(delfinTexture);
delfin.anchor.set(0.5);
delfin.x = app.screen.width * 0.1;
delfin.y = app.screen.height * 0.08;
delfin.visible = false;

app.stage.addChild(delfin);

const points = [];
const segments = 25; // Reducir aún más el número de segmentos para disminuir a la mitad el tamaño de la cuerda
for (let i = 0; i < segments; i++) {
    points.push(new PIXI.Point(i * 10, Math.sin(i * 0.4) * 2.5)); // Ajustar la amplitud y la frecuencia
}

const rope = new PIXI.SimpleRope(delfinTexture, points);
rope.x = 0;
rope.y = app.screen.height * 0.71;
app.stage.addChild(rope);

let delfinVisible = false;

setInterval(() => {
    delfinVisible = !delfinVisible;
    delfin.visible = delfinVisible;
}, 2000);

function moverDelfin() {
    if (delfin.visible) {
        const offsetY = 2.5 * Math.sin(app.ticker.lastTime * 0.01);
        delfin.y = app.screen.height * 0.71 + offsetY;
    }
}

app.ticker.add(() => {
    moverDelfin();
    for (let i = 0; i < segments; i++) {
        points[i].y = Math.sin(i * 0.4 + app.ticker.lastTime * 0.005) * 2.5; // Ajustar la amplitud y la frecuencia 
    }
    rope.points = points;
});
app.stage.addChild(barco);
