"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Droplet, Award, CheckCircle, Mail, MapPin, Phone, ShieldCheck, Star } from "lucide-react";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  const services = [
    "Emergency Plumbing", "Drain Cleaning", "Sewer Repair", "Leak Detection",
    "Water Heater Installation", "Water Heater Repair", "Tankless Water Heaters",
    "Pipe Repair", "Pipe Replacement", "Toilet Repair & Install", "Hydro Jetting",
    "Water Filtration & Softeners", "Commercial Plumbing", "Residential Plumbing"
  ];

  const serviceAreas = [
    "Bellevue (Downtown, Crossroads, Somerset)",
    "Springfield (Metro, Oak Heights, Hillside)",
    "Lakewood & Pine Valley",
    "Westside Premium District",
    "Green Valley & Ridge Point",
    "Metro Industrial Zone"
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand & Promise */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  FLOWMASTER
                </span>
                <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none">
                  Enterprise Services
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              Experience the pinnacle of home services. FlowMaster combines elite luxury plumbing craftsmanship with advanced modern diagnostics to deliver unmatched, 24/7 priority reliability.
            </p>

            <div className="space-y-3">
              <a href="tel:5553569669" className="flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 rounded-xl transition-colors group">
                <Phone className="h-4 w-4 text-red-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">24/7 Emergency Dispatch</div>
                  <div className="text-sm font-bold text-white">(555) FLOW-NOW</div>
                </div>
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>100 Elite Business Way, Suite 400</span>
              </div>
            </div>
          </div>

          {/* Column 2: 24/7 Premium Services */}
          <div>
            <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-6 flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              Our Services
            </h3>
            <ul className="grid grid-cols-1 gap-2 text-sm">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    href={`/book?service=${encodeURIComponent(service)}`} 
                    className="text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block py-0.5"
                  >
                    ✦ {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Local SEO Service Areas */}
          <div>
            <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-6 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-400" />
              Service Areas (SEO Optimized)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Providing lightning-fast emergency response times under 30 minutes in:
            </p>
            <ul className="space-y-2 text-xs">
              {serviceAreas.map((area, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Local Response Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-white ml-1">4.95/5</span>
              </div>
              <span className="text-[9px] text-slate-500 block mt-0.5">Based on 1,420+ local neighborhood reviews</span>
            </div>
          </div>

          {/* Column 4: Newsletter & Trust Seals */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase text-white tracking-wider mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                Join VIP Club
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Receive priority service updates, storm freeze-warnings, and $50 off your next diagnostic visit.
              </p>
              
              {subscribed ? (
                <div className="bg-emerald-950/40 border border-emerald-800 p-3 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Welcome! $50 credit applied to your phone number.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter email address" 
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 w-full"
                  />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer">
                    Join
                  </button>
                </form>
              )}
            </div>

            {/* Certifications and Badges */}
            <div className="pt-4 border-t border-slate-900">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verified Accreditations</div>
              <div className="flex flex-wrap gap-2.5 items-center">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  <span className="text-[9px] text-slate-300 font-semibold uppercase">Fully Bonded</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center gap-1">
                  <span className="text-[9px] text-amber-400 font-bold uppercase">A+ Rating BBB</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2">
                  <span className="text-[9px] text-slate-400 uppercase">EPA Lead-Safe Certified</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Structured Schema and Technical footer */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 FlowMaster Plumbing Inc. All Rights Reserved. Operated under corporate license #PL9981-01 and #HT-5542.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-300">Sitemap</Link>
            <Link href="/book?urgency=emergency" className="text-red-400 hover:text-red-300 font-semibold">24/7 Live Emergency Board</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
