import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ── Section → position map ─────────────────────────────────────────── */
const SECTION_MAP = {
  hero:       [2.0,  0.0, 0],
  about:      [1.8,  0.2, 0],
  skills:     [1.8,  0.1, 0],
  experience: [1.8,  0.0, 0],
  projects:   [1.8, -0.1, 0],
  chatbot:    [1.8,  0.0, 0],
  contact:    [1.8,  0.0, 0],
};

/* ── Reusable glowing material helper ──────────────────────────────── */
function GlowMesh({ color, emissive, emissiveIntensity = 2, ...props }) {
  return (
    <mesh {...props}>
      {props.children}
      <meshStandardMaterial
        color={color}
        emissive={emissive || color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.05}
        metalness={0.1}
      />
    </mesh>
  );
}

/* ── Big oval eye with animated blink ──────────────────────────────── */
function AnimatedEye({ position, speaking }) {
  const meshRef = useRef();
  const pupilRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!meshRef.current) return;

    // Blink every ~4 seconds
    const blinkPhase = (t % 4.0);
    const blink = blinkPhase < 0.12 ? 0.05 : 1.0;
    
    // Speaking pulse
    const pulsate = speaking ? 1.0 + Math.sin(t * 12) * 0.15 : 1.0;

    // Apply combined scales to the whole eye group
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, blink * 0.048, 0.35);
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, pulsate * 0.042, 0.2);

    // Pupil micro-drift
    if (pupilRef.current) {
      pupilRef.current.position.x = Math.sin(t * 0.7) * 0.15;
      pupilRef.current.position.y = Math.cos(t * 0.5) * 0.12;
    }
  });

  return (
    <group position={position} ref={meshRef}>
      {/* Eye white glow backing */}
      <mesh>
        <circleGeometry args={[1, 32]} />
        <meshStandardMaterial color="#0af" emissive="#0af" emissiveIntensity={1.2} roughness={0} transparent opacity={0.25} />
      </mesh>
      {/* Bright cyan iris */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={3.5} roughness={0} />
      </mesh>
      {/* Dark pupil */}
      <mesh ref={pupilRef} position={[0, 0, 0.02]}>
        <circleGeometry args={[0.3, 24]} />
        <meshStandardMaterial color="#001a22" roughness={0} />
      </mesh>
      {/* Catchlight sparkle */}
      <mesh position={[0.3, 0.4, 0.03]}>
        <circleGeometry args={[0.15, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} roughness={0} />
      </mesh>
    </group>
  );
}

/* ── Main Robot ─────────────────────────────────────────────────────── */
export default function CuteRobot({ sectionId, speaking, onReady }) {
  const group    = useRef();
  const head     = useRef();
  const antenna  = useRef();
  const antennaTip = useRef();
  const bodyRef  = useRef();
  const armL     = useRef();
  const armR     = useRef();
  const auraRef  = useRef();
  const ringRef  = useRef();
  const [hovered, setHovered] = useState(false);

  const targetPos  = useRef(new THREE.Vector3(2.0, 0, 0));
  const currentPos = useRef(new THREE.Vector3(2.0, 0, 0));

  useEffect(() => { if (onReady) onReady(); }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (!group.current) return;

    /* Position lerp */
    const isMobile = window.innerWidth < 768;
    const raw = SECTION_MAP[sectionId] || [2.0, 0, 0];
    const responsiveX = isMobile ? raw[0] * 0.35 : raw[0]; // Bring closer to center on mobile
    targetPos.current.set(responsiveX, raw[1], raw[2]);
    currentPos.current.lerp(targetPos.current, delta * 3);
    group.current.position.copy(currentPos.current);

    /* Floating bob */
    group.current.position.y += Math.sin(t * 1.4) * 0.055;

    /* Head gentle look-around */
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.45) * 0.18;
      head.current.rotation.x = Math.cos(t * 0.38) * 0.07;
    }

    /* Antenna sway */
    if (antenna.current) antenna.current.rotation.z = Math.sin(t * 2.1) * 0.12;

    /* Antenna tip pulse */
    if (antennaTip.current) {
      const p = 0.6 + Math.sin(t * 4) * 0.4;
      antennaTip.current.material.emissiveIntensity = p * 3;
    }

    /* Arms gentle float */
    if (armL.current) armL.current.rotation.z = 0.3 + Math.sin(t * 1.2) * 0.08;
    if (armR.current) armR.current.rotation.z = -0.3 + Math.sin(t * 1.2 + 1) * 0.08;

    /* Aura ring rotation */
    if (ringRef.current) ringRef.current.rotation.z = t * 0.4;

    /* Hover bounce */
    const scaleTarget = hovered ? 1.06 : 1.0;
    group.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 6);

    /* Tilt with direction */
    const tilt = (targetPos.current.x - currentPos.current.x) * 0.4;
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -tilt, delta * 2);
  });

  /* Body color: cyan normally, purple when hovered */
  const bodyEmissive   = hovered ? '#b53cff' : '#00d4e8';
  const bodyEmissiveInt = hovered ? 0.35 : 0.12;

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={()  => setHovered(false)}
    >
      <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.18}>

        {/* ── LEGS ─────────────────────────────────────────────────── */}
        <group position={[0, -0.44, 0]}>
          <RoundedBox args={[0.09, 0.16, 0.09]} radius={0.03} position={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#e8f4f8" metalness={0.4} roughness={0.35} emissive={bodyEmissive} emissiveIntensity={bodyEmissiveInt} />
          </RoundedBox>
          <RoundedBox args={[0.09, 0.16, 0.09]} radius={0.03} position={[0.1, 0, 0]}>
            <meshStandardMaterial color="#e8f4f8" metalness={0.4} roughness={0.35} emissive={bodyEmissive} emissiveIntensity={bodyEmissiveInt} />
          </RoundedBox>
          {/* Foot glow shadows */}
          <mesh position={[-0.1, -0.09, 0]}>
            <circleGeometry args={[0.06, 20]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.6} transparent opacity={0.25} />
          </mesh>
          <mesh position={[0.1, -0.09, 0]}>
            <circleGeometry args={[0.06, 20]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={0.6} transparent opacity={0.25} />
          </mesh>
        </group>

        {/* ── BODY ─────────────────────────────────────────────────── */}
        <RoundedBox ref={bodyRef} args={[0.42, 0.46, 0.28]} radius={0.11} smoothness={6} position={[0, -0.05, 0]}>
          <meshStandardMaterial color="#eef6fb" metalness={0.55} roughness={0.18} emissive={bodyEmissive} emissiveIntensity={bodyEmissiveInt} />
        </RoundedBox>

        {/* Chest panel / core crystal */}
        <mesh position={[0, -0.02, 0.145]}>
          <boxGeometry args={[0.15, 0.1, 0.01]} />
          <meshStandardMaterial color="#001a22" roughness={0} />
        </mesh>
        <mesh position={[0, -0.02, 0.146]}>
          <planeGeometry args={[0.09, 0.06]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={speaking ? 3.5 : 1.5} transparent opacity={0.9} />
        </mesh>
        {/* Small indicator dots */}
        {[-0.04, 0, 0.04].map((x, i) => (
          <mesh key={i} position={[x, -0.07, 0.146]}>
            <circleGeometry args={[0.008, 12]} />
            <meshStandardMaterial color={i === 1 ? '#ff00cc' : '#00f2ff'} emissive={i === 1 ? '#ff00cc' : '#00f2ff'} emissiveIntensity={2} />
          </mesh>
        ))}

        {/* ── ARMS ─────────────────────────────────────────────────── */}
        {/* Left arm */}
        <group ref={armL} position={[-0.3, -0.05, 0]}>
          <RoundedBox args={[0.09, 0.22, 0.09]} radius={0.03} rotation={[0, 0, 0.3]}>
            <meshStandardMaterial color="#dceef5" metalness={0.4} roughness={0.3} emissive={bodyEmissive} emissiveIntensity={bodyEmissiveInt * 0.7} />
          </RoundedBox>
          {/* Hand orb */}
          <mesh position={[-0.04, -0.14, 0]}>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={hovered ? 3 : 1.5} roughness={0} />
          </mesh>
        </group>
        {/* Right arm */}
        <group ref={armR} position={[0.3, -0.05, 0]}>
          <RoundedBox args={[0.09, 0.22, 0.09]} radius={0.03} rotation={[0, 0, -0.3]}>
            <meshStandardMaterial color="#dceef5" metalness={0.4} roughness={0.3} emissive={bodyEmissive} emissiveIntensity={bodyEmissiveInt * 0.7} />
          </RoundedBox>
          <mesh position={[0.04, -0.14, 0]}>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={hovered ? 3 : 1.5} roughness={0} />
          </mesh>
        </group>

        {/* ── HEAD ─────────────────────────────────────────────────── */}
        <group ref={head} position={[0, 0.31, 0]}>
          {/* Head shell */}
          <RoundedBox args={[0.38, 0.3, 0.28]} radius={0.1} smoothness={8}>
            <meshStandardMaterial color="#f2faff" metalness={0.45} roughness={0.15} emissive={bodyEmissive} emissiveIntensity={bodyEmissiveInt * 0.8} />
          </RoundedBox>

          {/* Dark visor / faceplate */}
          <mesh position={[0, 0.01, 0.143]}>
            <planeGeometry args={[0.3, 0.18]} />
            <meshStandardMaterial color="#020c12" roughness={0.05} metalness={0.3} />
          </mesh>

          {/* Big oval eyes */}
          <AnimatedEye position={[-0.075, 0.015, 0.145]} speaking={speaking} />
          <AnimatedEye position={[ 0.075, 0.015, 0.145]} speaking={speaking} />

          {/* Mouth — simple LED bar */}
          <mesh position={[0, -0.055, 0.145]}>
            <planeGeometry args={[0.1, 0.014]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={speaking ? 3 : 1} />
          </mesh>

          {/* Ear nubs */}
          <mesh position={[-0.2, 0.01, 0]}>
            <sphereGeometry args={[0.025, 14, 14]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0.2, 0.01, 0]}>
            <sphereGeometry args={[0.025, 14, 14]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.5} />
          </mesh>

          {/* ── ANTENNA ──────────────────────────────────────────── */}
          <group ref={antenna} position={[0, 0.19, 0]}>
            {/* Stem */}
            <mesh>
              <cylinderGeometry args={[0.008, 0.01, 0.14, 12]} />
              <meshStandardMaterial color="#c0d8e4" metalness={0.7} roughness={0.2} />
            </mesh>
            {/* Glowing tip */}
            <mesh ref={antennaTip} position={[0, 0.09, 0]}>
              <sphereGeometry args={[0.025, 20, 20]} />
              <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={3} roughness={0} />
            </mesh>
          </group>
        </group>

        {/* ── ORBIT RING ────────────────────────────────────────────── */}
        <mesh ref={ringRef} rotation={[Math.PI * 0.42, 0.2, 0]} position={[0, -0.05, 0]}>
          <torusGeometry args={[0.44, 0.005, 16, 100]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.8} transparent opacity={0.7} />
        </mesh>

        {/* Secondary thin ring */}
        <mesh rotation={[Math.PI * 0.55, 0.8, 0]} position={[0, -0.05, 0]}>
          <torusGeometry args={[0.5, 0.003, 12, 80]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={1.0} transparent opacity={0.4} />
        </mesh>

      </Float>

      {/* ── AURA LIGHTS ──────────────────────────────────────────────── */}
      <pointLight position={[0, 0.3, 0.3]} intensity={hovered ? 1.2 : 0.6} color="#00f2ff" distance={2} />
      <pointLight position={[0, -0.1, 0.2]} intensity={hovered ? 0.8 : 0.3} color="#b53cff" distance={1.5} />
    </group>
  );
}
