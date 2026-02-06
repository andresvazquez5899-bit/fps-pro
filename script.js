// ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CÁMARA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// CONTROLES FPS
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => controls.lock());
scene.add(controls.getObject());

// ⬅️ POSICIÓN INICIAL DEL JUGADOR (CLAVE)
controls.getObject().position.set(0, 2, 5);

// LUCES (MUY IMPORTANTE)
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// SUELO
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({
    color: 0x228b22,
    side: THREE.DoubleSide
  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// ENEMIGO DE PRUEBA
const enemy = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
enemy.position.set(0, 1, -10);
scene.add(enemy);

// MOVIMIENTO
const keys = {};
let velocityY = 0;
const gravity = 0.01;
let canJump = false;

document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// LOOP
function animate() {
  requestAnimationFrame(animate);

  // MOVIMIENTO FPS
  if (keys["KeyW"]) controls.moveForward(0.1);
  if (keys["KeyS"]) controls.moveForward(-0.1);
  if (keys["KeyA"]) controls.moveRight(-0.1);
  if (keys["KeyD"]) controls.moveRight(0.1);

  // GRAVEDAD
  velocityY -= gravity;
  controls.getObject().position.y += velocityY;

  if (controls.getObject().position.y <= 2) {
    velocityY = 0;
    canJump = true;
    controls.getObject().position.y = 2;
  }

  if (keys["Space"] && canJump) {
    velocityY = 0.2;
    canJump = false;
  }

  renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


