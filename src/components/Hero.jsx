import React, { useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Stars } from '@react-three/drei'
import SocialLinks from './SocialLinks'

function AnimatedSphere() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  return (
    <Sphere ref={meshRef} args={[1, 80, 80]} scale={2.2}>
      <MeshDistortMaterial
        color="#00d4ff"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.1}
        wireframe
      />
    </Sphere>
  )
}

const TYPED_TEXTS = ['AI Developer', 'Web Developer', 'Problem Solver']

function TypedText() {
  const [index, setIndex] = React.useState(0)
  const [displayed, setDisplayed] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)
  const texts = TYPED_TEXTS

  React.useEffect(() => {
    const current = texts[index]
    let timeout

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setIndex((prev) => (prev + 1) % texts.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, index])

  return (
    <span className="gradient-text font-semibold">
      {displayed}
      <span className="animate-pulse text-cyan-400">|</span>
    </span>
  )
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <Stars radius={300} depth={60} count={3000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} color="#7c3aed" intensity={0.5} />
            <AnimatedSphere />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-transparent to-[#050816] z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-transparent to-[#050816] z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
            Welcome to my Portfolio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4"
        >
          <span className="gradient-text text-shadow-glow">
            Kata Sai Kranthu Reddy
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 h-10"
        >
          <TypedText />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Building intelligent systems and modern web experiences.
          Passionate about AI, machine learning, and creating solutions that matter.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold neon-glow transition-all duration-300 hover:opacity-90"
          >
            View Projects
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full glass-card neon-border text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-all duration-300"
          >
            Contact Me
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center"
        >
          <SocialLinks />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-3 bg-cyan-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
