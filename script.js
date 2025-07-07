import * as THREE from 'three';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';

window.addEventListener("DOMContentLoaded", async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: './targets.mind',  // this is the image tracking data
  });

  const { renderer, scene, camera } = mindarThree;

  const anchor = mindarThree.addAnchor(0);

  // Load your GLB model
  const gltfLoader = new THREE.GLTFLoader();
  const model = await new Promise((resolve) => {
    gltfLoader.load('./model.glb', (gltf) => resolve(gltf.scene));
  });

  model.scale.set(0.1, 0.1, 0.1);
  anchor.group.add(model);

  // Setup video texture
  const video = document.getElementById("video-texture");
  const texture = new THREE.VideoTexture(video);
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 0.6),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  screenMesh.position.set(0, 0.5, 0);
  anchor.group.add(screenMesh);

  anchor.onTargetFound = () => {
    video.play();
  };
  anchor.onTargetLost = () => {
    video.pause();
  };

  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});
