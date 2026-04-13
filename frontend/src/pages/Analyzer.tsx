import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell, Legend, LineChart, Line, CartesianGrid } from 'recharts';

const PIE_COLORS = ['#00F0FF', '#7000FF', '#e9ddff', '#849495', '#131313'];

export default function Analyzer() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pulse' | 'sync'>('pulse');

  // Pulse Tab State
  const [pulseData, setPulseData] = useState({ income: '5000', expense: '250', category: 'food', day: '15' });
  const [pulseLoading, setPulseLoading] = useState(false);
  const [pulseResult, setPulseResult] = useState<any>(null);

  // Sync Tab State
  const [syncStatus, setSyncStatus] = useState<'idle' | 'connecting' | 'extracting' | 'complete'>('idle');
  const [provider, setProvider] = useState<'Paytm' | 'PhonePe' | null>(null);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [vampires, setVampires] = useState<any[]>([]);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: 'ai', content: 'Neural core online. How can I assist you with your capital deployment today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handlePulseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPulseLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', pulseData);
      setPulseResult(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to reach neural core.');
    } finally {
      setPulseLoading(false);
    }
  };

  const handleSyncConnect = async (selectedProvider: 'Paytm' | 'PhonePe') => {
    setProvider(selectedProvider);
    setSyncStatus('connecting');
    try {
      const connRes = await axios.post('http://127.0.0.1:8000/connect_account', { provider: selectedProvider });
      setSyncStatus('extracting');
      
      const histRes = await axios.post('http://127.0.0.1:8000/analyze_history', { 
        income: 8000, 
        token: connRes.data.token 
      });
      
      setSyncResult(histRes.data);
      setVampires(histRes.data.vampires);

      // Fetch Forecast Data
      const foreRes = await axios.post('http://127.0.0.1:8000/forecast', {
        income: 8000,
        savings_rate: histRes.data.insights.savings_number
      });
      setForecastData(foreRes.data.forecast);
      
      setSyncStatus('complete');
    } catch (error) {
      console.error(error);
      alert('Integration handshake failed.');
      setSyncStatus('idle');
    }
  };

  const severVampire = (id: string) => {
    setVampires(vampires.map(v => v.id === id ? { ...v, status: 'severed' } : v));
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/chat', { message: userMessage });
      setChatMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', content: 'Connection to core failed. Try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-on-surface overflow-x-hidden relative pb-20">
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>
      
      <header className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="material-symbols-outlined text-primary hover:text-white transition-colors">
            arrow_back
          </button>
          <span className="text-xl font-black tracking-tighter text-primary">Memex Archives</span>
        </div>
        
        <div className="flex gap-2 bg-surface-container-high p-1 rounded-lg border border-outline-variant/20">
          <button 
            onClick={() => setActiveTab('pulse')}
            className={`px-6 py-2 text-sm font-bold tracking-widest rounded-md uppercase transition-colors ${activeTab === 'pulse' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Quick Pulse
          </button>
          <button 
            onClick={() => setActiveTab('sync')}
            className={`px-6 py-2 text-sm font-bold tracking-widest rounded-md uppercase transition-colors flex items-center gap-2 ${activeTab === 'sync' ? 'bg-secondary/20 text-secondary' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Neural Sync <span className="material-symbols-outlined text-[14px]">cable</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'pulse' ? (
            <motion.div 
              key="pulse"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
            >
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl font-black">Data Injection</h1>
                  <p className="text-on-surface-variant mt-2">Submit single transaction data for immediate neural analysis.</p>
                </div>

                <form onSubmit={handlePulseSubmit} className="glass-panel p-8 rounded-3xl space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-primary font-bold">Monthly Income</label>
                    <input 
                      type="number" required
                      className="w-full bg-transparent border-b border-outline-variant/30 text-2xl py-2 focus:outline-none focus:border-primary transition-colors font-light"
                      value={pulseData.income} onChange={e => setPulseData({...pulseData, income: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-secondary font-bold">Transaction Amount</label>
                    <input 
                      type="number" required
                      className="w-full bg-transparent border-b border-outline-variant/30 text-2xl py-2 focus:outline-none focus:border-secondary transition-colors font-light"
                      value={pulseData.expense} onChange={e => setPulseData({...pulseData, expense: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Category</label>
                      <select 
                        className="w-full bg-surface-container border-b border-outline-variant/30 text-lg py-2 focus:outline-none focus:border-primary text-on-surface"
                        value={pulseData.category} onChange={e => setPulseData({...pulseData, category: e.target.value})}
                      >
                        <option value="food">Food</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="bills">Bills</option>
                        <option value="shopping">Shopping</option>
                        <option value="transport">Transport</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Day</label>
                      <input 
                        type="number" min="1" max="31" required
                        className="w-full bg-transparent border-b border-outline-variant/30 text-lg py-2 focus:outline-none focus:border-primary transition-colors"
                        value={pulseData.day} onChange={e => setPulseData({...pulseData, day: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={pulseLoading}
                    className="w-full py-4 mt-6 bg-primary-container text-on-primary-fixed font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2"
                  >
                    {pulseLoading ? 'Decrypting...' : 'Initiate Scan'}
                    <span className="material-symbols-outlined">{pulseLoading ? 'sync' : 'fingerprint'}</span>
                  </button>
                </form>
              </div>

              <div className="flex flex-col justify-center">
                {pulseResult ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className={`glass-panel p-10 rounded-3xl space-y-8 border ${pulseResult.risk === 'risky' ? 'border-error/30' : 'border-primary/30'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm uppercase tracking-widest text-on-surface-variant">Behavior Profile</h3>
                        <h2 className="text-4xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{pulseResult.personality}</h2>
                      </div>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${pulseResult.risk === 'risky' ? 'border-error/20 bg-error/10 text-error' : 'border-primary/20 bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-3xl">{pulseResult.risk === 'risky' ? 'warning' : 'verified_user'}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">Neural Health Score</span>
                      <div className="flex items-end gap-4">
                        <div className="text-6xl font-black">{pulseResult.health_score}</div>
                        <div className="text-primary mb-2">/ 100</div>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mt-2">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: pulseResult.health_score }} transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full ${pulseResult.risk === 'risky' ? 'bg-error' : 'bg-primary'}`} 
                        />
                      </div>
                    </div>

                    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant block mb-2">Engine Insight</span>
                      <p className="font-medium text-lg">{pulseResult.message}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center p-12 glass-panel rounded-3xl opacity-50 border-dashed border-2 border-outline-variant/20">
                    <div className="text-center space-y-4">
                      <span className="material-symbols-outlined text-6xl text-outline-variant">radar</span>
                      <p className="text-on-surface-variant font-medium">Awaiting parameters...</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="sync"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {syncStatus === 'idle' && (
                <div className="max-w-2xl mx-auto text-center space-y-10">
                  <div>
                    <h1 className="text-5xl font-black mb-4">Neural Sync</h1>
                    <p className="text-xl text-on-surface-variant font-light">Connect your primary capital streams. We'll securely extract and decrypt 6 months of historical behavior.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <button onClick={() => handleSyncConnect('Paytm')} className="glass-panel p-8 rounded-3xl border-outline-variant/20 hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col items-center gap-4">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span className="font-bold tracking-widest uppercase text-sm">Sync Paytm</span>
                    </button>
                    <button onClick={() => handleSyncConnect('PhonePe')} className="glass-panel p-8 rounded-3xl border-outline-variant/20 hover:border-secondary/50 hover:bg-secondary/5 transition-all group flex flex-col items-center gap-4">
                      <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="w-24 h-16 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                      <span className="font-bold tracking-widest uppercase text-sm">Sync PhonePe</span>
                    </button>
                  </div>
                </div>
              )}

              {(syncStatus === 'connecting' || syncStatus === 'extracting') && (
                <div className="max-w-md mx-auto mt-20 text-center space-y-8 glass-panel p-12 rounded-[2rem]">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 border-4 border-outline-variant/20 border-t-primary border-r-secondary rounded-full mx-auto" />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      {syncStatus === 'connecting' ? `Establishing uplink with ${provider}...` : 'Decrypting 6-month ledger...'}
                    </h2>
                    <p className="text-on-surface-variant text-sm font-mono opacity-60">
                      {syncStatus === 'connecting' ? '0x992B... AWAITING HANDSHAKE' : 'EXTRACTING BEHAVIORAL NODES [||||||||||  ] 84%'}
                    </p>
                  </div>
                </div>
              )}

              {syncStatus === 'complete' && syncResult && (
                <div className="space-y-12">
                  <div className="flex justify-between items-end border-b border-outline-variant/20 pb-6">
                    <div>
                      <span className="text-primary text-[10px] tracking-[0.3em] font-bold uppercase block mb-2">Deep Archive Authorized</span>
                      <h2 className="text-4xl font-black text-on-surface">Memex V3 Dashboard</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-on-surface-variant text-xs uppercase tracking-widest">Source</span>
                      <div className="font-bold text-lg">{provider} Ledger</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Archetype Card */}
                    <div className="glass-panel p-8 rounded-3xl border-primary/20 bg-primary/5 flex flex-col justify-between md:col-span-1">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-primary font-bold">Identified Archetype</span>
                        <h3 className="text-3xl font-black mt-2 leading-tight">{syncResult.insights.archetype}</h3>
                      </div>
                      <div className="mt-8">
                        <span className="text-xs text-on-surface-variant uppercase tracking-widest">Savings Retention</span>
                        <div className="text-5xl font-black text-primary mt-1">{syncResult.insights.savings_rate}</div>
                      </div>
                    </div>

                    {/* Bar Chart Card */}
                    <div className="md:col-span-2 glass-panel p-8 rounded-3xl h-80">
                      <div className="flex justify-between mb-4">
                        <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Capital Outflow Trend</span>
                        <span className="text-xs uppercase tracking-widest text-secondary font-bold">Volatile Risk: {syncResult.insights.risk_level}</span>
                      </div>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={syncResult.trend_data}>
                          <XAxis dataKey="name" stroke="#849495" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#849495" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                          <RechartsTooltip cursor={{ fill: 'rgba(53, 53, 52, 0.4)' }} contentStyle={{ backgroundColor: '#131313', border: '1px solid #3b494b', borderRadius: '8px' }} />
                          <Bar dataKey="expenses" radius={[4, 4, 0, 0]}>
                            {syncResult.trend_data.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={index === syncResult.trend_data.length - 1 ? '#00F0FF' : '#7000FF'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart Card */}
                    <div className="md:col-span-1 glass-panel p-8 rounded-3xl h-80 flex flex-col">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-4">Breakdown</span>
                      <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={syncResult.category_data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                              {syncResult.category_data.map((entry: any, index: number) => (
                                <PieCell key={`pie-cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip contentStyle={{ backgroundColor: '#131313', border: '1px solid #3b494b', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Predictive Forecasting Line Chart */}
                    <div className="glass-panel p-8 rounded-3xl">
                      <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">trending_up</span> 5-Year Predictive Forecast
                      </h3>
                      <p className="text-sm text-on-surface-variant mb-6">Status Quo (Red) vs Memex Optimized Strategy (Cyan)</p>
                      
                      <div className="h-64">
                        {forecastData && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={forecastData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#3b494b" vertical={false} />
                              <XAxis dataKey="year" stroke="#849495" fontSize={10} axisLine={false} tickLine={false} />
                              <YAxis stroke="#849495" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                              <RechartsTooltip contentStyle={{ backgroundColor: '#131313', border: '1px solid #3b494b', borderRadius: '8px' }} />
                              <Legend iconType="plainline" wrapperStyle={{ fontSize: '12px' }} />
                              <Line type="monotone" dataKey="status_quo" name="Current Trajectory" stroke="#FF4081" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                              <Line type="monotone" dataKey="optimized" name="Optimized Trajectory" stroke="#00F0FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* Vampire Radar */}
                    <div className="glass-panel p-8 rounded-3xl">
                      <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-error">radar</span> Vampire Expense Radar
                      </h3>
                      <p className="text-sm text-on-surface-variant mb-6">Unnecessary recurring outflows draining your liquidity.</p>
                      
                      <div className="space-y-4">
                        <AnimatePresence>
                          {vampires.map((vamp) => (
                            <motion.div 
                              key={vamp.id}
                              initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                              transition={{ duration: 0.5 }}
                              className="bg-surface-container-high p-4 rounded-2xl flex justify-between items-center border border-outline-variant/20"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center border border-error/20">
                                  <span className="material-symbols-outlined text-sm">subscriptions</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm">{vamp.name}</h4>
                                  <span className="text-xs text-on-surface-variant uppercase tracking-widest">{vamp.category}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className="font-mono text-lg font-bold">${vamp.amount}</span>
                                {vamp.status === 'active' ? (
                                  <button onClick={() => severVampire(vamp.id)} className="bg-error/20 hover:bg-error text-error hover:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                                    Sever <span className="material-symbols-outlined text-[14px]">link_off</span>
                                  </button>
                                ) : (
                                  <span className="text-xs font-bold text-outline-variant uppercase tracking-widest px-4 py-2">Severed</span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {vampires.every(v => v.status === 'severed') && (
                          <div className="text-center py-6 text-primary font-bold animate-pulse">
                            All vampires severed. Liquidity secured.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <div className="text-center pt-8">
                     <button onClick={() => setSyncStatus('idle')} className="text-on-surface-variant text-sm uppercase tracking-widest hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                       Sever Connection & Reset
                     </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating AI Co-Pilot */}
      {syncStatus === 'complete' && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="mb-4 w-96 h-[500px] glass-panel border border-primary/30 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-primary/20 bg-background/90 backdrop-blur-3xl"
              >
                <div className="bg-primary/10 p-4 border-b border-primary/20 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="font-bold text-sm tracking-widest uppercase">Memex Co-Pilot</span>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors">close</button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-on-primary font-medium rounded-tr-none' : 'bg-surface-container border border-outline-variant/30 text-on-surface rounded-tl-none font-light'}`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">{msg.role === 'ai' ? 'Memex Core' : 'You'}</span>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex items-start">
                      <div className="bg-surface-container border border-outline-variant/30 p-3 rounded-2xl rounded-tl-none flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex gap-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Ask about your capital..."
                    className="flex-grow bg-transparent text-sm focus:outline-none px-3 font-light"
                    disabled={isChatLoading}
                  />
                  <button 
                    type="submit" 
                    disabled={isChatLoading || !chatInput.trim()}
                    className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all border border-white/10 ${isChatOpen ? 'bg-surface-container text-white' : 'bg-primary text-background hover:scale-110 shadow-primary/30'}`}
          >
            <span className="material-symbols-outlined text-3xl">{isChatOpen ? 'keyboard_arrow_down' : 'smart_toy'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
