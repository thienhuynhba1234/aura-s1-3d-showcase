import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getAcousticGrilleTexture,
  getBrushedMetalTexture,
  getLeatherGrainTexture,
} from '../../utils/proceduralTextures';

function smoothstep(edge0, edge1, x) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Piece-wise interpolation across scroll progress [0..1]
function getScrollPose(p, isMobile) {
  const w1 = smoothstep(0.11, 0.22, p); // Hero -> Craftsmanship
  const w2 = smoothstep(0.35, 0.46, p); // Craftsmanship -> Exploded
  const w3 = smoothstep(0.61, 0.72, p); // Exploded -> ANC Specs
  const w4 = smoothstep(0.83, 0.94, p); // ANC Specs -> Configurator

  const m = isMobile ? 0.0 : 1.0;
  const mobileY = isMobile ? 0.85 : 0.0;

  // Target X position (staged asymmetrically opposite to text panels)
  let x = 0.78 * m;
  x = THREE.MathUtils.lerp(x, -0.82 * m, w1);
  x = THREE.MathUtils.lerp(x, 0.42 * m, w2);
  x = THREE.MathUtils.lerp(x, -0.88 * m, w3);
  x = THREE.MathUtils.lerp(x, 0.68 * m, w4);

  // Target Y position (centered so top headband crown never clips navbar)
  let y = -0.18 + mobileY;
  y = THREE.MathUtils.lerp(y, -0.34 + mobileY, w1);
  y = THREE.MathUtils.lerp(y, -0.16 + mobileY, w2);
  y = THREE.MathUtils.lerp(y, -0.18 + mobileY, w3);
  y = THREE.MathUtils.lerp(y, -0.18 + mobileY, w4);

  // Target Z position
  let z = 0.0;
  z = THREE.MathUtils.lerp(z, 0.42, w1);
  z = THREE.MathUtils.lerp(z, -0.18, w2);
  z = THREE.MathUtils.lerp(z, 0.08, w3);
  z = THREE.MathUtils.lerp(z, 0.0, w4);

  // Target Euler Rotations
  let rx = 0.1;
  rx = THREE.MathUtils.lerp(rx, 0.22, w1);
  rx = THREE.MathUtils.lerp(rx, 0.2, w2);
  rx = THREE.MathUtils.lerp(rx, -0.05, w3);
  rx = THREE.MathUtils.lerp(rx, 0.08, w4);

  let ry = -0.52;
  ry = THREE.MathUtils.lerp(ry, 0.76, w1);
  ry = THREE.MathUtils.lerp(ry, -0.78, w2);
  ry = THREE.MathUtils.lerp(ry, 0.48, w3);
  ry = THREE.MathUtils.lerp(ry, -0.44, w4);

  let rz = -0.04;
  rz = THREE.MathUtils.lerp(rz, 0.1, w1);
  rz = THREE.MathUtils.lerp(rz, 0.02, w2);
  rz = THREE.MathUtils.lerp(rz, -0.06, w3);
  rz = THREE.MathUtils.lerp(rz, 0.0, w4);

  // Exploded View peaks during Chapter 3 (0.43..0.55) and closes completely before Chapter 4
  const explodeIn = smoothstep(0.35, 0.44, p);
  const explodeOut = 1.0 - smoothstep(0.54, 0.62, p);
  const autoExplode = explodeIn * explodeOut;

  // ANC Acoustic Pulse rings visible in Chapter 4 (0.64..0.85)
  const ancIn = smoothstep(0.62, 0.69, p);
  const ancOut = 1.0 - smoothstep(0.83, 0.89, p);
  const ancPulse = ancIn * ancOut;

  return { x, y, z, rx, ry, rz, autoExplode, ancPulse };
}

