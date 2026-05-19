/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  BarChart3, 
  MessageSquare, 
  ChevronRight, 
  Search, 
  User, 
  Calendar, 
  Home, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Send,
  Loader2,
  Menu,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { mockProperties, Property, generalGuidance, mockReservations, Reservation } from './data/mockData';
import { chatWithAI, analyzePerformance, Message } from './services/gemini';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'properties' | 'analytics' | 'support' | 'messages';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-brand-surface)]">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(t) => { setActiveTab(t); setSelectedProperty(null); }} 
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-6 lg:p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardView 
              key="dashboard" 
              properties={mockProperties} 
              onSelectProperty={(p) => { setSelectedProperty(p); setActiveTab('properties'); }}
            />
          )}
          {activeTab === 'properties' && (
            <PropertiesView 
              key="properties" 
              properties={mockProperties}
              selectedProperty={selectedProperty}
              onSelectProperty={setSelectedProperty}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsView 
              key="analytics" 
              properties={mockProperties} 
            />
          )}
          {activeTab === 'support' && (
            <SupportView 
              key="support" 
              properties={mockProperties}
            />
          )}
          {activeTab === 'messages' && (
            <MessagingView 
              key="messages" 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, isOpen, toggle }: { activeTab: Tab, setActiveTab: (t: Tab) => void, isOpen: boolean, toggle: () => void }) {
  const items = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'analytics', label: 'Performance', icon: BarChart3 },
    { id: 'messages', label: 'Guest Messages', icon: MessageSquare },
    { id: 'support', label: 'AI Support', icon: Sparkles },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="bg-white border-r border-black/5 flex flex-col z-50 h-full overflow-hidden"
    >
      <div className="p-6 flex items-center justify-between mb-8">
        <div className={cn("flex items-center gap-2", !isOpen && "hidden")}>
          <div className="w-8 h-8 bg-[var(--color-brand-accent)] rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">Aura</span>
        </div>
        <button onClick={toggle} className="p-1 hover:bg-black/5 rounded-md">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
              activeTab === item.id 
                ? "bg-[var(--color-brand-primary)] text-white shadow-lg" 
                : "text-black/50 hover:text-black hover:bg-black/5"
            )}
          >
            <item.icon size={20} />
            {isOpen && <span className="font-medium">{item.label}</span>}
            {activeTab === item.id && isOpen && (
              <motion.div layoutId="pill" className="ml-auto w-1 h-1 bg-white rounded-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className={cn("p-4 bg-black/5 rounded-2xl", !isOpen && "hidden")}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-black/40 tracking-wider uppercase">System Active</span>
          </div>
          <p className="text-[10px] text-black/60 leading-tight">AI Agent connected to 4 properties and live reservations.</p>
        </div>
      </div>
    </motion.aside>
  );
}

