import React from 'react'
import { motion } from 'framer-motion'

const skills = [
  { name: 'JavaScript', icon: '⚡', level: 80, color: 'from-yellow-400 to-yellow-600' },
  { name: 'React', icon: '⚛️', level: 75, color: 'from-cyan-400 to-cyan-600' },
  { name: 'Python', icon: '🐍', level: 85, color: 'from-blue-400 to-blue-600' },
  { name: 'HTML/CSS', icon: '🎨', level: 85, color: 'from-orange-400 to-orange-600' },
  { name: 'AI Tools', icon: '🤖', level: 70, color: 'from-purple-400 to-purple-600' },
  { name: 'GitHub', icon: '🐙', level: 80, color: 'from-gray-400 to-gray-600' },
  { name: 'Flask', icon: '🌶️', level: 75, color: 'from-green-400 to-green-600' },
  { name: 'Machine Learning', icon: '🧠', level: 65, color: 'from-pink-400 to-pink-600' },
]

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">What I Know</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">
            <span className="gradient-text">Skills</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 neon-border text-center cursor-default group hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{skill.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-3">{skill.name}</h3>
              {/* Progress bar */}
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.08 + 0.3 }}
                  className={`h-1.5 rounded-full bg-gradient-to-r ${skill.color}`}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">{skill.level}%</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
