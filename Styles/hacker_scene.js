{
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000814);
  scene.fog = new THREE.FogExp2(0x000814, 0.03);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 10);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);
  const point = new THREE.PointLight(0x00ff99, 3, 50);
  point.position.set(0, 5, 5);
  scene.add(point);
  const neon = new THREE.PointLight(0xff00ff, 2, 30);
  neon.position.set(-5, 5, -5);
  scene.add(neon);

  const starGeo = new THREE.BufferGeometry();
  const starCount = 500;
  const positions = [];
  for (let i = 0; i < starCount; i++) {
    positions.push((Math.random() - 0.5) * 50, Math.random() * 20 + 2, (Math.random() - 0.5) * 50);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 }));
  scene.add(stars);

  const city = new THREE.Group();
  const neonBoards = [];

  for (let i = -10; i <= 10; i++) {
    const h = Math.random() * 5 + 3;
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(1, h, 1),
      new THREE.MeshStandardMaterial({ color: 0x081f44, emissive: 0x00ff99, emissiveIntensity: 1.5, metalness: 0.5, roughness: 0.2 })
    );
    building.position.set(i * 2, h / 2, -5);
    city.add(building);

    const boardCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < boardCount; j++) {
      const bw = 0.8, bh = 0.2;
      const boardCanvas = document.createElement('canvas');
      boardCanvas.width = 256;
      boardCanvas.height = 64;
      const bctx = boardCanvas.getContext('2d');
      bctx.font = "20px monospace";
      const chars = "Bookmarklets and Soundeffects!";
      const text = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
      bctx.fillStyle = ["#00ff99", "#ff00ff", "#00ffff", "#ffff00"][Math.floor(Math.random() * 4)];
      bctx.fillText(text, 10, 40);
      const boardTexture = new THREE.CanvasTexture(boardCanvas);
      const boardMat = new THREE.MeshBasicMaterial({ map: boardTexture });
      const board = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), boardMat);
      board.position.set(0, h / 2 - (j * 0.5 + 1), 0.51);
      board.userData.texture = boardTexture;
      building.add(board);
      neonBoards.push(board);
    }
  }
  scene.add(city);

  const hacker = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.2, 4, 8), new THREE.MeshStandardMaterial({ color: 0x020617 }));
  body.position.set(0, 1, 0);
  hacker.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), new THREE.MeshStandardMaterial({ color: 0x020617 }));
  head.position.set(0, 2.05, 0);
  hacker.add(head);
  
  const eyeGeo = new THREE.BoxGeometry(0.1, 0.05, 0.05);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x00ff99, emissive: 0x00ff99, emissiveIntensity: 1.5 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.12, 2.05, 0.33);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.12, 2.05, 0.33);
  hacker.add(leftEye, rightEye);

  const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 0.6), new THREE.MeshStandardMaterial({ color: 0x051c14, emissive: 0x00ff99, emissiveIntensity: 2 }));
  laptopBase.position.set(0, 0.9, -0.6);
  hacker.add(laptopBase);
  const laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), new THREE.MeshBasicMaterial({ color: 0x00ff99 }));
  laptopScreen.position.set(0, 1.15, -0.95);
  laptopScreen.rotation.x = -0.3;
  hacker.add(laptopScreen);

  const handGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
  const handMat = new THREE.MeshStandardMaterial({ color: 0x020617 });
  const leftHand = new THREE.Mesh(handGeo, handMat);
  leftHand.position.set(-0.35, 1.3, -0.3);
  const rightHand = new THREE.Mesh(handGeo, handMat);
  rightHand.position.set(0.35, 1.3, -0.3);
  hacker.add(leftHand, rightHand);
  scene.add(hacker);

  const sCanvas = document.createElement('canvas');
  sCanvas.width = 256;
  sCanvas.height = 128;
  const sCtx = sCanvas.getContext('2d');
  const sTexture = new THREE.CanvasTexture(sCanvas);
  laptopScreen.material.map = sTexture;

  const chars = "ScriptBox, The Home Of Internet Fun";
  let textArray = Array.from({ length: 50 }, () => chars[Math.floor(Math.random() * chars.length)]);
  let index = 0;

  function updateScreen() {
    sCtx.clearRect(0, 0, 256, 128);
    sCtx.font = "20px monospace";
    sCtx.fillStyle = "#00ff99";
    sCtx.fillText(textArray.slice(index, index + 20).join(""), 10, 50);
    sTexture.needsUpdate = true;
    index = (index + 1) % textArray.length;
  }

  function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0005;
    city.rotation.y += 0.001;
    hacker.rotation.y = Math.sin(Date.now() * 0.001) * 0.05;
    leftHand.rotation.x = Math.sin(Date.now() * 0.01) * 0.5 - 0.5;
    rightHand.rotation.x = Math.sin(Date.now() * 0.01) * 0.5 - 0.5;
    updateScreen();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}
