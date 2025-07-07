const mindarThree = new window.MINDAR.IMAGE.MindARThree({
  container: document.body,
  imageTargetSrc: './target.mind',
});

const { renderer, scene, camera } = mindarThree;
const anchor = mindarThree.addAnchor(0);

// Load local model.glb
const loader = new THREE.GLTFLoader();
loader.load('./model.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.5, 0.5, 0.5);
  model.position.set(0, 0, 0);
  anchor.group.add(model);
});

const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);

// Start AR
mindarThree.start().then(() => {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});
