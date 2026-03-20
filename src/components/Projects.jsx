import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function ProjectCard({ repo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="glass-card p-6 neon-border hover:border-cyan-400/50 transition-all duration-300 flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd"/>
            <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"/>
          </svg>
        </div>
        <div className="flex gap-2">
          {repo.language && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
              {repo.language}
            </span>
          )}
        </div>
      </div>

      <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
        {repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}
      </h3>

      <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
        {repo.description || 'No description available.'}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-4 text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {repo.forks_count}
          </span>
        </div>

        <motion.a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-cyan-400 text-xs font-semibold hover:text-cyan-300 transition-colors"
        >
          View on GitHub
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/users/kskreddy2k7/repos?per_page=100&sort=updated')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data
            .filter((r) => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6)
          setRepos(sorted)
        } else {
          setError('Failed to fetch repositories.')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch repositories.')
        setLoading(false)
      })
  }, [])

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">What I've Built</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2">
            <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full"
            />
          </div>
        )}

        {error && (
          <div className="text-center text-gray-400 py-10">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <ProjectCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <a
            href="https://github.com/kskreddy2k7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass-card neon-border text-cyan-400 hover:border-cyan-400/70 hover:bg-cyan-400/5 transition-all duration-300 rounded-full text-sm font-semibold"
          >
            View All Repositories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
