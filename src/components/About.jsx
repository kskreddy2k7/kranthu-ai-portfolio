import React from 'react'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Projects', value: '10+' },
  { label: 'Technologies', value: '15+' },
  { label: 'Year of Study', value: '1st' },
]

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">Who I Am</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">
            <span className="gradient-text">About Me</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card p-8 neon-border"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                K
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Kata Sai Kranthu Reddy</h3>
                <p className="text-cyan-400 text-sm">AI Developer & Web Developer</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              I'm a passionate 1st-year B.Tech student in Computer Science & Engineering (AI/ML)
              at <span className="text-cyan-400 font-semibold">SRM University, Kattankulathur</span>.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              I love building <span className="text-purple-400 font-semibold">intelligent systems</span> and
              modern web experiences. My work spans AI/ML applications, NLP projects, and
              full-stack web development.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Always learning, always building — turning ideas into impactful software solutions.
            </p>
          </motion.div>

          {/* Stats + Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="glass-card p-5 text-center neon-border"
                >
                  <p className="text-3xl font-extrabold gradient-text">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 neon-border"
            >
              <h4 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <span>🎓</span> Education
              </h4>
              <p className="text-white font-medium">B.Tech — CS Engineering (AI/ML)</p>
              <p className="text-gray-400 text-sm mt-1">SRM University, Kattankulathur</p>
              <p className="text-gray-500 text-xs mt-1">1st Year Student • 2024–2028</p>
            </motion.div>

            {/* Focus areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="glass-card p-6 neon-border"
            >
              <h4 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <span>🚀</span> Focus Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {['AI/ML', 'NLP', 'React', 'Python', 'Flask', 'Android'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
