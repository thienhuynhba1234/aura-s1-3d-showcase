import { Component, Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import HeadphoneModel from './HeadphoneModel';

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="webgl-fallback">
          <p>Trình duyệt không hỗ trợ WebGL hoặc gặp sự cố khi khởi tạo khung hình 3D.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function CameraRig({ scrollProgressRef, orbitEnabled, resetSignal }) {
  const controlsRef = useRef();
  const { size } = useThree();

  useEffect(() => {
    if (controlsRef.current && resetSignal > 0) {
      controlsRef.current.reset();
    }
  }, [resetSignal]);

  useFrame((state, rawDelta) => {
    if (orbitEnabled) return;

    const delta = Math.min(rawDelta, 0.05);
    const p = scrollProgressRef.current;
    const isMobile = size.width < 768;
    const distScale = isMobile ? 1.52 : 1.0;

    // Smooth camera Z distances across the 5 chapters
    let targetZ = 5.45;
    if (p < 0.34) {
      const t = THREE.MathUtils.clamp((p - 0.11) / 0.14, 0, 1);
      targetZ = THREE.MathUtils.lerp(5.45, 4.15, t * t * (3 - 2 * t));
    } else if (p < 0.62) {
      const t = THREE.MathUtils.clamp((p - 0.34) / 0.12, 0, 1);
      targetZ = THREE.MathUtils.lerp(4.15, 6.25, t * t * (3 - 2 * t));
    } else {
      const t = THREE.MathUtils.clamp((p - 0.62) / 0.12, 0, 1);
      targetZ = THREE.MathUtils.lerp(6.25, 5.2, t * t * (3 - 2 * t));
    }

    const pointerX = state.pointer.x * 0.15;
    const pointerY = state.pointer.y * 0.09;

    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pointerX, 3.5, delta);
    cam.position.y = THREE.MathUtils.damp(
      cam.position.y,
      0.1 + pointerY,
      3.5,
      delta
    );
    cam.position.z = THREE.MathUtils.damp(
      cam.position.z,
      targetZ * distScale,
      4.2,
      delta
    );
    cam.lookAt(0, -0.1, 0);
  });

  return orbitEnabled ? (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.055}
      minPolarAngle={Math.PI * 0.18}
      maxPolarAngle={Math.PI * 0.82}
      rotateSpeed={0.75}
    />
  ) : null;
}

export default function StudioScene({
  scrollProgressRef,
  colorway,
  manualExplode,
  activeLayer,
  orbitEnabled,
  resetSignal,
}) {
  return (
    <div
      id="canvas-container"
      className={orbitEnabled ? 'orbit-active' : undefined}
      aria-label="Không gian trình diễn sản phẩm 3D AURA S1"
    >
      <WebGLErrorBoundary>
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 2]}
          camera={{ position: [0, 0.1, 5.45], fov: 36, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.08,
            powerPreference: 'high-performance',
          }}
        >
          <color attach="background" args={['#09090b']} />
          <fog attach="fog" args={['#09090b', 10, 20]} />

          {/* Studio 3-Point Lighting Rig */}
          <ambientLight intensity={0.28} />
          <directionalLight
            position={[4.5, 5.5, 4.5]}
            intensity={1.95}
            color="#fff7ea"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
          />
          <directionalLight
            position={[-5, 2, 3]}
            intensity={0.78}
            color="#cdd9ef"
          />
          <spotLight
            position={[0, 4.5, -5.5]}
            angle={0.48}
            penumbra={0.85}
            intensity={3.2}
            color="#e7cda0"
          />

          {/* Pure GPU Procedural Studio HDRI Reflections */}
          <Environment resolution={256} frames={1}>
            <group rotation={[-Math.PI / 3, 0, 0.4]}>
              <Lightformer
                form="rect"
                intensity={2.6}
                color="#fff6e8"
                scale={[6, 2, 1]}
                position={[0, 4, 2]}
              />
              <Lightformer
                form="rect"
                intensity={1.6}
                color="#d8e3f5"
                scale={[5, 1.5, 1]}
                position={[-4, 1, 2]}
                rotation={[0, Math.PI / 3, 0]}
              />
              <Lightformer
                form="ring"
                intensity={1.8}
                color="#e5c894"
                scale={3}
                position={[4, 2, -3]}
                rotation={[0, -Math.PI / 3, 0]}
              />
              <Lightformer
                form="rect"
                intensity={0.65}
                color="#ffffff"
                scale={[8, 4, 1]}
                position={[0, -3.5, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </group>
          </Environment>

          <Suspense fallback={null}>
            <HeadphoneModel
              scrollProgressRef={scrollProgressRef}
              colorway={colorway}
              manualExplode={manualExplode}
              activeLayer={activeLayer}
              orbitEnabled={orbitEnabled}
            />
            <ContactShadows
              position={[0, -1.56, 0]}
              opacity={0.52}
              scale={9}
              blur={2.4}
              far={3.5}
              color="#000000"
            />
          </Suspense>

          <CameraRig
            scrollProgressRef={scrollProgressRef}
            orbitEnabled={orbitEnabled}
            resetSignal={resetSignal}
          />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