function EarcupAssembly({
  side, // -1 for Left, +1 for Right
  colorway,
  explodeRef,
  activeLayer,
  textures,
}) {
  const layer1Ref = useRef();
  const layer2Ref = useRef();
  const layer3Ref = useRef();
  const layer4Ref = useRef();
  const layer5Ref = useRef();

  // Outer sculpted shell LatheGeometry
  const outerShellGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.0, 0.15),
      new THREE.Vector2(0.24, 0.145),
      new THREE.Vector2(0.38, 0.122),
      new THREE.Vector2(0.45, 0.075),
      new THREE.Vector2(0.47, 0.0),
      new THREE.Vector2(0.445, -0.02),
      new THREE.Vector2(0.425, 0.0),
      new THREE.Vector2(0.405, 0.06),
      new THREE.Vector2(0.34, 0.095),
      new THREE.Vector2(0.0, 0.105),
    ];
    return new THREE.LatheGeometry(pts, 56);
  }, []);

  // Driver diaphragm cone + dome LatheGeometry
  const driverConeGeo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0.0, 0.042),
      new THREE.Vector2(0.085, 0.036),
      new THREE.Vector2(0.13, 0.015),
      new THREE.Vector2(0.25, -0.038),
      new THREE.Vector2(0.31, -0.03),
      new THREE.Vector2(0.34, -0.042),
    ];
    return new THREE.LatheGeometry(pts, 48);
  }, []);

  // Curved Yoke Arm starting directly at swivel hinge (0,0,0) and hugging earcup pivots
  const yokeGeo = useMemo(() => {
    const frontCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(side * 0.05, -0.14, 0.24),
      new THREE.Vector3(side * 0.04, -0.34, 0.42),
      new THREE.Vector3(-side * 0.01, -0.5, 0.445),
    ]);
    const backCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(side * 0.05, -0.14, -0.24),
      new THREE.Vector3(side * 0.04, -0.34, -0.42),
      new THREE.Vector3(-side * 0.01, -0.5, -0.445),
    ]);
    return {
      front: new THREE.TubeGeometry(frontCurve, 28, 0.026, 14, false),
      back: new THREE.TubeGeometry(backCurve, 28, 0.026, 14, false),
    };
  }, [side]);

  // Smooth exploded layer offsets per frame
  useFrame(() => {
    const e = explodeRef.current;
    if (layer1Ref.current) layer1Ref.current.position.x = side * (0.14 + 0.78 * e);
    if (layer2Ref.current) layer2Ref.current.position.x = side * (0.075 + 0.44 * e);
    if (layer3Ref.current) layer3Ref.current.position.x = side * (0.01 + 0.14 * e);
    if (layer4Ref.current) layer4Ref.current.position.x = -side * (0.045 + 0.14 * e);
    if (layer5Ref.current) layer5Ref.current.position.x = -side * (0.125 + 0.38 * e);
  });

  const outwardLatheRotZ = -side * (Math.PI / 2);
  const inwardLatheRotZ = side * (Math.PI / 2);

  const emissiveFor = (layerIdx) =>
    activeLayer === layerIdx ? colorway.accentColor : '#000000';
  const emissiveIntensityFor = (layerIdx) => (activeLayer === layerIdx ? 0.26 : 0);

  return (
    /* Vertical Telescopic Stem anchored directly inside Headband End Cap at [side * 1.178, 0.495, 0] */
    <group position={[side * 1.178, 0.0, 0]}>
      {/* Vertical Telescopic Stainless Steel Rod (flush into end cap at y=0.50) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.036, 0.54, 24]} />
        <meshStandardMaterial
          color={colorway.yokeColor}
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Swivel Hinge Collar at bottom of vertical stem (y=-0.02) */}
      <group position={[0, -0.02, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.068, 0.064, 0.13, 32]} />
          <meshPhysicalMaterial
            color={colorway.metalColor}
            metalness={0.9}
            roughness={0.24}
            clearcoat={0.35}
          />
        </mesh>

        <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.067, 0.008, 12, 32]} />
          <meshStandardMaterial
            color={colorway.accentColor}
            metalness={0.92}
            roughness={0.2}
          />
        </mesh>

        {/* Tilted Yoke & Earcup Assembly pivoting directly from Hinge */}
        <group rotation={[0, 0, side * 0.1]}>
          {/* Curved C-Yoke Arms */}
          <mesh geometry={yokeGeo.front} castShadow>
            <meshStandardMaterial
              color={colorway.yokeColor}
              metalness={0.9}
              roughness={0.22}
            />
          </mesh>
          <mesh geometry={yokeGeo.back} castShadow>
            <meshStandardMaterial
              color={colorway.yokeColor}
              metalness={0.9}
              roughness={0.22}
            />
          </mesh>

          {/* Oval Earcup Assembly centered at yoke pivot tips */}
          <group position={[-side * 0.14, -0.5, 0]} scale={[1, 1.16, 0.94]}>
            {/* Pivot Pins connecting Yoke to Earcup */}
            <mesh
              position={[side * 0.14, 0, 0.44]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.025, 0.025, 0.09, 16]} />
              <meshStandardMaterial
                color={colorway.accentColor}
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>
            <mesh
              position={[side * 0.14, 0, -0.44]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.025, 0.025, 0.09, 16]} />
              <meshStandardMaterial
                color={colorway.accentColor}
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>

            {/* LAYER 1: Outer CNC Aluminum Shell & Tactile Controls */}
            <group ref={layer1Ref} position={[side * 0.14, 0, 0]}>
              <mesh
                geometry={outerShellGeo}
                rotation={[0, 0, outwardLatheRotZ]}
                castShadow
                receiveShadow
              >
                <meshPhysicalMaterial
                  color={colorway.metalColor}
                  metalness={0.88}
                  roughness={0.24}
                  roughnessMap={textures.brushed}
                  bumpMap={textures.brushed}
                  bumpScale={0.003}
                  clearcoat={0.35}
                  clearcoatRoughness={0.25}
                  emissive={emissiveFor(0)}
                  emissiveIntensity={emissiveIntensityFor(0)}
                />
              </mesh>

              {/* Outer Bezel Accent Ring */}
              <mesh
                position={[side * 0.125, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <torusGeometry args={[0.37, 0.011, 16, 64]} />
                <meshStandardMaterial
                  color={colorway.accentColor}
                  metalness={0.94}
                  roughness={0.18}
                  emissive={emissiveFor(0)}
                  emissiveIntensity={emissiveIntensityFor(0)}
                />
              </mesh>

              {/* Minimal Center Etched Halo */}
              <mesh
                position={[side * 0.153, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <ringGeometry args={[0.11, 0.125, 48]} />
                <meshStandardMaterial
                  color={colorway.accentColor}
                  metalness={0.9}
                  roughness={0.25}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Right Cup: Knurled Rotary Volume Crown Dial & USB-C Port */}
              {side === 1 && (
                <group>
                  <mesh
                    position={[0.04, 0.28, -0.35]}
                    rotation={[0.45, 0, -Math.PI / 2]}
                  >
                    <cylinderGeometry args={[0.045, 0.045, 0.055, 24]} />
                    <meshStandardMaterial
                      color={colorway.accentColor}
                      metalness={0.95}
                      roughness={0.22}
                    />
                  </mesh>
                  <mesh position={[0.01, -0.38, -0.18]} rotation={[0.3, 0, 0]}>
                    <boxGeometry args={[0.03, 0.025, 0.075]} />
                    <meshStandardMaterial color="#09090b" roughness={0.6} />
                  </mesh>
                </group>
              )}

              {/* Left Cup: ANC Mode Button */}
              {side === -1 && (
                <mesh
                  position={[-0.02, -0.29, -0.33]}
                  rotation={[-0.45, 0, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.028, 0.028, 0.03, 20]} />
                  <meshStandardMaterial
                    color={colorway.accentColor}
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              )}

              {/* Dual Acoustic ANC Microphone Mesh Ports */}
              <mesh
                position={[side * 0.08, 0.36, 0.2]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <cylinderGeometry args={[0.016, 0.016, 0.04, 14]} />
                <meshStandardMaterial color="#0e0f12" roughness={0.5} />
              </mesh>
            </group>

            {/* LAYER 2: Dual-Core ANC PCB & High-Density Battery */}
            <group ref={layer2Ref} position={[side * 0.075, 0, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.36, 0.36, 0.022, 48]} />
                <meshStandardMaterial
                  color="#141a18"
                  metalness={0.3}
                  roughness={0.55}
                  emissive={emissiveFor(1)}
                  emissiveIntensity={emissiveIntensityFor(1)}
                />
              </mesh>

              <mesh
                position={[side * 0.013, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
              >
                <torusGeometry args={[0.26, 0.008, 12, 48]} />
                <meshStandardMaterial
                  color="#c89d54"
                  metalness={0.95}
                  roughness={0.2}
                />
              </mesh>

              <mesh position={[side * 0.02, 0, 0]}>
                <boxGeometry args={[0.024, 0.14, 0.14]} />
                <meshStandardMaterial
                  color="#22252c"
                  metalness={0.7}
                  roughness={0.28}
                />
              </mesh>
              <mesh position={[side * 0.033, 0, 0]}>
                <boxGeometry args={[0.006, 0.085, 0.085]} />
                <meshStandardMaterial
                  color={colorway.accentColor}
                  metalness={0.92}
                  roughness={0.18}
                />
              </mesh>

              <mesh
                position={[side * 0.018, 0.18, 0.08]}
                rotation={[0.4, 0, 0]}
              >
                <boxGeometry args={[0.028, 0.09, 0.22]} />
                <meshStandardMaterial
                  color="#292c34"
                  metalness={0.45}
                  roughness={0.35}
                />
              </mesh>
            </group>

            {/* LAYER 3: 40mm Beryllium Dynamic Driver */}
            <group ref={layer3Ref} position={[side * 0.01, 0, 0]}>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.35, 0.024, 16, 48]} />
                <meshStandardMaterial
                  color={colorway.yokeColor}
                  metalness={0.85}
                  roughness={0.25}
                  emissive={emissiveFor(2)}
                  emissiveIntensity={emissiveIntensityFor(2)}
                />
              </mesh>

              <mesh
                geometry={driverConeGeo}
                rotation={[0, 0, inwardLatheRotZ]}
                castShadow
              >
                <meshPhysicalMaterial
                  color={colorway.driverColor}
                  metalness={0.92}
                  roughness={0.18}
                  clearcoat={0.45}
                  side={THREE.DoubleSide}
                  emissive={emissiveFor(2)}
                  emissiveIntensity={emissiveIntensityFor(2)}
                />
              </mesh>

              <mesh
                position={[side * 0.04, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.115, 0.115, 0.065, 32]} />
                <meshStandardMaterial
                  color="#b87333"
                  metalness={0.95}
                  roughness={0.22}
                />
              </mesh>
              <mesh
                position={[side * 0.075, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.09, 0.09, 0.04, 32]} />
                <meshStandardMaterial
                  color="#d4d4d8"
                  metalness={0.95}
                  roughness={0.15}
                />
              </mesh>
            </group>

            {/* LAYER 4: Acoustic Damping Chamber & Micro-Perforated Grille */}
            <group ref={layer4Ref} position={[-side * 0.045, 0, 0]}>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.37, 0.022, 16, 48]} />
                <meshStandardMaterial
                  color="#1c1e24"
                  metalness={0.5}
                  roughness={0.45}
                  emissive={emissiveFor(3)}
                  emissiveIntensity={emissiveIntensityFor(3)}
                />
              </mesh>

              <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.365, 0.365, 0.016, 48]} />
                <meshStandardMaterial
                  color={colorway.meshColor}
                  metalness={0.35}
                  roughness={0.65}
                  bumpMap={textures.grille}
                  bumpScale={0.012}
                  emissive={emissiveFor(3)}
                  emissiveIntensity={emissiveIntensityFor(3)}
                />
              </mesh>
            </group>

            {/* LAYER 5: Memory Foam Lambskin Ear Cushion */}
            <group ref={layer5Ref} position={[-side * 0.125, 0, 0]}>
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                <torusGeometry args={[0.35, 0.115, 28, 64]} />
                <meshPhysicalMaterial
                  color={colorway.leatherColor}
                  metalness={0.04}
                  roughness={0.72}
                  bumpMap={textures.leather}
                  bumpScale={0.008}
                  sheen={0.45}
                  sheenRoughness={0.6}
                  sheenColor={colorway.accentColor}
                  emissive={emissiveFor(4)}
                  emissiveIntensity={emissiveIntensityFor(4)}
                />
              </mesh>

              <mesh
                position={[side * 0.02, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.26, 0.26, 0.015, 36]} />
                <meshStandardMaterial
                  color="#111216"
                  roughness={0.92}
                  metalness={0.02}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function HeadphoneModel({
  scrollProgressRef,
  colorway,
  manualExplode,
  activeLayer,
  orbitEnabled,
}) {
  const rootGroupRef = useRef();
  const explodeRef = useRef(0);
  const ancRingsRef = useRef();
  const { size } = useThree();

  const textures = useMemo(
    () => ({
      brushed: getBrushedMetalTexture(),
      leather: getLeatherGrainTexture(),
      grille: getAcousticGrilleTexture(),
    }),
    []
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const p = scrollProgressRef.current;
    const isMobile = size.width < 768;
    const pose = getScrollPose(p, isMobile);

    const targetExplode = manualExplode ? 1.0 : pose.autoExplode;
    explodeRef.current = THREE.MathUtils.damp(
      explodeRef.current,
      targetExplode,
      5.5,
      delta
    );

    if (rootGroupRef.current) {
      const t = state.clock.elapsedTime;
      const idleFloat = Math.sin(t * 1.4) * 0.038;
      const idleTilt = Math.cos(t * 0.9) * 0.022;

      const targetX = orbitEnabled ? (isMobile ? 0 : 0.35) : pose.x;
      const targetY = orbitEnabled ? -0.1 : pose.y + idleFloat;
      const targetZ = orbitEnabled ? 0 : pose.z;

      rootGroupRef.current.position.x = THREE.MathUtils.damp(
        rootGroupRef.current.position.x,
        targetX,
        4.8,
        delta
      );
      rootGroupRef.current.position.y = THREE.MathUtils.damp(
        rootGroupRef.current.position.y,
        targetY,
        4.8,
        delta
      );
      rootGroupRef.current.position.z = THREE.MathUtils.damp(
        rootGroupRef.current.position.z,
        targetZ,
        4.8,
        delta
      );

      if (!orbitEnabled) {
        rootGroupRef.current.rotation.x = THREE.MathUtils.damp(
          rootGroupRef.current.rotation.x,
          pose.rx + idleTilt,
          4.5,
          delta
        );
        rootGroupRef.current.rotation.y = THREE.MathUtils.damp(
          rootGroupRef.current.rotation.y,
          pose.ry + Math.sin(t * 0.5) * 0.05,
          4.5,
          delta
        );
        rootGroupRef.current.rotation.z = THREE.MathUtils.damp(
          rootGroupRef.current.rotation.z,
          pose.rz,
          4.5,
          delta
        );
      }
    }

    if (ancRingsRef.current) {
      const pulseVis = orbitEnabled ? 0 : pose.ancPulse;
      ancRingsRef.current.visible = pulseVis > 0.02;
      if (ancRingsRef.current.visible) {
        const t = state.clock.elapsedTime;
        ancRingsRef.current.children.forEach((ring, idx) => {
          const wave = (t * 0.55 + idx * 0.33) % 1;
          const scale = 1 + wave * 0.65;
          ring.scale.set(scale, scale, 1);
          ring.material.opacity = (1 - wave) * 0.32 * pulseVis;
        });
      }
    }
  });

  return (
    <group
      ref={rootGroupRef}
      position={[0.78, -0.18, 0]}
      rotation={[0.1, -0.52, -0.04]}
    >
      {/* HEADBAND ARCH ASSEMBLY */}
      <group position={[0, 0.42, 0]}>
        <mesh
          rotation={[0, 0, Math.PI * 0.02]}
          scale={[1, 1, 1.85]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[1.18, 0.085, 28, 84, Math.PI * 0.96]} />
          <meshPhysicalMaterial
            color={colorway.metalColor}
            metalness={0.82}
            roughness={0.32}
            bumpMap={textures.brushed}
            bumpScale={0.003}
            clearcoat={0.25}
          />
        </mesh>

        {/* Inner Lambskin Cushion Padding */}
        <mesh
          rotation={[0, 0, Math.PI * 0.14]}
          scale={[1, 1, 1.65]}
          receiveShadow
        >
          <torusGeometry args={[1.08, 0.068, 22, 72, Math.PI * 0.72]} />
          <meshPhysicalMaterial
            color={colorway.leatherColor}
            metalness={0.04}
            roughness={0.76}
            bumpMap={textures.leather}
            bumpScale={0.008}
          />
        </mesh>

        {/* Left & Right Headband End Caps (aligned directly over vertical stems) */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 1.178, 0.075, 0]}>
            <mesh scale={[1, 1, 1.65]} castShadow>
              <cylinderGeometry args={[0.086, 0.072, 0.13, 28]} />
              <meshPhysicalMaterial
                color={colorway.yokeColor}
                metalness={0.92}
                roughness={0.2}
              />
            </mesh>
            <mesh
              position={[0, -0.06, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[1, 1.65, 1]}
            >
              <torusGeometry args={[0.072, 0.008, 12, 28]} />
              <meshStandardMaterial
                color={colorway.accentColor}
                metalness={0.94}
                roughness={0.18}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* LEFT & RIGHT EARCUP ASSEMBLIES */}
      <EarcupAssembly
        side={-1}
        colorway={colorway}
        explodeRef={explodeRef}
        activeLayer={activeLayer}
        textures={textures}
      />
      <EarcupAssembly
        side={1}
        colorway={colorway}
        explodeRef={explodeRef}
        activeLayer={activeLayer}
        textures={textures}
      />

      {/* SUBTLE ANC ACOUSTIC WAVE RINGS (CHAPTER 4) */}
      <group ref={ancRingsRef} position={[0, -0.5, 0]} visible={false}>
        {[0, 1, 2].map((idx) => (
          <mesh
            key={idx}
            position={[1.34, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <ringGeometry args={[0.52, 0.54, 64]} />
            <meshBasicMaterial
              color={colorway.accentColor}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
