import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const SECTION_MAP = {
  hero:       [2.0,  1.2, 0],
  about:      [2.0,  1.2, 0],
  skills:     [2.0,  1.2, 0],
  experience: [2.0,  1.2, 0],
  projects:   [2.0,  1.2, 0],
  chatbot:    [2.0,  1.2, 0],
  contact:    [2.0,  1.2, 0],
};

// ── Cute Ring LED Eyes ──
function Eyes({ speaking }) {
  const leftCoreMat  = useRef();
  const rightCoreMat = useRef();
  const leftHaloMat  = useRef();
  const rightHaloMat = useRef();
  const group = useRef();

  const cyan = new THREE.Color("#00d4ff");
  const pink = new THREE.Color("#ff4dd2");

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    // Smooth Blue <-> Pink when speaking, otherwise steady cyan
    if (speaking) {
      const mix = (Math.sin(t * 2.5) + 1) / 2;
      const col = new THREE.Color().lerpColors(cyan, pink, mix);
      if (leftCoreMat.current)  leftCoreMat.current.color.lerp(col, delta * 4);
      if (rightCoreMat.current) rightCoreMat.current.color.lerp(col, delta * 4);
      if (leftHaloMat.current)  leftHaloMat.current.color.lerp(col, delta * 4);
      if (rightHaloMat.current) rightHaloMat.current.color.lerp(col, delta * 4);
    } else {
      if (leftCoreMat.current)  leftCoreMat.current.color.lerp(cyan, delta * 2);
      if (rightCoreMat.current) rightCoreMat.current.color.lerp(cyan, delta * 2);
      if (leftHaloMat.current)  leftHaloMat.current.color.lerp(cyan, delta * 2);
      if (rightHaloMat.current) rightHaloMat.current.color.lerp(cyan, delta * 2);
    }

    if (group.current) {
      group.current.position.y = Math.sin(t * 1.0) * 0.003;
    }
  });

  return (
    <group ref={group} position={[0, 0.03, 0.31]}>
      {/* LEFT EYE */}
      <group position={[-0.085, 0, 0]}>
        {/* Core bright circle */}
        <mesh>
          <circleGeometry args={[0.028, 32]} />
          <meshBasicMaterial ref={leftCoreMat} color="#00d4ff" />
        </mesh>
        {/* Soft glow halo */}
        <mesh position={[0, 0, -0.001]} scale={[2.2, 2.2, 1]}>
          <circleGeometry args={[0.028, 32]} />
          <meshBasicMaterial ref={leftHaloMat} color="#00d4ff" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* RIGHT EYE */}
      <group position={[0.085, 0, 0]}>
        {/* Core bright circle */}
        <mesh>
          <circleGeometry args={[0.028, 32]} />
          <meshBasicMaterial ref={rightCoreMat} color="#00d4ff" />
        </mesh>
        {/* Soft glow halo */}
        <mesh position={[0, 0, -0.001]} scale={[2.2, 2.2, 1]}>
          <circleGeometry args={[0.028, 32]} />
          <meshBasicMaterial ref={rightHaloMat} color="#00d4ff" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}


// ── Glowing Chest Core ──
function ChestCore({ speaking }) {
    const coreGlow = useRef();
    
    useFrame(({ clock }) => {
        const pulse = speaking ? Math.sin(clock.elapsedTime * 20) * 0.3 : 0;
        if (coreGlow.current) {
            coreGlow.current.scale.setScalar(1.0 + pulse);
            coreGlow.current.material.opacity = speaking ? 1.0 : 0.8;
        }
    });

    return (
        <group position={[0, 0, 0.20]}>
            <mesh>
                <torusGeometry args={[0.06, 0.015, 16, 32]} />
                <meshStandardMaterial color="#112233" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh ref={coreGlow} position={[0, 0, 0.01]}>
                <circleGeometry args={[0.055, 32]} />
                <meshBasicMaterial color="#00e5ff" transparent blending={THREE.AdditiveBlending} />
            </mesh>
            <pointLight distance={1.5} intensity={speaking ? 4 : 1.5} color="#00e5ff" />
        </group>
    );
}

