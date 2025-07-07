/* ---------- script.js (ES‑module) ---------- */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { GLTFLoader }   from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader }  from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/DRACOLoader.js";
import { MindARThree }  from "https://cdn.jsdelivr.net/npm/mind-ar@1.1.4/dist/mindar-image-three.prod.js";

window.addEventListener("DOMContentLoaded", async () => {
  /* --- 1. MindAR bootstrap --- */
  const mindarThree = new MindARThree({
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

  /* --- 5. Video texture on 16:9 plane --- */
  const video   = document.getElementById("video-texture");
  const vTex    = new THREE.VideoTexture(video);
  const vPlane  = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.5625),          // 16:9 aspect
    new THREE.MeshBasicMaterial({ map: vTex })
  );
  vPlane.position.set(0, 0, 0);                  // centre of marker
  vPlane.scale.set(1, 1, 1);                     // full‑marker size (tweak as needed)
  anchor.group.add(vPlane);

  /* --- 6. Play/pause video on detection --- */
  anchor.onTargetFound = () => video.play();
  anchor.onTargetLost  = () => { video.pause(); video.currentTime = 0; };

  /* --- 7. Start AR loop --- */
  await mindarThree.start();
  renderer.setAnimationLoop(() => renderer.render(scene, camera));
});
