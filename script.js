// ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CÁMARA
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);

// RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// CONTROLES FPS
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => controls.lock());
scene.add(controls.getObject());

// LUCES
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// SUELO
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x228b22 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// BLOQUES TIPO MINECRAFT
for (let x = -20; x < 20; x += 2) {
  for (let z = -20; z < 20; z += 2) {
    if (Math.random() > 0.8) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      block.position.set(x, 1, z);
      scene.add(block);
    }
  }
}

// GRAVEDAD
let velocityY = 0;
const gravity = 0.01;
let canJump = false;

// INPUT
const keys = {};
addEventListener("keydown", e => keys[e.code] = true);
addEventListener("keyup", e => keys[e.code] = false);

// ENEMIGOS (IA)
const enemies = [];
function spawnEnemy(x, z) {
  const enemy = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  enemy.position.set(x, 1, z);
  scene.add(enemy);
  enemies.push(enemy);
}
spawnEnemy(5, -10);
spawnEnemy(-10, -15);

// BALAS
const bullets = [];
function shoot() {
  navigator.vibrate?.(50); // 4D vibración

  const bullet = new THREE.Mesh(
    new THREE.SphereGeometry(0.1),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
  );
  bullet.position.copy(camera.position);
  bullet.velocity = new THREE.Vector3();
  camera.getWorldDirection(bullet.velocity);
  bullet.velocity.multiplyScalar(0.5);
  scene.add(bullet);
  bullets.push(bullet);
}
addEventListener("mousedown", shoot);

// GIROSCOPIO (MÓVIL)
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", e => {
    camera.rotation.y = e.gamma * 0.01;
    camera.rotation.x = e.beta * 0.01;
  });
}

// LOOP
function animate() {
  renderer.setAnimationLoop(() => {

    // MOVIMIENTO
    if (keys["KeyW"]) controls.moveForward(0.1);
    if (keys["KeyS"]) controls.moveForward(-0.1);
    if (keys["KeyA"]) controls.moveRight(-0.1);
    if (keys["KeyD"]) controls.moveRight(0.1);

    // GRAVEDAD
    velocityY -= gravity;
    controls.getObject().position.y += velocityY;

    if (controls.getObject().position.y <= 1.6) {
      velocityY = 0;
      canJump = true;
      controls.getObject().position.y = 1.6;
    }
    if (keys["Space"] && canJump) {
      velocityY = 0.2;
      canJump = false;
    }

    // IA ENEMIGA
    enemies.forEach(enemy => {
      enemy.lookAt(camera.position);
      enemy.position.add(
        enemy.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.02)
      );
    });

    // BALAS
    bullets.forEach((b, i) => {
      b.position.add(b.velocity);
      enemies.forEach((e, ei) => {
        if (b.position.distanceTo(e.position) < 1) {
          scene.remove(e);
          enemies.splice(ei, 1);
        }
      });
    });

    renderer.render(scene, camera);
  });
}
animate();

// RESPONSIVE
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
