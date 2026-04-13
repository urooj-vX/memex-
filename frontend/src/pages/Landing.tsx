import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="dark text-on-surface overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl rounded-2xl bg-[#353534]/40 backdrop-blur-[24px] shadow-[0_40px_40px_rgba(209,188,255,0.05)] flex justify-between items-center px-6 py-3 z-50 border border-[#3B494B]/15">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#00F0FF]">insights</span>
          <span className="text-xl font-black tracking-[-0.04em] text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">Memex</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-['Inter'] font-medium tracking-tight text-[#E5E2E1]">
          <a className="text-[#00F0FF] font-bold" href="#">Analysis</a>
          <a className="text-[#B9CACB] hover:bg-[#00F0FF]/10 hover:text-[#DBFCFF] transition-all duration-300 px-3 py-1 rounded-lg" href="#">Behaviors</a>
          <a className="text-[#B9CACB] hover:bg-[#00F0FF]/10 hover:text-[#DBFCFF] transition-all duration-300 px-3 py-1 rounded-lg" href="#">Neural Deck</a>
        </nav>
        <button 
          onClick={() => navigate('/analyze')}
          className="bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#00F0FF] hover:text-[#002022] transition-all scale-95 active:scale-90"
        >
          Launch Archive
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[150px]"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 max-w-7xl w-full text-center space-y-12"
          >
            <div className="space-y-4">
              <span className="inline-block text-primary tracking-[0.4em] uppercase text-[10px] font-bold">Neural Financial Architecture</span>
              <h1 className="text-6xl md:text-9xl font-black tracking-[-0.05em] leading-[0.9] text-on-surface">
                Master Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-secondary">Financial Behavior</span>
              </h1>
            </div>
            <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl font-light leading-relaxed">
              A forensic intelligence engine that decodes spending patterns into neural archetypes. Go beyond tracking—understand the pulse of your capital.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={() => navigate('/analyze')}
                className="px-10 py-5 bg-primary-container text-on-primary-fixed font-black rounded-full text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform"
              >
                Analyze My Spending
              </button>
              <button className="px-10 py-5 border border-outline-variant/30 backdrop-blur-xl text-primary font-bold rounded-full text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors">
                Explore Protocols
              </button>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[3px] text-on-surface-variant/40">Scroll to Decrypt</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary-container to-transparent"></div>
          </motion.div>
        </section>

        {/* Bento Grid Analysis Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 glass-panel rounded-3xl p-10 flex flex-col justify-between h-[500px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-full h-full opacity-20 group-hover:opacity-40 transition-opacity">
                <img className="w-full h-full object-cover grayscale" alt="Neural abstract" src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop"/>
              </div>
              <div className="relative z-10 space-y-4">
                <h2 className="text-4xl font-black text-primary tracking-tight">Forensic Intelligence</h2>
                <p className="max-w-md text-on-surface-variant">Real-time behavior mapping. Our engine detects spending anomalies before they become habits.</p>
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div className="text-6xl font-black tracking-tighter text-on-surface">98.4%</div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase tracking-widest text-primary">Accuracy Rating</span>
                  <span className="text-xs text-on-surface-variant">V.4.2 Neural Core</span>
                </div>
              </div>
            </motion.div>

            {/* Secondary Small Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 bg-surface-container-low rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-secondary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-4xl">security</span>
              </div>
              <h3 className="text-xl font-bold">Secure Protocols</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">End-to-end encrypted forensic data handling. Your behavior is yours alone.</p>
            </motion.div>

            {/* Personalities Section Title */}
            <div className="md:col-span-12 pt-20 pb-10">
              <h3 className="text-4xl text-primary font-black tracking-[-0.04em]">Neural Archetypes</h3>
              <p className="text-on-surface-variant mt-2">How the machine perceives your financial intent.</p>
            </div>

            {/* Archetypes */}
            {[
              { type: "Strategic", icon: "polyline", title: "The Architect", desc: "Precise, calculated movements with high long-term retention potential.", color: "primary-container", bg: "primary-container/10", border: "primary-container/20", risk: "Minimal" },
              { type: "Fluid", icon: "waves", title: "The Explorer", desc: "Spontaneous capital allocation in lifestyle and high-growth sectors.", color: "secondary", bg: "secondary/10", border: "secondary/20", risk: "Moderate" },
              { type: "Aggressive", icon: "bolt", title: "The Catalyst", desc: "High-velocity transactions with concentrated exposure and volatility.", color: "error", bg: "error-container/10", border: "error-container/20", risk: "Elevated" },
            ].map((arch, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className={`md:col-span-4 glass-panel rounded-3xl p-8 space-y-8 hover:scale-[1.02] transition-transform cursor-pointer border-${arch.border}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 bg-${arch.bg} border border-${arch.border} text-${arch.color} text-[10px] font-bold uppercase tracking-widest rounded-full`}>{arch.type}</span>
                  <span className={`material-symbols-outlined text-${arch.color}`}>{arch.icon}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black">{arch.title}</h4>
                  <p className="text-sm text-on-surface-variant">{arch.desc}</p>
                </div>
                <div className="pt-4 border-t border-outline-variant/15 flex justify-between items-center">
                  <span className="text-[10px] text-on-surface-variant uppercase">Risk Level</span>
                  <span className={`text-${arch.color} font-bold`}>{arch.risk}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Data Visualization Showcase */}
        <section className="py-32 bg-surface-container-low/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-5xl font-black leading-tight">Pulse Mapping <br/>Technology</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Our signature "Pulse" interface visualizes your spending as a living organism. Watch as your financial health expands and contracts in real-time response to every transaction.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  <span className="text-sm font-medium">Latent pattern detection</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="text-sm font-medium">Predictive behavioral modeling</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span>
                  <span className="text-sm font-medium">Asymmetric risk notifications</span>
                </li>
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative glass-panel rounded-[2rem] p-4 aspect-square overflow-hidden shadow-[0_0_100px_rgba(0,240,255,0.1)]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                 {/* Visual proxy since the original img was a generic blob */}
                 <div className="w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>
                 <div className="w-48 h-48 rounded-full bg-secondary/30 blur-2xl absolute animate-ping"></div>
              </div>
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-surface/60 backdrop-blur-md rounded-2xl border border-outline-variant/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest font-bold text-primary">Neural Activity</span>
                  <span className="text-xs text-on-surface-variant">Live Uplink...</span>
                </div>
                <div className="mt-4 flex gap-1 h-12 items-end">
                  {[40, 60, 90, 30, 50, 80, 70, 100].map((h, i) => (
                    <motion.div 
                      key={i} 
                      className="w-full bg-primary-container" 
                      animate={{ height: [`${h}%`, `${Math.max(10, h - 20)}%`, `${h}%`] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-40 relative px-6 text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-container/5 blur-[120px] rounded-full"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-10 max-w-3xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Ready to enter the <span className="text-primary italic">Archive?</span></h2>
            <p className="text-on-surface-variant text-xl">The first 1,000 users receive the "Genesis" forensic kit and lifetime behavior mapping.</p>
            <div className="pt-6">
              <button onClick={() => navigate('/analyze')} className="group relative inline-flex items-center justify-center">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-container to-secondary rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative px-12 py-6 bg-surface-container-highest rounded-full text-on-surface font-black uppercase tracking-[0.2em] text-sm leading-none flex items-center transition duration-200">
                  Begin Decryption
                  <span className="material-symbols-outlined ml-3 text-primary">terminal</span>
                </div>
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="w-full py-12 border-t border-[#3B494B]/15 bg-[#131313]">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
          <div className="font-['Inter'] text-[10px] uppercase tracking-[1px] font-medium text-[#B9CACB]">
            © 2024 Neural Archive Systems. Forensic Intelligence.
          </div>
          <div className="flex gap-8 font-['Inter'] text-[10px] uppercase tracking-[1px] font-medium text-[#B9CACB]">
            <a className="hover:text-[#00F0FF] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Privacy</a>
            <a className="hover:text-[#00F0FF] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Protocols</a>
            <a className="hover:text-[#00F0FF] transition-colors duration-200 opacity-80 hover:opacity-100" href="#">Terminal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
