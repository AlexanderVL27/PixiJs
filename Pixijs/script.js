let app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    transparent: false,
    resolution: 1
});

document.body.appendChild(app.view);

let fondoTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/fondo.jpg');
let fondoSprite = new PIXI.Sprite(fondoTexture);
fondoSprite.width = window.innerWidth;
fondoSprite.height = window.innerHeight;
fondoSprite.position.set(0, 0);
app.stage.addChild(fondoSprite);

let arbolConHojasTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/arbol.png');
let arbolSinHojasTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/arbolpelon.png');

let arbolSprite = new PIXI.Sprite(arbolConHojasTexture);
let distanciaDesdeElBorde = 50;
let alturaDesdeArriba = 100;
arbolSprite.position.set(distanciaDesdeElBorde, alturaDesdeArriba);
app.stage.addChild(arbolSprite);

let hojas = [];

arbolSprite.interactive = true;
arbolSprite.buttonMode = true;
arbolSprite.on('click', () => {
    arbolSprite.texture = arbolSinHojasTexture;

    let cantidadHojas = Math.floor(Math.random() * 5) + 5; // Reducir la cantidad de hojas

    for (let i = 0; i < cantidadHojas; i++) {
        let hojaTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/hoja.png');
        let hojaSprite = new PIXI.Sprite(hojaTexture);

        let posicionXHoja = arbolSprite.x + Math.random() * arbolSprite.width * 0.8;
        let posY = Math.random() * -50 - 20;

        hojaSprite.position.set(posicionXHoja, arbolSprite.y + posY);
        app.stage.addChild(hojaSprite);
        hojas.push(hojaSprite);

        const cantidadPuntos = 20;
        let points = [];

        for (let j = 0; j < cantidadPuntos; j++) {
            points.push(new PIXI.Point(j * 5, 0));
        }

        const ropeTexture = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/hoja.png');
        const rope = new PIXI.SimpleRope(ropeTexture, points);
        rope.x = hojaSprite.x;
        rope.y = hojaSprite.y;
        app.stage.addChild(rope);

        let time = 0;

        app.ticker.add(() => {
            for (let j = 0; j < cantidadPuntos; j++) {
                points[j].y += Math.sin(j * 0.3 + time) * 0.5;
                points[j].y += 1;

                if (points[j].y > arbolSprite.y + arbolSprite.height) {
                    points[j].y = arbolSprite.y + arbolSprite.height;
                }
            }

            time += 0.1;
            rope.points = points;

            hojaSprite.y += 1;
            let alturaFinalArbol = arbolSprite.y + arbolSprite.height;

            if (hojaSprite.y > alturaFinalArbol) {
                hojaSprite.y = alturaFinalArbol;
                app.ticker.remove(app.ticker);
            }
        });
    }
});

let segmentCount = 4;
let segmentTextures = [];

for (let i = 0; i < segmentCount; i++) {
    segmentTextures.push(PIXI.Texture.from(`http://127.0.0.1:3000/imagenes/pajaro_${i + 1}.png`));
}

let pajaroSprite = new PIXI.Sprite(segmentTextures[0]);
pajaroSprite.anchor.set(0.5, 0.5);
pajaroSprite.visible = false;
app.stage.addChild(pajaroSprite);

arbolSprite.interactive = true;
arbolSprite.buttonMode = true;
arbolSprite.on('click', () => {
    arbolSprite.texture = arbolSinHojasTexture;

    pajaroSprite.position.set(arbolSprite.x + arbolSprite.width / 2, arbolSprite.y + arbolSprite.height / 2);
    pajaroSprite.visible = true;

    let flyingUp = true;
    let frameIndex = 0;

    let vueloPajaro = () => {
        let vuelo = setInterval(() => {
            if (flyingUp) {
                pajaroSprite.y -= 2;
                if (pajaroSprite.y <= arbolSprite.y) {
                    flyingUp = false;
                }
            } else {
                pajaroSprite.x += 2;
                if (pajaroSprite.x + pajaroSprite.width >= window.innerWidth) {
                    clearInterval(vuelo);
                    pajaroSprite.visible = false;
                }
            }
            pajaroSprite.texture = segmentTextures[frameIndex];
            frameIndex++;

            if (frameIndex >= segmentTextures.length) {
                frameIndex = 0;
            }
        }, 95);
    };

    vueloPajaro();
});

const textureCueva = PIXI.Texture.from('http://127.0.0.1:3000/imagenes/cueva.png');

const cueva = new PIXI.Sprite(textureCueva);
cueva.anchor.set(1, 0.5);
cueva.position.set(window.innerWidth - 50, window.innerHeight / 2);
app.stage.addChild(cueva);


let caballoTextures = [];
let movingRight = false;
let currentIndex = 0;

for (let i = 1; i <= 16; i++) {
    caballoTextures.push(PIXI.Texture.from(`http://127.0.0.1:3000/imagenes/caballo_${i <= 8 ? i : 17 - i}.png`));
}

let caballoSprite = new PIXI.AnimatedSprite(caballoTextures.slice(0, 8)); 
caballoSprite.animationSpeed = 0.2;
caballoSprite.position.set(window.innerWidth, 450);
caballoSprite.scale.x = -1;
caballoSprite.play();
app.stage.addChild(caballoSprite);

app.ticker.add(() => {
    if (movingRight) {
        caballoSprite.x += 2;
        if (caballoSprite.x > window.innerWidth) {
            movingRight = false;
            currentIndex = 7;
            caballoSprite.textures = caballoTextures.slice(currentIndex, currentIndex + 8);
            caballoSprite.scale.x = -1;
            caballoSprite.x = window.innerWidth;
            caballoSprite.gotoAndPlay(0);
        }
    } else {
        caballoSprite.x -= 2;

        if (caballoSprite.x + caballoSprite.width < 0) {
            movingRight = true;
            currentIndex = 0;
            caballoSprite.textures = caballoTextures.slice(currentIndex, currentIndex + 8);
            caballoSprite.scale.x = 1;
            caballoSprite.x = -caballoSprite.width;
            caballoSprite.gotoAndPlay(0);
        }
    }
});


