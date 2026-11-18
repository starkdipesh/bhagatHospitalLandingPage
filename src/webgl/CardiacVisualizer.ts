import * as THREE from 'three';

export interface VisualizerControls {
  updateMouse: (x: number, y: number) => void;
  setCinematicProgress: (progress: number) => void;
  setCareProgress: (progress: number) => void;
  setServicesProgress: (progress: number, active: boolean) => void;
  setFacilityProgress: (progress: number) => void;
  setVisible: (visible: boolean) => void;
  destroy: () => void;
}

const HEARTBEAT_BPM = 72;
const HEARTBEAT_INTERVAL = 60 / HEARTBEAT_BPM;

function createHeartGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(1, 96, 64);
  const positions = geometry.getAttribute('position');
  const widthProfile = [
    [0, 0.18],
    [0.1, 0.48],
    [0.22, 0.72],
    [0.38, 0.9],
    [0.53, 1],
    [0.68, 0.96],
    [0.82, 0.78],
    [0.94, 0.5],
    [1, 0.24],
  ] as const;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    const t = (y + 1) / 2;
    const profileIndex = widthProfile.findIndex(([height]) => height >= t);
    const upper = widthProfile[Math.max(1, profileIndex)];
    const lower = widthProfile[Math.max(0, profileIndex - 1)];
    const progress = THREE.MathUtils.clamp((t - lower[0]) / (upper[0] - lower[0]), 0, 1);
    const width = THREE.MathUtils.lerp(lower[1], upper[1], progress);

    positions.setXYZ(
      index,
      x * width * 1.12 + (1 - t) * 0.18,
      y * 1.34 - 0.12,
      z * 0.64,
    );
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createVessel(points: THREE.Vector3[], radius: number, material: THREE.Material): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8, false), material);
}

