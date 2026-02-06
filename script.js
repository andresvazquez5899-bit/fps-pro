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

// POSICIÓN INICIAL (CLAVE)
controls.getObject().position.set(0, 3, 10);
camera.lookAt(0, 1, 0);

// LUCES (FUERTES)
scene.add(new THREE.AmbientLight(0xffffff, 1));

const sun = new THREE.DirectionalLight(0xffffff, 2);
sun.position.set(10, 30, 10);
scene.add(sun);

// SUELO
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({
    color: 0x22aa22,
    side: THREE.DoubleSide
  })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// CUBO DE PRUEBA (DEBE VERSE SÍ O SÍ)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({ color: 0x0000ff })
);
cube.position.set(0, 1, 0);
scene.add(cube);

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
  if (keys["KeyW"]) controls.moveForward(0.15);
  if (keys["KeyS"]) controls.moveForward(-0.15);
  if (keys["KeyA"]) controls.moveRight(-0.15);
  if (keys["KeyD"]) controls.moveRight(0.15);

  // GRAVEDAD
  velocityY -= gravity;
  controls.getObject().position.y += velocityY;

  if (controls.getObject().position.y <= 3) {
    velocityY = 0;
    canJump = true;
    controls.getObject().position.y = 3;
  }

  if (keys["Space"] && canJump) {
    velocityY = 0.25;
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




