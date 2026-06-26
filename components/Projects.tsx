import React from 'react'

const projects = [
  { id: 1, title: 'Lumina UI', category: 'Design System', image: '/sequence/frame_015.webp' },
  { id: 2, title: 'Aura', category: 'E-commerce', image: '/sequence/frame_035.webp' },
  { id: 3, title: 'Nexus', category: 'Analytics', image: '/sequence/frame_055.webp' },
  { id: 4, title: 'Vortex', category: 'Creative Portfolio', image: '/sequence/frame_075.webp' },
]

export default function Projects() {
  return (
    <section className="py-32 px-6 md:px-12 bg-black relative z-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tight">
          Selected Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="group relative rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-2xl p-4 transition-all duration-700 hover:bg-white/10 hover:border-white/20 shadow-2xl"
            >
              <div className="relative h-80 w-full rounded-[1.5rem] overflow-hidden mb-6">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
              </div>
              
              <div className="px-4 pb-4 flex justify-between items-end">
                <div>
                  <p className="text-white/50 text-sm mb-2 font-mono uppercase tracking-widest">{project.category}</p>
                  <h3 className="text-3xl font-semibold text-white tracking-tight">{project.title}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-500 transform group-hover:-rotate-45">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
              
              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/0 group-hover:ring-white/20 transition-all duration-700 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