export function initCardiacVisualizer(canvas: HTMLCanvasElement): VisualizerControls {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  scene.add(new THREE.HemisphereLight(0xf7ffff, 0x58777a, 2.1));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(-4, 5, 7);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x55b9b6, 2.6);
  rimLight.position.set(4, 1, -5);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xd7eeee, 0.9, 14);
  fillLight.position.set(3, -3, 5);
  scene.add(fillLight);

  const heart = new THREE.Group();
  heart.position.set(0, 0.15, 0);
  heart.rotation.set(0.06, -0.15, -0.08);
  scene.add(heart);

  const heartGeometry = createHeartGeometry();
  const myocardium = new THREE.MeshStandardMaterial({
    color: 0x4c9d9b,
    roughness: 0.7,
    metalness: 0.01,
  });
  const heartBody = new THREE.Mesh(heartGeometry, myocardium);
  heart.add(heartBody);

  const vesselMaterial = new THREE.MeshStandardMaterial({
    color: 0x72c3bd,
    roughness: 0.52,
    metalness: 0.01,
  });
  const pulmonaryMaterial = new THREE.MeshStandardMaterial({
    color: 0x328c8e,
    roughness: 0.56,
    metalness: 0.02,
  });

  const chamberGeometry = new THREE.SphereGeometry(1, 40, 28);
  const leftAtrium = new THREE.Mesh(chamberGeometry, pulmonaryMaterial);
  leftAtrium.position.set(-0.48, 0.67, 0.04);
  leftAtrium.scale.set(0.52, 0.55, 0.42);
  heart.add(leftAtrium);

  const rightAtrium = new THREE.Mesh(chamberGeometry, myocardium);
  rightAtrium.position.set(0.43, 0.64, 0.06);
  rightAtrium.scale.set(0.5, 0.58, 0.43);
  heart.add(rightAtrium);

  heart.add(createVessel([
    new THREE.Vector3(-0.66, 0.86, 0),
    new THREE.Vector3(-0.68, 1.26, 0),
    new THREE.Vector3(-0.64, 1.72, 0),
    new THREE.Vector3(-0.58, 1.92, 0),
  ], 0.17, pulmonaryMaterial));

  heart.add(createVessel([
    new THREE.Vector3(0.04, 0.75, 0.02),
    new THREE.Vector3(0.12, 1.1, 0.02),
    new THREE.Vector3(0.34, 1.38, 0.02),
    new THREE.Vector3(0.64, 1.45, 0.02),
    new THREE.Vector3(0.82, 1.28, 0.02),
    new THREE.Vector3(0.8, 0.94, 0.02),
  ], 0.19, vesselMaterial));

  heart.add(createVessel([
    new THREE.Vector3(-0.2, 0.77, 0.04),
    new THREE.Vector3(0.02, 1.08, 0.04),
    new THREE.Vector3(0.32, 1.14, 0.04),
    new THREE.Vector3(0.65, 1.04, 0.04),
    new THREE.Vector3(1.02, 0.91, 0.04),
  ], 0.13, pulmonaryMaterial));

  for (const [x, height] of [[0.3, 1.83], [0.54, 1.87], [0.77, 1.78]]) {
    heart.add(createVessel([
      new THREE.Vector3(x, 1.38, 0.02),
      new THREE.Vector3(x - 0.04, height, 0.02),
    ], 0.055, vesselMaterial));
  }

  heart.add(createVessel([
    new THREE.Vector3(-0.46, -1.12, 0),
    new THREE.Vector3(-0.44, -1.43, 0),
    new THREE.Vector3(-0.42, -1.72, 0),
  ], 0.15, pulmonaryMaterial));

  const grooveMaterial = new THREE.MeshStandardMaterial({
    color: 0x256e73,
    roughness: 0.72,
    transparent: true,
    opacity: 0.68,
  });
  const coronaryBranches = [
    [
      [-0.12, 0.54, 0.54], [-0.34, 0.31, 0.62], [-0.48, 0.03, 0.66],
      [-0.44, -0.35, 0.62], [-0.28, -0.75, 0.5], [0.02, -1.12, 0.32],
    ],
    [
      [-0.35, 0.3, 0.63], [-0.7, 0.23, 0.5], [-0.88, 0.02, 0.38],
    ],
    [
      [-0.46, -0.02, 0.65], [-0.68, -0.28, 0.54], [-0.72, -0.56, 0.43],
    ],
    [
      [-0.12, 0.54, 0.56], [0.16, 0.37, 0.62], [0.38, 0.12, 0.62],
      [0.46, -0.24, 0.56], [0.37, -0.62, 0.44], [0.2, -1.03, 0.3],
    ],
    [
      [0.36, 0.12, 0.62], [0.68, 0.18, 0.5], [0.82, 0.03, 0.36],
    ],
    [
      [0.45, -0.22, 0.57], [0.7, -0.39, 0.44], [0.75, -0.62, 0.34],
    ],
  ];

  coronaryBranches.forEach((branch, index) => {
    heart.add(createVessel(
      branch.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      index === 0 || index === 3 ? 0.025 : 0.016,
      grooveMaterial,
    ));
  });

  const heartMaterials: Array<{
    material: THREE.Material;
    opacity: number;
    transparent: boolean;
    depthWrite: boolean;
  }> = [];
  heart.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      heartMaterials.push({
        material,
        opacity: material.opacity,
        transparent: material.transparent,
        depthWrite: material.depthWrite,
      });
    });
  });

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
  };
  window.addEventListener('resize', resize, { passive: true });

  let visible = true;
  let animationFrame = 0;
  let lastFrameTime: number | null = null;
  let elapsedTime = 0;
  let heartbeatPhase = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let cinematicProgress = 0;
  let careProgress = 0;
  let servicesProgress = 0;
  let servicesActive = false;
  let facilityProgress = 0;
  const render = (time: number) => {
    if (!visible) return;
    animationFrame = requestAnimationFrame(render);

    const delta = lastFrameTime === null ? 0 : Math.min((time - lastFrameTime) / 1000, 0.05);
    lastFrameTime = time;
    elapsedTime += delta;
    heartbeatPhase += delta;

    if (heartbeatPhase >= HEARTBEAT_INTERVAL) {
      heartbeatPhase %= HEARTBEAT_INTERVAL;
      window.dispatchEvent(new Event('bhagat:heartbeat'));
    }

    const phase = heartbeatPhase / HEARTBEAT_INTERVAL;
    const firstBeat = phase < 0.16 ? Math.sin((phase / 0.16) * Math.PI) * 0.045 : 0;
    const secondBeat = phase > 0.22 && phase < 0.34
      ? Math.sin(((phase - 0.22) / 0.12) * Math.PI) * 0.022
      : 0;
    const scale = 1 + firstBeat + secondBeat;
    const displayScale = scale * 1.35;
    heartMaterials.forEach(({ material, opacity, transparent, depthWrite }) => {
      const faded = facilityProgress > 0;
      const nextTransparent = faded || transparent;
      if (material.transparent !== nextTransparent) {
        material.transparent = nextTransparent;
        material.needsUpdate = true;
      }
      material.opacity = opacity * (1 - facilityProgress);
      material.depthWrite = faded ? false : depthWrite;
    });

    mouseX += (targetMouseX - mouseX) * 0.035;
    mouseY += (targetMouseY - mouseY) * 0.035;
    const turnProgress = Math.min(1, cinematicProgress / 0.42);
    const exitProgress = Math.max(0, Math.min(1, (cinematicProgress - 0.68) / 0.32));
    const doctorProgress = Math.min(1, careProgress * 2);
    const nursingProgress = Math.max(0, Math.min(1, (careProgress - 0.5) * 2));
    const heroX = exitProgress * 3.1;
    const doctorX = 3.2 + doctorProgress * 0.35;
    const careX = careProgress > 0
      ? THREE.MathUtils.lerp(doctorX, -2.6, nursingProgress)
      : heroX;
    const doctorScale = 0.7 - doctorProgress * 0.04;
    const careScale = careProgress > 0
      ? THREE.MathUtils.lerp(doctorScale, 0.78, nursingProgress)
      : 1;
    const doctorRotation = 0.7;
    const careRotation = careProgress > 0
      ? THREE.MathUtils.lerp(doctorRotation, 0.2, nursingProgress)
      : turnProgress * 1.05;
    const nursingFloat = nursingProgress * Math.sin(elapsedTime * 0.8) * 0.07;

    if (facilityProgress > 0) {
      heart.position.x = -2.35;
      heart.position.y = 0.15;
      heart.rotation.y = 0.05;
      heart.rotation.z = 0;
      heart.scale.set(displayScale * 0.78, displayScale * 0.78, displayScale * 0.78);
      camera.position.set(0, 0, 12);
    } else if (servicesActive) {
      const orbitPhase = servicesProgress * Math.PI * 2;
      heart.position.x = -2.35 + Math.sin(orbitPhase) * 0.22;
      heart.position.y = 0.15 + Math.cos(orbitPhase) * 0.05;
      heart.rotation.y = 0.05 + servicesProgress * 0.15 + mouseX * 0.08;
      heart.rotation.x = 0.06 + mouseY * 0.055 + Math.sin(elapsedTime * 0.45) * 0.012;
      heart.rotation.z = -0.07 + servicesProgress * 0.14;
      heart.scale.set(displayScale * 0.78, displayScale * 0.78, displayScale * 0.78);
      camera.position.set(Math.sin(orbitPhase) * 0.22, Math.cos(orbitPhase) * 0.1, 12);
    } else {
      heart.position.x = careProgress > 0 ? careX : heroX;
      heart.position.y = 0.15 + nursingFloat;
      heart.rotation.y = -0.15 + careRotation + mouseX * 0.08;
      heart.rotation.x = 0.06 + mouseY * 0.055 + Math.sin(elapsedTime * 0.45) * 0.012;
      heart.rotation.z = careProgress > 0 ? -nursingProgress * 0.08 : 0;
      heart.scale.set(displayScale * careScale, displayScale * careScale, displayScale * careScale);
      camera.position.set(
        0,
        0,
        careProgress > 0
          ? THREE.MathUtils.lerp(9.8, 12, doctorProgress)
          : 12 - turnProgress * 2.2,
      );
    }
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  const setVisible = (nextVisible: boolean) => {
    if (visible === nextVisible) return;
    visible = nextVisible;

    if (visible) {
      lastFrameTime = null;
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      lastFrameTime = null;
    }
  };

  animationFrame = requestAnimationFrame(render);

  return {
    updateMouse: (x, y) => {
      targetMouseX = x;
      targetMouseY = y;
    },
    setCinematicProgress: (progress) => {
      cinematicProgress = Math.min(1, Math.max(0, progress));
    },
    setCareProgress: (progress) => {
      careProgress = Math.min(1, Math.max(0, progress));
    },
    setServicesProgress: (progress, active) => {
      servicesProgress = Math.min(1, Math.max(0, progress));
      servicesActive = active;
    },
    setFacilityProgress: (progress) => {
      facilityProgress = Math.min(1, Math.max(0, progress));
    },
    setVisible,
    destroy: () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      heart.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