// ── Realistic Plasma Jet Flame ──
function JetFlame({ speaking }) {
  const innerFlame = useRef();
  const midFlame = useRef();
  const outerFlame = useRef();

  useFrame(({ clock }) => {
     const t = clock.elapsedTime;
     // Constant, steady flow logic (NO BLINKING)
     const basePulse = Math.sin(t * 10) * 0.02; // Very slow, subtle drift
     const speakGlow = speaking ? 0.1 : 0; 
     const scaleY = (0.25 + basePulse + speakGlow); // MUCH SHORTER
     
     if (innerFlame.current) {
        innerFlame.current.scale.y = scaleY * 1.2;
        innerFlame.current.scale.x = 1.4; // Fixed width for constancy
        innerFlame.current.scale.z = 1.4;
     }
     if (midFlame.current) {
        midFlame.current.scale.y = scaleY * 1.0;
        midFlame.current.scale.x = 2.0; 
        midFlame.current.scale.z = 2.0;
     }
     if (outerFlame.current) {
        outerFlame.current.scale.y = scaleY * 0.7;
        outerFlame.current.scale.x = 2.8; 
        outerFlame.current.scale.z = 2.8;
     }
  });

  return (
      <group position={[0, -0.05, 0]}>
         {/* Nozzle Heat Base */}
         <mesh position={[0, -0.02, 0]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
         </mesh>

         {/* Hot Core - Pure White Hot Plasma */}
         <mesh ref={innerFlame} position={[0, -0.05, 0]}>
             <coneGeometry args={[0.02, 0.45, 24]} />
             <meshBasicMaterial color="#ffffff" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
         </mesh>
         
         {/* Mid Plasma - Intense Cyan Heat */}
         <mesh ref={midFlame} position={[0, -0.06, 0]}>
             <coneGeometry args={[0.055, 0.65, 24]} />
             <meshBasicMaterial color="#00f7ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
         </mesh>

         {/* Outer Atmospheric Glow - Deep Blue Trail */}
         <mesh ref={outerFlame} position={[0, -0.08, 0]}>
             <coneGeometry args={[0.08, 0.4, 24]} />
             <meshBasicMaterial color="#0033ff" transparent opacity={speaking ? 0.2 : 0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
         </mesh>

         {/* Realistic Embers/Sparkles trailing the exhaust */}
         <Sparkles 
            count={12} 
            scale={[0.2, 0.2, 0.2]} 
            position={[0, -0.15, 0]}
            color="#00f7ff"
            size={4}
            speed={1.0}
            noise={1}
            opacity={speaking ? 0.9 : 0.5}
         />
      </group>
  );
}


export default function CuteRobot({ sectionId, speaking, onReady }) {
  const group = useRef();
  const headGroup = useRef();
  const bodyGroup = useRef();
  
  const leftArm = useRef();
  const rightArm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  
  const [hovered, setHovered] = useState(false);
  const targetPos = useRef(new THREE.Vector3(1.2, 1.2, 0));
  const currentPos = useRef(new THREE.Vector3(1.2, 1.2, 0));

  useEffect(() => { if (onReady) onReady(); }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (!group.current) return;

    // ── Optimized Mobile Pathing ──
    const isMobile = window.innerWidth < 768;
    
    // On mobile, if we are in Hero, stay centered and high.
    // Otherwise, float in a fixed "Assistant" position (bottom-right area of screen space).
    if (isMobile) {
      if (sectionId === 'hero') {
        // Adjusted: slightly to the right and higher up to clear "Hi, I'm" text
        targetPos.current.set(0.4, 1.6, 0); 
      } else {
        // Floating bottom-right assistant position
        targetPos.current.set(0.6, -1.2, 0);
      }
    } else {
      // Desktop: Stay on the right side
      targetPos.current.set(1.2, 1.2, 0);
    }

    currentPos.current.lerp(targetPos.current, delta * 2.5);
    group.current.position.copy(currentPos.current);

    // Look-At logic towards UI
    const lookLeft = -0.3;
    
    if (headGroup.current && bodyGroup.current) {
        // Head tracking
        headGroup.current.position.y = Math.sin(t * 2) * 0.02 + 0.35;
        headGroup.current.rotation.y = THREE.MathUtils.lerp(headGroup.current.rotation.y, lookLeft, delta * 5);
        headGroup.current.rotation.z = THREE.MathUtils.lerp(headGroup.current.rotation.z, Math.sin(t*0.5)*0.05, delta * 4);
        headGroup.current.rotation.x = THREE.MathUtils.lerp(headGroup.current.rotation.x, hovered ? 0.05 : 0.02, delta * 4);
        
        // Body tracking
        bodyGroup.current.position.y = Math.sin(t * 1.5) * 0.03 - 0.15; // Shifted up slightly
        bodyGroup.current.rotation.y = THREE.MathUtils.lerp(bodyGroup.current.rotation.y, lookLeft * 0.5, delta * 3);
        bodyGroup.current.rotation.x = THREE.MathUtils.lerp(bodyGroup.current.rotation.x, 0.1, delta * 3); // tilt forward a bit
    }
    
    // Arms swinging gently
    if (leftArm.current && rightArm.current) {
        leftArm.current.rotation.x = Math.sin(t * 2.2) * 0.1 + 0.1;
        leftArm.current.rotation.z = 0.4;
        
        rightArm.current.rotation.x = Math.sin(t * 2.2 + Math.PI) * 0.1 + 0.1;
        rightArm.current.rotation.z = -0.4;
    }
    
    // Legs hovering
    if (leftLeg.current && rightLeg.current) {
        leftLeg.current.rotation.x = Math.sin(t * 3) * 0.05 - 0.2;
        rightLeg.current.rotation.x = Math.sin(t * 3) * 0.05 - 0.2;
    }
  });

  return (
    <group 
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>

        {/* ── HEAD SECTION ── */}
        <group ref={headGroup}>
            {/* White Glossy Rounded Head */}
            <mesh scale={[1.4, 1.2, 1.3]}>
                <sphereGeometry args={[0.20, 32, 32]} />
                <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.1} clearcoat={1.0} clearcoatRoughness={0.05} />
            </mesh>
            
            {/* Massive Wide Black Glass Faceplate */}
            <mesh position={[0, 0.02, 0.16]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.13, 0.3, 32, 32]} />
                <meshPhysicalMaterial color="#020305" metalness={0.9} roughness={0.05} clearcoat={1.0} clearcoatRoughness={0.01} />
            </mesh>

            {/* Side Ear Caps */}
            <group position={[-0.28, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                <mesh><cylinderGeometry args={[0.08, 0.08, 0.04, 32]} /><meshStandardMaterial color="#ffffff" roughness={0.2}/></mesh>
                <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 32]} /><meshStandardMaterial color="#0088ff" roughness={0.2} metalness={0.6}/></mesh>
            </group>
            <group position={[0.28, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                <mesh><cylinderGeometry args={[0.08, 0.08, 0.04, 32]} /><meshStandardMaterial color="#ffffff" roughness={0.2}/></mesh>
                <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.05, 0.05, 0.02, 32]} /><meshStandardMaterial color="#0088ff" roughness={0.2} metalness={0.6}/></mesh>
            </group>

            <Eyes speaking={speaking} />
        </group>

        {/* ── BODY SECTION ── */}
        <group ref={bodyGroup}>
            {/* Dark Neck */}
            <mesh position={[0, 0.22, 0]}>
               <cylinderGeometry args={[0.06, 0.08, 0.1, 16]} />
               <meshStandardMaterial color="#111" metalness={0.7} roughness={0.5}/>
            </mesh>

            {/* Glossy White Torso Chubby */}
            <mesh position={[0, 0.05, 0]}>
                <sphereGeometry args={[0.20, 32, 32]} />
                <meshPhysicalMaterial color="#ffffff" metalness={0.1} roughness={0.1} clearcoat={1.0} clearcoatRoughness={0.05} />
            </mesh>
            
            {/* Chest Core Indicator */}
            <ChestCore speaking={speaking} />

            {/* ── ARMS ── */}
            {/* Left Arm */}
            <group ref={leftArm} position={[-0.22, 0.10, 0]}>
                {/* Shoulder Ball */}
                <mesh position={[0,0,0]}><sphereGeometry args={[0.06, 16, 16]}/><meshStandardMaterial color="#112233" metalness={0.8} /></mesh>
                {/* Arm Body */}
                <mesh position={[-0.08, -0.12, 0]} rotation={[0, 0, -0.2]}>
                    <capsuleGeometry args={[0.04, 0.15, 16, 16]} />
                    <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1.0} />
                </mesh>
                {/* Hand Claws */}
                <mesh position={[-0.12, -0.25, 0]} rotation={[0, 0, -0.2]}>
                    <cylinderGeometry args={[0.02, 0.01, 0.08, 16]} />
                    <meshStandardMaterial color="#112233" metalness={0.8} />
                </mesh>
            </group>

            {/* Right Arm */}
            <group ref={rightArm} position={[0.22, 0.10, 0]}>
                {/* Shoulder Ball */}
                <mesh position={[0,0,0]}><sphereGeometry args={[0.06, 16, 16]}/><meshStandardMaterial color="#112233" metalness={0.8} /></mesh>
                {/* Arm Body */}
                <mesh position={[0.08, -0.12, 0]} rotation={[0, 0, 0.2]}>
                    <capsuleGeometry args={[0.04, 0.15, 16, 16]} />
                    <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1.0} />
                </mesh>
                {/* Hand Claws */}
                <mesh position={[0.12, -0.25, 0]} rotation={[0, 0, 0.2]}>
                    <cylinderGeometry args={[0.02, 0.01, 0.08, 16]} />
                    <meshStandardMaterial color="#112233" metalness={0.8} />
                </mesh>
            </group>

            {/* ── LEGS / THRUSTERS ── */}
            {/* Left Leg Thruster */}
            <group ref={leftLeg} position={[-0.1, -0.15, 0]} rotation={[0, 0, -0.1]}>
                <mesh position={[0, 0, 0]}>
                    <capsuleGeometry args={[0.05, 0.12, 16, 16]} />
                    <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1.0} />
                </mesh>
                <mesh position={[0, -0.08, 0]}>
                    <cylinderGeometry args={[0.05, 0.04, 0.04, 16]} />
                    <meshStandardMaterial color="#112233" metalness={0.8} />
                </mesh>
                <JetFlame speaking={speaking} />
            </group>

            {/* Right Leg Thruster */}
            <group ref={rightLeg} position={[0.1, -0.15, 0]} rotation={[0, 0, 0.1]}>
                <mesh position={[0, 0, 0]}>
                    <capsuleGeometry args={[0.05, 0.12, 16, 16]} />
                    <meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1.0} />
                </mesh>
                <mesh position={[0, -0.08, 0]}>
                    <cylinderGeometry args={[0.05, 0.04, 0.04, 16]} />
                    <meshStandardMaterial color="#112233" metalness={0.8} />
                </mesh>
                <JetFlame speaking={speaking} />
            </group>

        </group>
      </Float>

      {/* Bright Space Lighting to clearly show the model details */}
      <spotLight position={[0, 3, 2]} intensity={4} color="#ffffff" distance={10} penumbra={0.5} />
      <pointLight position={[0, -1, 1]} intensity={2.5} color="#00e5ff" distance={5} />
      <ambientLight intensity={1.5} />
      
      {/* Intense flame environment light */}
      <pointLight position={[0, -2, 0]} intensity={speaking ? 6 : 4} color="#0088ff" distance={6} />
    </group>
  );
}