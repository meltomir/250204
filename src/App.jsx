import { useEffect } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const ModelViewer = () => {
  useEffect(() => {
    // シーンの作成
    const scene = new THREE.Scene();

    // カメラの作成
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // レンダラーの作成
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // ライトの追加
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    // OBJ ファイルの読み込み
    const loader = new OBJLoader();
    loader.load(
      "/models/myModel.obj",
      (object) => {
        scene.add(object);
      },
      (xhr) => {
        console.log(`OBJ Loading: ${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        console.error("Error loading OBJ file:", error);
      }
    );

    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // クリーンアップ
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default ModelViewer;
