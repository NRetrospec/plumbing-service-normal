"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PhoneCall, Calendar, ShieldCheck, Sparkles, Star, Users, MapPin, 
  Search, CheckCircle2, ChevronRight, MessageSquare, Flame, 
  Wrench, Activity, AlertTriangle, Play, HelpCircle, FileText, Droplet
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("emergency");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServiceForDemos, setSelectedServiceForDemos] = useState<string | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "Welcome to FlowMaster! 💧 I am your AI Plumbing Assistant. I can analyze issues, calculate preliminary estimate ranges, or assist with booking. How can I help you today?" }
  ]);
  const [chatInput, setChatbotInput] = useState("");
  const [liveStats, setLiveStats] = useState({
    activeTechs: 4,
    dispatchedJobs: 18,
    avgResponseTime: "24 min",
    emergencyQueue: 0
  });

  // Load backend stats if available or stick to realistic real-time simulation
  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setLiveStats(prev => ({
            ...prev,
            activeTechs: data.stats.technicianCount || 4,
            emergencyQueue: data.stats.pendingJobs || 0
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatbotMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatbotInput("");

    // Simulate AI parsing
    setTimeout(() => {
      let responseText = "I have recorded that. Based on typical cases in our service area, this sounds like a priority issue. I recommend speaking directly with our live dispatch or using the 'Book Service' page to secure a priority technician.";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes("leak") || lower.includes("drip") || lower.includes("water")) {
        responseText = "⚠️ Detected Water Leak issue. Sub-slab leaks or pipe pinholes can cause foundation issues if left alone. I recommend booking an advanced Acoustic Leak Detection appointment. Standard cost is typically $250 - $450 with 100% accurate repair spot validation.";
      } else if (lower.includes("heater") || lower.includes("hot water") || lower.includes("cold")) {
        responseText = "🔥 Hot Water system anomaly. If you have a traditional tank or modern tankless, we can restore flow within 2 hours. A full replacement estimate ranges from $950 for standard tanks up to $2200 for premium tankless setups. Would you like to schedule an inspection?";
      } else if (lower.includes("clog") || lower.includes("drain") || lower.includes("toilet")) {
        responseText = "🚽 Drain blockage detected. For stubborn main lines or toilet backups, our team uses professional snakes ($120-$250) or high-pressure Hydro Jetting ($450) which completely clears root clogs. You can book Dave Mercer or Sarah Stone who are drain specialists.";
      } else if (lower.includes("cost") || lower.includes("price") || lower.includes("quote")) {
        responseText = "💵 Transparency is our policy. Minor repairs start around $95, diagnostic fees are waived if you authorize the repair, and we provide upfront guaranteed quotes before any technician picks up a tool. Use the Book Service tab to generate an instant formal estimate!";
      }

      setChatbotMessages(prev => [...prev, { sender: "bot", text: responseText }]);
    }, 850);
  };

  // 26 Services catalog categorized
  const serviceCategories = {
    emergency: {
      title: "Emergency Response",
      icon: <Flame className="h-5 w-5 text-red-500" />,
      items: [
        { name: "Emergency Plumbing", price: "Diagnostics Included", desc: "Available 24/7/365 with rapid response dispatched within 10 minutes." },
        { name: "Slab Leak Repair", price: "$850 - $1900", desc: "Precision isolation beneath concrete foundation using acoustic trackers." },
        { name: "Gas Line Repair", price: "Custom Quote", desc: "Emergency gas leak tracing, joint sealing, and high-safety certifications." },
        { name: "Sewer Repair", price: "Starting at $1200", desc: "Excavation and trenchless epoxy pipe sleeve restoration." },
        { name: "Pipe Repair", price: "$180 - $450", desc: "Urgent fix for frozen, split, or burst water piping lines." }
      ],
      faq: {
        q: "What constitutes a plumbing emergency?",
        a: "Any situation with active uncontrolled water flooding, raw sewage backup, gas smell, or complete loss of running water to the home."
      },
      beforeAfter: {
        before: "Corroded galvanize fitting spraying water in basement ceiling joists.",
        after: "Clean copper bypass installation with brand-new master shutoff lever."
      }
    },
    drainage: {
      title: "Drain & Sewer",
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      items: [
        { name: "Drain Cleaning", price: "$120 - $280", desc: "Professional snaking and localized grease/gunk extraction." },
        { name: "Hydro Jetting", price: "$450 - $750", desc: "High-pressure 4000 PSI water blasting to obliterate tree roots and severe blockages." },
        { name: "Pipe Replacement", price: "Custom Quote", desc: "Replacing antiquated cast iron with durable PVC sewer stacks." },
        { name: "Sewer Inspections", price: "$150 / Free with job", desc: "High-definition fiber-optic crawler camera analysis with video file share." }
      ],
      faq: {
        q: "Is Hydro Jetting safe for older pipes?",
        a: "Our technicians run a fiber-optic camera inspection first. If your pipes are structurally sound, high-pressure jetting is 100% safe and cleans pipes back to brand-new condition."
      },
      beforeAfter: {
        before: "Root-clogged main sewer tile showing complete raw sewage stagnation.",
        after: "Serrated jetting nozzle completely cleared blockage leaving a pristine white PVC sleeve."
      }
    },
    heaters: {
      title: "Water Heaters",
      icon: <Activity className="h-5 w-5 text-cyan-500" />,
      items: [
        { name: "Water Heater Installation", price: "$950 - $1800", desc: "Standard high-efficiency gas or electric 40/50 gallon tanks." },
        { name: "Water Heater Repair", price: "$150 - $400", desc: "Heating elements, thermocouple replacement, or system descaling." },
        { name: "Tankless Water Heaters", price: "$1800 - $3400", desc: "Unlimited on-demand hot water, saving up to 30% in monthly energy." }
      ],
      faq: {
        q: "How long does a tankless water heater last?",
        a: "Tankless units last over 20 years, nearly double the 10-12 year lifespan of traditional water storage tank heaters."
      },
      beforeAfter: {
        before: "Rusty, leaking 50-gallon metal cylinder tank taking up utility room floor space.",
        after: "Wall-mounted sleek luxury tankless system with copper lines and digital temp control."
      }
    },
    fixtures: {
      title: "Fixtures & General",
      icon: <Wrench className="h-5 w-5 text-slate-500" />,
      items: [
        { name: "Toilet Repair", price: "$95 - $180", desc: "Resolving running issues, silent leaks, and new flush assemblies." },
        { name: "Toilet Installation", price: "$250 + fixture", desc: "Premium comfort-height dual flush systems, sealed flawlessly." },
        { name: "Faucet Installation", price: "$140 + fixture", desc: "Luxury pull-out kitchen sprayers or designer vanity faucets." },
        { name: "Garbage Disposal Repair", price: "$110 - $220", desc: "Unjamming blades, motor reset, or complete unit upgrades." },
        { name: "Re-piping", price: "Custom quote", desc: "Replacing old toxic lead/galvanized pipes with modern color-coded flexible PEX-A." }
      ],
      faq: {
        q: "Do you supply the faucets and toilets or do I?",
        a: "We do both! We stock beautiful Moen, Kohler, and Delta fixtures in our trucks, or we can install any unit you pre-purchased."
      },
      beforeAfter: {
        before: "Wobbly, leaking toilet stained at base causing mild drywall rot.",
        after: "Flawlessly sealed, stable, water-saving high-comfort toilet with new brass shutoff."
      }
    },
    filtration: {
      title: "Water Quality",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      items: [
        { name: "Water Filtration Systems", price: "$850 - $2200", desc: "Multi-stage whole-house active carbon filtration for bottled-quality tap water." },
        { name: "Water Softeners", price: "$1200 - $2400", desc: "Salt-based or advanced salt-free hard water conditioners to stop limescale build-up." },
        { name: "Plumbing Inspections", price: "$99 / Free for VIP", desc: "Comprehensive structural and water health checkup." },
        { name: "Preventative Maintenance", price: "$15/mo subscription", desc: "Bi-annual inspections, heater flushing, and prioritized pricing." }
      ],
      faq: {
        q: "What is hard water and why should I treat it?",
        a: "Hard water contains high calcium and magnesium. It builds up crusty limescale inside your expensive appliances, shortens water heater lifespans by 50%, and dries out your skin."
      },
      beforeAfter: {
        before: "White, crusty calcium build-up choking the inside of hot water pipe lines.",
        after: "Clean water flow after premium water softener installation protects piping."
      }
    }
  };

  const filteredServices = Object.values(serviceCategories)
    .flatMap(cat => cat.items)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative bg-slate-50 min-h-screen">
      
      {/* Hero Section with animated luxury feel */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-900 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Animated flow backdrop effects */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 via-blue-500 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Live Service Availability Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-bold text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE TRACKING: {liveStats.activeTechs} ELITE TECHNICIANS ACTIVE NEAR YOU</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Fast, Reliable <br/>
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Plumbing Services
              </span> <br />
              Available 24/7
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Experience the standard of luxury home services. Upfront flat-rate pricing, 24-minute average emergency dispatch response, and certified master plumbers dedicated to keeping your home flowing flawlessly.
            </p>

            {/* Micro-interaction search bar */}
            <div className="max-w-md relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search 26+ plumbing services (e.g. Tankless, Slab leak...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 border border-white/20 focus:border-cyan-400 rounded-2xl text-sm focus:outline-none transition-all placeholder:text-slate-400"
              />
              <span className="absolute right-2 top-2 bg-blue-600 text-xs font-bold px-3 py-2 rounded-xl text-white">
                Find Fast
              </span>
              
              {searchQuery && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto p-2 text-slate-800 z-50">
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase">Matching Services:</div>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((item, index) => (
                      <Link 
                        key={index}
                        href={`/book?service=${encodeURIComponent(item.name)}`}
                        className="flex justify-between items-center px-3 py-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg shrink-0">
                          {item.price}
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 px-3 py-2">No matching services. Try 'Slab', 'Heater', or 'Drain'.</div>
                  )}
                </div>
              )}
            </div>

            {/* High Converting Action CTA Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
              <Link
                href="/book?urgency=emergency"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-3.5 rounded-2xl text-center shadow-lg shadow-red-500/20 hover:scale-102 transition-all flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="h-4 w-4 animate-pulse" />
                Emergency Hotline
              </Link>
              <Link
                href="/book?urgency=standard"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-3.5 rounded-2xl text-center shadow-lg shadow-blue-500/20 hover:scale-102 transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="h-4 w-4" />
                Book Online
              </Link>
              <button
                onClick={() => setChatbotOpen(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm px-4 py-3.5 rounded-2xl text-center hover:scale-102 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Instant Quote
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <span className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold text-white">4.9</span>
                  <span className="h-8 w-8 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-xs font-bold text-white">★</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">1,400+ Local Reviews</div>
                  <div className="text-[10px] text-slate-400">Google Verified 4.9/5 Rating</div>
                </div>
              </div>

              <div className="h-6 w-px bg-white/15 hidden sm:block" />

              <div className="text-xs">
                <span className="font-bold text-white block">A+ Rated Corporate Partner</span>
                <span className="text-[10px] text-slate-400">Better Business Bureau Accredited</span>
              </div>

              <div className="h-6 w-px bg-white/15 hidden sm:block" />

              <div className="text-xs">
                <span className="font-bold text-white block">Over 15 Years in Business</span>
                <span className="text-[10px] text-slate-400">Locally Owned & Operated</span>
              </div>
            </div>

          </div>

          {/* Right Visual Dashboard Simulation Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20 blur-xl animate-pulse" />
            <div className="relative bg-slate-950/90 border border-white/10 rounded-3xl overflow-hidden p-6 shadow-2xl">
              
              {/* Card Header with Glowing elements */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">FlowMaster Live Dispatch Map</span>
                </div>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded-lg text-slate-400">Area: Greater Metro</span>
              </div>

              {/* Simulated Map Visual */}
              <div className="h-44 bg-slate-900 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                
                {/* Simulated Map Grid pattern */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                
                {/* Animated Flowing Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
                
                {/* Active Technicians Pins */}
                <div className="absolute top-1/4 left-1/3 flex flex-col items-center">
                  <span className="h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg animate-bounce" />
                  <span className="text-[8px] bg-slate-950 border border-blue-500 px-1 py-0.5 rounded text-white mt-1">Dave M. (En-route)</span>
                </div>

                <div className="absolute top-2/3 right-1/4 flex flex-col items-center">
                  <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg" />
                  <span className="text-[8px] bg-slate-950 border border-emerald-500 px-1 py-0.5 rounded text-white mt-1">Sarah S. (On-site)</span>
                </div>

                <div className="absolute top-1/2 right-1/2 flex flex-col items-center">
                  <span className="h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-lg" />
                  <span className="text-[8px] bg-slate-950 border border-amber-500 px-1 py-0.5 rounded text-white mt-1">Alex R. (Available)</span>
                </div>

                <div className="absolute bottom-6 left-12 flex flex-col items-center">
                  <span className="h-3 w-3 rounded-full bg-red-500 border border-white animate-ping" />
                  <span className="text-[8px] bg-slate-950 border border-red-500 px-1 py-0.5 rounded text-white mt-1">Emergency Call #392</span>
                </div>

                <div className="absolute bottom-2 right-2 text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-400">
                  Acoustic Leak Sounding Active
                </div>
              </div>

              {/* Dispatch Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 block">Avg Response Time</span>
                  <span className="text-lg font-bold text-white">{liveStats.avgResponseTime}</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-xs text-slate-400 block">Active Technicians</span>
                  <span className="text-lg font-bold text-cyan-300">{liveStats.activeTechs} Dispatched</span>
                </div>
              </div>

              {/* Simulated Customer review ticker */}
              <div className="mt-4 p-3 bg-blue-950/50 border border-blue-500/20 rounded-xl flex gap-3 items-start">
                <span className="text-lg">📢</span>
                <div>
                  <div className="text-[10px] text-cyan-400 uppercase font-bold">12 Mins Ago In Springfield:</div>
                  <p className="text-xs text-slate-300 leading-snug">
                    "Sarah solved my water heater thermocouple issue in under an hour. Outstanding service!" — John K.
                  </p>
                </div>
              </div>

              {/* Developer Shortcut Badge */}
              <div className="mt-4 pt-3 border-t border-white/5 text-center">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Interactive Simulation Tool</span>
                <p className="text-[10px] text-slate-400">
                  Select a role in the top header menu to immediately control dispatcher workloads or view task logs!
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Trust Signal bar */}
      <section className="bg-white border-b border-slate-200/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Enterprise Trust Partners:</span>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">✦ HOMEADVISOR ELITE</span>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">✦ KOHLER PRO PARTNER</span>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">✦ BBB ACCREDITED A+</span>
            <span className="text-lg font-extrabold text-slate-800 tracking-tight">✦ RHEEM CERTIFIED</span>
          </div>
        </div>
      </section>

      {/* Services Explorer section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center" id="services">
        <div className="space-y-4 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">Comprehensive Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            26 Professional Plumbing Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We are fully licensed and equipped for any task, from simple residential faucet repairs to massive industrial multi-location sewer line hydro jetting.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl max-w-3xl mx-auto">
          {Object.entries(serviceCategories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === key 
                  ? "bg-white text-blue-700 shadow-md" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {cat.icon}
              {cat.title}
            </button>
          ))}
        </div>

        {/* Active Tab Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-stretch">
          
          {/* Column A: Services List */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>{serviceCategories[activeTab as keyof typeof serviceCategories].title}</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-semibold">Guaranteed Upfront Pricing</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {serviceCategories[activeTab as keyof typeof serviceCategories].items.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 bg-white hover:bg-gradient-to-r hover:from-white hover:to-blue-50/20 rounded-2xl border border-slate-200/60 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:shadow-md"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.name}</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200/40">
                      {item.price}
                    </span>
                    <Link
                      href={`/book?service=${encodeURIComponent(item.name)}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Diagnostic & Before/After Proof Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Before After Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider block">Service Craftsmanship Standard</span>
              <h4 className="text-sm font-bold text-slate-900">Before & After Case Study</h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-[10px] font-bold text-red-500 uppercase block mb-1">🔴 Diagnostic Failure</span>
                  <p className="text-slate-600 leading-snug">{serviceCategories[activeTab as keyof typeof serviceCategories].beforeAfter.before}</p>
                </div>
                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">🟢 Certified Restoration</span>
                  <p className="text-slate-600 leading-snug">{serviceCategories[activeTab as keyof typeof serviceCategories].beforeAfter.after}</p>
                </div>
              </div>

              <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold flex items-center gap-1 text-slate-800">
                  <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
                  <span>Frequently Asked Question</span>
                </div>
                <p className="italic text-slate-500">"{serviceCategories[activeTab as keyof typeof serviceCategories].faq.q}"</p>
                <p>{serviceCategories[activeTab as keyof typeof serviceCategories].faq.a}</p>
              </div>
            </div>

            {/* Quick Consultation Promo */}
            <div className="bg-gradient-to-br from-blue-700 to-cyan-600 text-white rounded-3xl p-5 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200 block">Residential & Commercial Protection</span>
                <h4 className="text-lg font-extrabold leading-snug">Join the FlowMaster Platinum Care Plan</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Protect your home plumbing investment. Get annual inspections, free water hardness diagnostics, and priority emergency scheduling for only $15/month.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-cyan-200">100% Transferrable warranty</span>
                <Link 
                  href="/book?service=Platinum Care Subscription"
                  className="bg-white hover:bg-slate-100 text-blue-800 font-bold text-xs px-3 py-2 rounded-xl transition-all"
                >
                  Activate Protection
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works & Operations Platform demo preview */}
      <section className="bg-slate-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">OPERATIONAL ECOSYSTEM</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Not Just Marketing. A Complete Plumbing Business Operating System.
            </h2>
            <p className="text-slate-600 text-sm">
              We leverage premium technology to orchestrate perfect schedules, keep dispatch transparent, and give homeowners total control. Experience plumbing engineered for the 21st century.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h3 className="font-bold text-lg text-slate-900">Smart Online Booking & AI Estimates</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Describe your issue, upload photos, and select your preferred specialist. Our AI diagnostic assistant qualifies the urgency and calculates a direct, transparent estimated budget block.
              </p>
              <Link href="/book" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Generate estimate now <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h3 className="font-bold text-lg text-slate-900">Real-Time Dispatch Tracking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Receive automated SMS notifications with live technician mapping pins, ETAs, and verified technician certifications. Know exactly who is coming and when they will arrive.
              </p>
              <button onClick={() => { setSelectedServiceForDemos("Emergency Routing"); }} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer">
                Simulate map pins <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/40 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h3 className="font-bold text-lg text-slate-900">Customer Portal & Easy Invoicing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sign off on digital invoices, review complete high-res before/after work photologs, track hardware part warranties, and pay securely using virtual credit cards.
              </p>
              <button 
                onClick={() => {
                  const demoUser = { id: 6, name: "Eleanor Vance", email: "customer@flowmasters.com", role: "customer" };
                  localStorage.setItem("flowmaster_session", JSON.stringify(demoUser));
                  window.location.href = "/portal";
                }} 
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
              >
                Access Eleanor's Portal <ChevronRight className="h-3 w-3" />
              </button>
            </div>

          </div>

          {/* Interactive Routing Map Pin Pop-up simulator */}
          {selectedServiceForDemos && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Technician Tracking Active</span>
                  <button onClick={() => setSelectedServiceForDemos(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Dave Mercer (Sewer & Drain Master)</h4>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600">
                  <span className="text-2xl">🚛</span>
                  <div>
                    <div>Current status: <b>En-Route (Priority Emergency)</b></div>
                    <div>ETA: <b>8 minutes</b></div>
                    <div>Destination: <b>742 Evergreen Terrace</b></div>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Dave Mercer has over 12 years of experience and is dispatched with a state-of-the-art diagnostic trailer. You will receive an automated text when his GPS signals he is 2 minutes away.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedServiceForDemos(null)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold">
                    Close Tracker
                  </button>
                  <Link href="/book" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-xl text-xs font-bold">
                    Book Service Call
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* SEO Content: Blog & DIY Guides */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">Educational Authority</span>
            <h2 className="text-3xl font-black text-slate-900">
              The Plumbing Academy: DIY Guides & Safety Tips
            </h2>
            <p className="text-slate-600 text-sm max-w-xl">
              Our expert technicians publish verified maintenance manuals to help homeowners avoid major catastrophic water damage.
            </p>
          </div>
          <Link href="/book" className="text-sm font-bold text-blue-600 hover:underline shrink-0">
            Book preventative inspection ➜
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Blog 1 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-lg">Safety Diagnostics</span>
                <span className="text-xs text-slate-400">6 min read</span>
              </div>
              <h3 className="font-bold text-slate-950 text-base leading-snug">
                5 Signs You Have a Hidden Sub-Slab Foundation Leak
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3">
                A slab leak occurs when water pipes running underneath your concrete floor start to corrode. Watch out for warm tiles, spinning meters, and silent moisture spots.
              </p>
            </div>
            <div className="p-6 pt-0 border-t border-slate-50 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">CM</div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Carlos Mendez</span>
                <span className="text-[10px] text-slate-400">Master Leak Specialist</span>
              </div>
            </div>
          </div>

          {/* Blog 2 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Buying Guides</span>
                <span className="text-xs text-slate-400">8 min read</span>
              </div>
              <h3 className="font-bold text-slate-950 text-base leading-snug">
                Tank vs. Tankless Water Heaters: The Ultimate Modern Comparison
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3">
                Deciding between storage tanks and modern continuous flow heaters? Evaluate long-term energy savings, flow limits, gas upgrades, and space optimization.
              </p>
            </div>
            <div className="p-6 pt-0 border-t border-slate-50 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">AR</div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Alex Rivers</span>
                <span className="text-[10px] text-slate-400">Director of Hydronics</span>
              </div>
            </div>
          </div>

          {/* Blog 3 */}
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">Seasonal Care</span>
                <span className="text-xs text-slate-400">5 min read</span>
              </div>
              <h3 className="font-bold text-slate-950 text-base leading-snug">
                Spring Plumbing Checklist: Homeowner Preventative Protocol
              </h3>
              <p className="text-xs text-slate-500 line-clamp-3">
                Avoid frozen pipe fractures from thawing damage. Flush sediment out of water heaters and perform standard dye testing on toilets to detect silent leaks.
              </p>
            </div>
            <div className="p-6 pt-0 border-t border-slate-50 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">DM</div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Dave Mercer</span>
                <span className="text-[10px] text-slate-400">Lead Operations Master</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Floating AI Assistant Chatbot Button and Chat Panel */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatbotOpen && (
          <div className="bg-white rounded-3xl w-80 sm:w-96 h-112 shadow-2xl border border-slate-100 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
            {/* Chatbot Header */}
            <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                  💧
                </div>
                <div>
                  <h4 className="font-bold text-sm">FlowMaster AI Assistant</h4>
                  <span className="text-[10px] text-cyan-200">Online & ready to calculate quotes</span>
                </div>
              </div>
              <button 
                onClick={() => setChatbotOpen(false)} 
                className="text-white hover:text-slate-200 font-bold text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Chatbot Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50 text-xs">
              {chatbotMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === "user" 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 border border-slate-200/60 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions inside Chat */}
            <div className="p-2 border-t border-slate-100 bg-white flex flex-wrap gap-1">
              <button 
                onClick={() => { setChatbotInput("How much to replace a water heater?"); }} 
                className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full text-left"
              >
                Heater Quote?
              </button>
              <button 
                onClick={() => { setChatbotInput("I have a leaking pipe. What should I do?"); }} 
                className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full text-left"
              >
                Emergency Leak Help?
              </button>
              <button 
                onClick={() => { setChatbotInput("What's the price for drain cleaning?"); }} 
                className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full text-left"
              >
                Drain Clean Price?
              </button>
            </div>

            {/* Chatbot Form */}
            <form onSubmit={handleChatSubmit} className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatbotInput(e.target.value)}
                placeholder="Ask AI anything..."
                className="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setChatbotOpen(!chatbotOpen)}
          className="bg-gradient-to-tr from-blue-600 to-cyan-500 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 hover:rotate-6 cursor-pointer"
        >
          {chatbotOpen ? <MessageSquare className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 animate-pulse" />}
        </button>
      </div>

    </div>
  );
}
