window.onerror = (msg, _url, lineNo) => {
  const div = document.createElement('div');
  Object.assign(div.style, {
    position: 'fixed', top: 0, left: 0,
    background: '#f00', color: '#fff',
    padding: '8px', fontSize: '14px', zIndex: 9999
  });
  div.textContent = `Error: ${msg} at line ${lineNo}`;
  document.body.appendChild(div);
};

/* ---------- script.js (ES‑module) ---------- */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


window.addEventListener("DOMContentLoaded", async () => {
  /* --- 1. MindAR bootstrap --- */
  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: "./targets.mind"
  });
  const { renderer, scene, camera } = mindarThree;

  /* --- 2. Anchor tied to first target (index 0) --- */
  const anchor = mindarThree.addAnchor(0);

  /* --- 3. GLTF‑ & Draco‑loader setup --- */
  const gltfLoader  = new GLTFLoader();
  const dracoLoader = new DRACOLoader();

  // Point to Google's hosted decoders (WASM & JS fallbacks)
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  gltfLoader.setDRACOLoader(dracoLoader);

  /* --- 4. Load compressed GLB --- */
  const glbScene = await new Promise((resolve, reject) =>
    gltfLoader.load(
      "./model.glb",
      (gltf) => resolve(gltf.scene),
      undefined,
      (err) => reject(err)
    )
  );
  glbScene.scale.set(0.1, 0.1, 0.1);
  anchor.group.add(glbScene);

  /* --- 5. Video texture on 16:9 plane --- 
  const video   = document.getElementById("video-texture");
  const vTex    = new THREE.VideoTexture(video);
  const vPlane  = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.5625),          // 16:9 aspect
    new THREE.MeshBasicMaterial({ map: vTex })
  );
  vPlane.position.set(0, 0, 0);                  // centre of marker
  vPlane.scale.set(1, 1, 1);                     // full‑marker size (tweak as needed)
  anchor.group.add(vPlane);

  /* --- 6. Play/pause video on detection --- 
  anchor.onTargetFound = () => video.play();
  anchor.onTargetLost  = () => { video.pause(); video.currentTime = 0; };

  /* --- 7. Start AR loop --- */
  await mindarThree.start();
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
});