function DashboardView({ properties, onSelectProperty }: { properties: Property[], onSelectProperty: (p: Property) => void }) {
  const upcoming = mockReservations.filter(r => r.status === 'arriving' || r.status === 'staying');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-5xl font-bold mb-2 tracking-tight">Portfolio Overview</h1>
          <p className="text-black/50 max-w-md">Managing 112 properties across 4 regions.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-black/10 flex items-center justify-center text-[10px] font-bold">
                {i}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-[var(--color-brand-accent)] flex items-center justify-center text-[10px] font-bold text-white">
              +109
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Portfolio Rev" value="$842k" change="+14%" icon={TrendingUp} trend="up" />
        <StatCard title="Next Week" value="42 Arrivals" change="+8" icon={Calendar} trend="up" />
        <StatCard title="Active Chats" value="12" change="-2" icon={MessageSquare} trend="down" />
        <StatCard title="AI Resolution" value="92%" change="+5%" icon={Sparkles} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Properties */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl font-bold">Priority Units</h2>
              <button className="text-[var(--color-brand-accent)] font-semibold flex items-center gap-1 group">
                All 112 properties <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-4">
              {properties.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => onSelectProperty(p)}
                  className="group cursor-pointer bg-white p-4 rounded-3xl flex items-center gap-6 border border-black/5 hover:border-black/10 transition-all hover:shadow-xl hover:shadow-black/5"
                >
                  <img src={p.imageUrl} className="w-24 h-24 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold">{p.name}</h3>
                    <p className="text-black/40 text-xs">{p.address}</p>
                  </div>
                  <div className="text-right px-6">
                    <p className="text-lg font-bold text-[var(--color-brand-accent)]">${p.historicalData[p.historicalData.length-1].revenue.toLocaleString()}</p>
                    <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest">Monthly Rev</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Arrivals */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-black/5">
            <h3 className="font-serif text-2xl font-bold mb-6">Upcoming Week</h3>
            <div className="space-y-6">
              {upcoming.map(res => (
                <div key={res.id} className="relative pl-6 border-l-2 border-black/5 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[var(--color-brand-accent)]" />
                  <p className="text-xs font-bold text-black/30 uppercase tracking-widest mb-1">
                    {new Date(res.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <h4 className="font-bold text-black/80">{res.guestName}</h4>
                  <p className="text-[10px] text-black/50">{res.propertyName}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-black/5 rounded text-[8px] font-bold uppercase tracking-tighter">
                      {res.status}
                    </span>
                    <span className="text-[8px] text-black/40 font-bold">{res.guests} Guests</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 border border-black/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5">
              View Full Calendar
            </button>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function PropertiesView({ properties, selectedProperty, onSelectProperty }: { properties: Property[], selectedProperty: Property | null, onSelectProperty: (p: Property) => void }) {
  if (!selectedProperty) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8 italic">Property Portfolio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div 
              key={p.id} 
              onClick={() => onSelectProperty(p)}
              className="bg-white p-6 rounded-3xl border border-black/5 hover:shadow-xl transition-all cursor-pointer"
            >
              <img src={p.imageUrl} className="w-full h-48 object-cover rounded-2xl mb-4" />
              <h3 className="font-serif text-xl font-bold">{p.name}</h3>
              <p className="text-sm text-black/50 mb-4">{p.address}</p>
              <button className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-accent)]">
                Manage Insights <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <PropertyDetailView property={selectedProperty} onBack={() => onSelectProperty(null!)} />;
}

function PropertyDetailView({ property, onBack }: { property: Property, onBack: () => void }) {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    const result = await analyzePerformance(property);
    setInsights(result);
    setLoading(false);
  };

  const [showQuoteSimulator, setShowQuoteSimulator] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-5xl mx-auto pb-20"
    >
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-black/50 font-medium hover:text-black">
        <ArrowRight size={16} className="rotate-180" /> Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video rounded-[40px] overflow-hidden shadow-2xl shadow-black/10">
            <img src={property.imageUrl} className="w-full h-full object-cover" />
          </div>
          
          <section>
            <h1 className="font-serif text-5xl font-bold mb-4">{property.name}</h1>
            <p className="text-lg text-black/60 leading-relaxed mb-8">{property.description}</p>
            
            <div className="grid grid-cols-2 gap-8 py-8 border-y border-black/5">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-widest text-black/40 mb-4">Bed Information</h4>
                <p className="font-medium text-black/80">{property.bedInformation}</p>
              </div>
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-widest text-black/40 mb-4">Location</h4>
                <p className="font-medium text-black/80">{property.locationInfo}</p>
              </div>
            </div>
          </section>

          <AnimatePresence>
            {showQuoteSimulator && (
              <motion.section 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <QuoteSimulator property={property} onClose={() => setShowQuoteSimulator(false)} />
              </motion.section>
            )}
          </AnimatePresence>

          <section>
            <h3 className="font-serif text-2xl font-bold mb-6">Amenity Highlights</h3>
            <div className="flex flex-wrap gap-3">
              {property.amenities.map(a => (
                <span key={a} className="px-4 py-2 bg-white border border-black/5 rounded-full text-sm font-medium">
                  {a}
                </span>
              ))}
            </div>
          </section>
          
          <section>
            <h3 className="font-serif text-2xl font-bold mb-6">Revenue Trend</h3>
            <div className="h-[300px] w-full bg-white p-6 rounded-[32px] border border-black/5 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={property.historicalData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-brand-accent)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Column - AI Insights & Tools */}
        <div className="space-y-6">
          <div className="p-8 bg-[var(--color-brand-primary)] text-white rounded-[40px] sticky top-10">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-[var(--color-brand-accent)]" />
              <h3 className="text-xl font-serif font-bold">Property Intel</h3>
            </div>
            
            <p className="text-white/60 text-sm mb-6">AI models are ready to analyze this property against neighborhood trends and historical booking patterns.</p>
            
            {insights ? (
              <div className="text-white/80 space-y-4">
                <div className="markdown-body text-sm leading-relaxed">
                  <Markdown>{insights}</Markdown>
                </div>
                <button 
                  onClick={() => setInsights('')}
                  className="w-full py-4 border border-white/20 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  Regenerate Analysis
                </button>
              </div>
            ) : (
              <button 
                onClick={generateInsights}
                disabled={loading}
                className="w-full py-4 bg-[var(--color-brand-accent)] rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Analyze Performance'}
              </button>
            )}

            <div className="mt-10 pt-10 border-t border-white/10 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Quick Actions</h4>
              <button 
                onClick={() => setShowQuoteSimulator(true)}
                className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-sm flex items-center justify-between group"
              >
                Generate Booking Quote <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full text-left p-3 hover:bg-white/5 rounded-xl text-sm flex items-center justify-between group">
                 Update Maintenance Log <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function QuoteSimulator({ property, onClose }: { property: Property, onClose: () => void }) {
  const [nights, setNights] = useState(3);
  const [season, setSeason] = useState<'peak' | 'off-peak'>('off-peak');
  const [aiQuote, setAiQuote] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getQuote = async () => {
    setLoading(true);
    const context = `
      Property: ${property.name}
      Base Price: ${property.pricePerNight}
      Historical Data (Current and YoY): ${JSON.stringify(property.historicalData)}
      Requested Nights: ${nights}
      Season: ${season}
    `;
    const prompt = `You are a revenue manager. Analyze current vs last year's performance for this property. Suggest a custom quote for a ${nights} night stay during ${season}. Include a "YoY Comparison" section in your markdown response explaining why this price is optimized compared to last year's performance.`;
    
    // We reuse chat logic but more specific
    const result = await chatWithAI([{ role: 'user', text: prompt }], context);
    setAiQuote(result);
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border-2 border-[var(--color-brand-accent)] shadow-xl mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-2xl font-bold">AI Quote Generator</h3>
        <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X size={20} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Number of Nights</label>
          <input type="number" value={nights} onChange={(e) => setNights(Number(e.target.value))} className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)]" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">Season</label>
          <select value={season} onChange={(e) => setSeason(e.target.value as any)} className="w-full p-4 bg-black/5 rounded-2xl outline-none focus:ring-2 focus:ring-[var(--color-brand-accent)]">
            <option value="off-peak">Off-Peak (Winter/Fall)</option>
            <option value="peak">Peak (Summer/Spring)</option>
          </select>
        </div>
      </div>

      {aiQuote ? (
        <div className="p-6 bg-green-50 rounded-2xl border border-green-100 mb-6">
          <div className="flex items-center gap-2 mb-3 text-green-700">
            <TrendingUp size={16} />
            <span className="font-bold text-sm uppercase tracking-widest">AI Recommendation</span>
          </div>
          <div className="markdown-body text-green-900">
            <Markdown>{aiQuote}</Markdown>
          </div>
          <button onClick={() => setAiQuote('')} className="mt-4 text-xs font-bold text-green-700 underline">Reset Quote</button>
        </div>
      ) : (
        <button 
          onClick={getQuote}
          disabled={loading}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-black/80 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Calculate AI Quote</>}
        </button>
      )}
    </div>
  );
}

function AnalyticsView({ properties }: { properties: Property[] }) {
  const combinedData = properties[0].historicalData.map((d, i) => ({
    month: d.month,
    almostHeaven: d.revenue,
    oceanBreeze: properties[1].historicalData[i].revenue,
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto space-y-10"
    >
      <header>
        <h1 className="font-serif text-5xl font-bold mb-4">Portfolio Analytics</h1>
        <p className="text-black/50">Comparative performance across all managed luxury units.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-white">
        <div className="p-10 bg-black rounded-[40px] space-y-6">
          <h3 className="font-serif text-3xl">Revenue Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="almostHeaven" stroke="var(--color-brand-accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="oceanBreeze" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--color-brand-accent)]" />
              <span className="text-xs text-white/60">Almost Heaven</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
              <span className="text-xs text-white/60">Ocean Breeze</span>
            </div>
          </div>
        </div>

        <div className="p-10 bg-[var(--color-brand-accent)] rounded-[40px] flex flex-col justify-between">
           <h3 className="font-serif text-3xl text-white">Occupancy Leader</h3>
           <div className="py-10">
              <span className="text-9xl font-serif font-bold italic tracking-tighter">98%</span>
              <p className="text-xl font-medium mt-4 text-white/80">Almost Heaven Beach House reached peak capacity in June.</p>
           </div>
           <button className="w-full py-4 bg-black/10 backdrop-blur-sm border border-white/20 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-colors">
              Download Full Report
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function SupportView({ properties }: { properties: Property[] }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome! I am Aura, your AI Guest Service Liaison. I have access to all property details and internal guidelines. How can I help you assist a guest today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const newMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const context = `
      PROPERTIES MANAGED:
      ${properties.map(p => `
        NAME: ${p.name}
        ADDRESS: ${p.address}
        DESCRIPTION: ${p.description}
        AMENITIES: ${p.amenities.join(', ')}
        RULES: ${p.rules.join(', ')}
        BEDS: ${p.bedInformation}
      `).join('\n')}
      
      INTERNAL GUIDANCE:
      ${generalGuidance}
    `;

    const aiResponse = await chatWithAI(newMessages, context);
    setMessages([...newMessages, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col"
    >
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-5xl font-bold mb-2">Support Liaison</h1>
          <p className="text-black/50">AI Agent trained on your property data & internal docs.</p>
        </div>
        <div className="flex -space-x-4">
          {properties.map(p => (
            <div key={p.id} className="w-12 h-12 rounded-full border-4 border-[var(--color-brand-surface)] overflow-hidden">
              <img src={p.imageUrl} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-4 mb-6 space-y-6 custom-scrollbar" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
            <div className={cn(
              "max-w-[80%] px-6 py-4 rounded-3xl",
              m.role === 'user' 
                ? "bg-[var(--color-brand-primary)] text-white" 
                : "bg-white border border-black/5 shadow-sm"
            )}>
              <div className="markdown-body">
                <Markdown>{m.text}</Markdown>
              </div>
              <span className="text-[10px] opacity-40 mt-2 block uppercase tracking-widest font-bold">
                {m.role === 'user' ? 'Message Sent' : 'Aura AI'}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-black/5 px-6 py-4 rounded-3xl animate-pulse flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4 text-black/40" />
              <span className="text-sm font-medium text-black/40 italic">Aura is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Aura about properties, rules, or guest policies..."
          className="w-full bg-white border border-black/5 px-8 py-6 rounded-[32px] shadow-xl shadow-black/5 focus:outline-none focus:ring-2 focus:ring-black/5 pr-20 text-lg"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[var(--color-brand-accent)] p-4 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <Send size={24} />
        </button>
      </div>
    </motion.div>
  );
}

function MessagingView() {
  const chats = [
    { id: 1, guest: 'Sarah Jenkins', property: 'Almost Heaven', message: 'Hi! Can we check in 2 hours early?', time: '2m ago', unread: true },
    { id: 2, guest: 'Mike Ross', property: 'Ocean Breeze', message: 'The AC is making a humming noise.', time: '15m ago', unread: true },
    { id: 3, guest: 'David Miller', property: 'Ocean Breeze', message: 'Great stay, thank you!', time: '2h ago', unread: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto h-[calc(100vh-80px)] flex gap-8"
    >
      <div className="w-80 flex flex-col gap-6">
        <h1 className="font-serif text-4xl font-bold">Guest Center</h1>
        <div className="flex-1 bg-white rounded-[32px] border border-black/5 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-black/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20 w-4 h-4" />
              <input placeholder="Search chats..." className="w-full bg-black/5 border-none rounded-xl py-2 pl-10 text-sm focus:ring-0" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <div key={chat.id} className={cn("p-6 border-b border-black/5 cursor-pointer hover:bg-black/5 transition-colors relative", chat.unread && "bg-blue-50/50")}>
                {chat.unread && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm">{chat.guest}</h4>
                  <span className="text-[10px] text-black/30 font-medium">{chat.time}</span>
                </div>
                <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest mb-2">{chat.property}</p>
                <p className="text-xs text-black/60 line-clamp-1">{chat.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[40px] border border-black/5 flex flex-col overflow-hidden shadow-2xl shadow-black/5">
        <div className="p-8 border-b border-black/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center font-bold text-lg">SJ</div>
            <div>
              <h3 className="font-bold text-xl">Sarah Jenkins</h3>
              <p className="text-sm text-black/40">Almost Heaven Beach House • Arriving Tomorrow</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-black/5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black/5">Guest Info</button>
            <button className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">Escalate</button>
          </div>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-black/5 p-4 rounded-2xl rounded-tl-none">
              <p className="text-sm">Hi! We are so excited for our stay tomorrow. Just wondering if we can check in 2 hours early? We are traveling with kids.</p>
              <span className="text-[10px] text-black/30 mt-2 block">2:14 PM</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-[var(--color-brand-primary)] text-white p-4 rounded-2xl rounded-tr-none">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-[var(--color-brand-accent)] uppercase tracking-widest">
                <Sparkles size={12} /> AI Draft Suggested
              </div>
              <p className="text-sm">Hi Sarah! We would love to accommodate an early check-in. According to our current logs, the house is being cleaned tomorrow morning. I'll check with the crew and let you know by 4 PM today if we can get you in early!</p>
              <span className="text-[10px] text-white/30 mt-2 block">2:15 PM</span>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-black/5 bg-black/5">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input placeholder="Type a message..." className="w-full bg-white border border-black/5 rounded-2xl p-4 focus:outline-none pr-12" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[var(--color-brand-accent)] rounded-xl text-white">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
function StatCard({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: any, trend: 'up' | 'down' }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm group hover:shadow-xl transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-black/5 rounded-2xl group-hover:bg-[var(--color-brand-accent)] group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <div className={cn("px-3 py-1 rounded-full text-xs font-bold", trend === 'up' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
          {change}
        </div>
      </div>
      <h4 className="text-black/40 font-semibold text-xs uppercase tracking-[0.2em] mb-2">{title}</h4>
      <p className="text-4xl font-serif font-bold tracking-tight">{value}</p>
    </div>
  );
}

function PropertyQuickStat({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <h5 className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{label}</h5>
      <p className="font-semibold text-black/80">{value}</p>
    </div>
  );
}

