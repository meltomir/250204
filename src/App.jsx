import { useEffect } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

const ModelViewer = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.body.appendChild(renderer.domElement);

    // 環境マップ（EXR）のロード
    new EXRLoader().load("/textures/environment.exr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = texture; // 背景にも適用
      console.log("EXR Loaded:", scene.environment);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // OBJ ファイルの読み込み
    const loader = new OBJLoader();
    loader.load("/models/myModel.obj", (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0,  // 金属っぽさ（0: 非金属, 1: 金属）
            roughness: 1,  // 表面の粗さ（0: 鏡面, 1: マット）
            envMap: scene.environment,  // 環境マップを適用
          });
        }
      });
      scene.add(object);
    });

    // マウス操作でカメラを回転
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      targetRotationY = x * 0.2;
      targetRotationX = -y * 0.1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotationY, 0.1);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotationX, 0.1);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return null;
};

export default ModelViewer;
