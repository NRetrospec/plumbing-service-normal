"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart3, Users, Wrench, Shield, TrendingUp, DollarSign, 
  MapPin, AlertCircle, RefreshCw, Send, CheckCircle2, ChevronRight, 
  FileText, Activity, ShieldAlert, Sparkles, Loader2, ArrowUpRight
} from "lucide-react";

interface AdminStats {
  totalRevenue: number;
  outstandingRevenue: number;
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  pendingJobs: number;
  lowStockCount: number;
  technicianCount: number;
  customerCount: number;
  averageTicketValue: number;
  conversionRate: number;
  lowStockItems: any[];
  technicians: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [allAppointments, setAppointments] = useState<any[]>([]);
  const [allEstimates, setEstimates] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "dispatch" | "crm" | "inventory" | "marketing">("overview");

  // CRM action states
  const [assignTechId, setAssignTechId] = useState<string>("");
  const [selectedJobToAssign, setSelectedJobToAssign] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Marketing review simulator
  const [campaignSuccess, setCampaignComplete] = useState(false);

  // Load stats and schedules from backend
  const loadStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }

      const bookRes = await fetch("/api/bookings");
      const bookData = await bookRes.json();
      if (bookData.success) {
        setAppointments(bookData.appointments || []);
      }

      const estRes = await fetch("/api/estimates");
      const estData = await estRes.json();
      if (estData.success) {
        setEstimates(estData.estimates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleAssignTechnician = async (appointmentId: number) => {
    if (!assignTechId) {
      alert("Please select a technician first.");
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          technicianId: assignTechId,
          status: "scheduled"
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Technician assigned and dispatched! Live GPS tracking active.");
        setSelectedJobToAssign(null);
        setAssignTechId("");
        loadStats();
      }
    } catch (e) {
      alert("Error assigning technician");
    }
  };

  const handleRestockItem = async (itemId: number) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust-stock",
          itemId,
          amount: 50
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Ordered 50 units! Stock replenished in warehouse.");
        loadStats();
      }
    } catch (e) {
      alert("Error restocking item");
    }
  };

  const triggerReviewCampaign = () => {
    setCampaignComplete(true);
    setTimeout(() => {
      setCampaignComplete(false);
      alert("Campaign complete! Dispatched 12 verified SMS reviews to homeowners completed today.");
    }, 1200);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-bold">Connecting to PostgreSQL database cluster...</p>
      </div>
    );
  }

  // Pre-calculated stats from state with safe defaults
  const dashboardStats = stats || {
    totalRevenue: 3500.00,
    outstandingRevenue: 1200.00,
    totalJobs: 5,
    completedJobs: 2,
    activeJobs: 2,
    pendingJobs: 1,
    lowStockCount: 1,
    technicianCount: 4,
    customerCount: 3,
    averageTicketValue: 1150,
    conversionRate: 65,
    lowStockItems: [],
    technicians: []
  };

  const pendingJobsList = allAppointments.filter(appt => appt.status === "pending" || !appt.technicianId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-slate-800 space-y-8">
      
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            FlowMaster Enterprise SaaS Platform
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Plumbing Operations Command Center
          </h1>
          <p className="text-xs text-slate-500">Real-time scheduling, live technician tracking, CRM pipelines, and warehouse telemetry logs.</p>
        </div>

        <button
          onClick={loadStats}
          disabled={refreshing}
          className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Telemetry Syncing..." : "Sync Live Databases"}
        </button>
      </div>

      {/* Admin Quick stats KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1 hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Sales Revenue</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-950">${dashboardStats.totalRevenue.toLocaleString()}</span>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +14%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">Calculated from paid invoices</span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1 hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Outstanding Receivables</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-950">${dashboardStats.outstandingRevenue.toLocaleString()}</span>
            <span className="text-red-500 text-xs font-bold">Uncollected</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Pending Stripe bank clearings</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1 hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Lead Conversion Rate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-950">{dashboardStats.conversionRate}%</span>
            <span className="text-emerald-500 text-xs font-bold">★ High Score</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Estimate proposal approval ratio</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-1 hover:shadow-md transition-all">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Low Stock Alerts</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600">{dashboardStats.lowStockCount} Items</span>
            {dashboardStats.lowStockCount > 0 && (
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <span className="text-[10px] text-slate-400 block">Requires critical supplier orders</span>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "overview" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-100 text-slate-600 hover:text-slate-900"
          }`}
        >
          📊 Master Overview
        </button>
        <button
          onClick={() => setActiveTab("dispatch")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dispatch" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-100 text-slate-600 hover:text-slate-900"
          }`}
        >
          📡 Dispatch Center & Map
        </button>
        <button
          onClick={() => setActiveTab("crm")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "crm" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-100 text-slate-600 hover:text-slate-900"
          }`}
        >
          💼 CRM Lead Board
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "inventory" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-100 text-slate-600 hover:text-slate-900"
          }`}
        >
          📦 Inventory & Supply
        </button>
        <button
          onClick={() => setActiveTab("marketing")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "marketing" ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-100 text-slate-600 hover:text-slate-900"
          }`}
        >
          🚀 SEO & Reviews Hub
        </button>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Tab 1: Master Overview (With Sales Graphs and active telemetry log) */}
        {activeTab === "overview" && (
          <>
            {/* Visual Performance Charts (8 Columns) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="font-bold text-slate-900 text-base">Monthly Operational Performance</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Past 6 Months</span>
              </div>

              {/* Responsive SVG graph representing profit telemetry */}
              <div className="h-56 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between p-4 relative overflow-hidden">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold border-b border-slate-200/60 pb-2">
                  <span>Gross Profit Block</span>
                  <span className="text-blue-600">Avg Ticket: ${dashboardStats.averageTicketValue}</span>
                </div>
                
                {/* SVG Visual Graph Lines */}
                <svg className="w-full h-36" viewBox="0 0 500 120">
                  <defs>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Under Chart */}
                  <path d="M 10,110 L 90,95 L 180,82 L 270,72 L 360,54 L 450,22 L 450,110 Z" fill="url(#profitGrad)" />
                  
                  {/* Grid Lines */}
                  <line x1="10" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="10" y1="50" x2="480" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="10" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Primary Data Line */}
                  <path d="M 10,110 L 90,95 L 180,82 L 270,72 L 360,54 L 450,22" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Data Points */}
                  <circle cx="90" cy="95" r="4" fill="#2563eb" />
                  <circle cx="180" cy="82" r="4" fill="#2563eb" />
                  <circle cx="270" cy="72" r="4" fill="#2563eb" />
                  <circle cx="360" cy="54" r="4" fill="#3b82f6" />
                  <circle cx="450" cy="22" r="5" fill="#06b6d4" />
                </svg>

                {/* Graph Axis */}
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold px-2">
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan (2026)</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span className="font-extrabold text-blue-600">Apr (Current)</span>
                </div>
              </div>

              {/* Performance description footer */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Jobs Dispatched</span>
                  <span className="text-lg font-bold text-slate-800">{dashboardStats.totalJobs}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Working</span>
                  <span className="text-lg font-bold text-blue-600">{dashboardStats.activeJobs} Calls</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Average Repair Price</span>
                  <span className="text-lg font-bold text-slate-800">${dashboardStats.averageTicketValue}</span>
                </div>
              </div>

            </div>

            {/* Quick Pending Job Assign Trigger (4 Columns) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
                Live Dispatch Queue
              </span>
              <h3 className="font-bold text-slate-900 text-base">Unassigned Pending Jobs ({pendingJobsList.length})</h3>
              
              {pendingJobsList.length > 0 ? (
                <div className="space-y-3">
                  {pendingJobsList.map((job) => (
                    <div key={job.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>{job.serviceType}</span>
                        <span className="text-red-500 capitalize">{job.urgency}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">"{job.description}"</p>
                      
                      {selectedJobToAssign?.id === job.id ? (
                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                          <label className="text-[9px] font-bold text-slate-500 uppercase block">Assign to Technician:</label>
                          <div className="flex gap-2">
                            <select
                              value={assignTechId}
                              onChange={(e) => setAssignTechId(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none flex-grow"
                            >
                              <option value="">-- Choose Tech --</option>
                              {dashboardStats.technicians.map((t: any) => (
                                <option key={t.id} value={t.id}>{t.name} ({t.isAvailable ? "Available" : "Busy"})</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssignTechnician(job.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg text-xs cursor-pointer"
                            >
                              Dispatch
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedJobToAssign(job)}
                          className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200/40 text-blue-700 py-1.5 rounded-lg font-bold text-xs text-center transition-colors cursor-pointer"
                        >
                          ⚡ Dispatch Specialist
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-8 text-center">No unassigned jobs currently in queue. All systems operating clean.</p>
              )}
            </div>
          </>
        )}

        {/* Tab 2: Dispatch Center & Map (Simulated interactive fleet map and technicians state) */}
        {activeTab === "dispatch" && (
          <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Fleet GPS Dispatch Map Control
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Map Panel (2 Columns) */}
              <div className="lg:col-span-2 h-96 bg-slate-900 rounded-2xl relative overflow-hidden border border-slate-800">
                {/* SVG Route Visualization */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Simulated fleet status markers */}
                <div className="absolute top-10 left-12 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse border border-white" />
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white font-mono font-bold">VEHICLE #1: Dave M (Working)</span>
                </div>

                <div className="absolute top-44 left-1/3 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500 animate-pulse border border-white" />
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white font-mono font-bold">VEHICLE #2: Alex Rivers (En-route)</span>
                </div>

                <div className="absolute top-1/2 right-24 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse border border-white" />
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-white font-mono font-bold">VEHICLE #3: Sarah S (Arrived)</span>
                </div>

                <div className="absolute bottom-16 right-1/3 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <span className="font-bold text-amber-400 block mb-0.5">Automated Route Optimization</span>
                  <span>Truck routing synchronized. Live ETA averages 24 minutes.</span>
                </div>
              </div>

              {/* Technicians Fleet roster */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Technicians On-Duty</span>
                
                <div className="space-y-3">
                  {dashboardStats.technicians.map((t: any) => (
                    <div key={t.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{t.name}</span>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t.specialty}</p>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold block ${
                          t.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}>
                          {t.isAvailable ? "Available" : "On Call"}
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold block mt-1">★ {t.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: CRM Lead Board (Estimate Pipelines and leads status) */}
        {activeTab === "crm" && (
          <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 text-base">Active Proposal & Customer Lead CRM</span>
              <span className="text-xs text-slate-400">Estimate Approval Pipeline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Proposal Pending Column */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-3">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded block w-fit">
                  Proposal Out (Pending)
                </span>
                
                {allEstimates.filter(e => e.status === "pending").map((est) => (
                  <div key={est.id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs text-xs space-y-2">
                    <span className="font-bold text-slate-900 block">{est.serviceType}</span>
                    <p className="text-slate-500 line-clamp-2">"{est.description}"</p>
                    <div className="font-bold text-blue-600">${est.estimatedCostLow} - ${est.estimatedCostHigh}</div>
                  </div>
                ))}
              </div>

              {/* Approved Proposals Column */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded block w-fit">
                  Client Approved (Awaiting Slot)
                </span>

                {allEstimates.filter(e => e.status === "approved").map((est) => (
                  <div key={est.id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs text-xs space-y-2">
                    <span className="font-bold text-slate-900 block">{est.serviceType}</span>
                    <p className="text-slate-500 line-clamp-2">"{est.description}"</p>
                    <div className="font-bold text-blue-600">${est.estimatedCostLow}</div>
                    <span className="text-emerald-600 font-semibold block text-[10px]">✓ Verified Approved</span>
                  </div>
                ))}
              </div>

              {/* Closed Out Column */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-3">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded block w-fit">
                  Archived / Completed
                </span>
                <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-400 italic text-center py-6">
                  Completed proposals archived.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Inventory Telemetry (warehouse, alert thresholds, suppliers) */}
        {activeTab === "inventory" && (
          <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="font-bold text-slate-900 text-base">Warehouse Stock Telemetry & Alerts</span>
              <span className="text-xs text-red-500 font-bold">Alert Threshold: Under Safety Margin</span>
            </div>

            {/* Simulated telemetry tables */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-center">In Stock Count</th>
                    <th className="p-3 text-center">Safety Minimum</th>
                    <th className="p-3">Supplier Name</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Restock Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Hardcoded or dynamic inventory rows */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-950">Copper Piping 1/2 inch (10ft)</td>
                    <td className="p-3 capitalize">Pipes</td>
                    <td className="p-3 text-center font-bold">85</td>
                    <td className="p-3 text-center">20</td>
                    <td className="p-3 text-slate-400">Apex Pipe Supply</td>
                    <td className="p-3 text-right font-semibold">$34.50</td>
                    <td className="p-3 text-right">
                      <button onClick={() => alert("Restock order processed!")} className="text-blue-600 hover:underline">Order 50</button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50 bg-red-50/30">
                    <td className="p-3 font-bold text-slate-950 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                      Teflon Thread Sealant Tape 5-pack
                    </td>
                    <td className="p-3 capitalize">Fittings</td>
                    <td className="p-3 text-center font-extrabold text-red-600">8</td>
                    <td className="p-3 text-center">20</td>
                    <td className="p-3 text-slate-400">Fasteners Direct</td>
                    <td className="p-3 text-right font-semibold">$4.99</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handleRestockItem(12)} className="bg-red-600 text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer">
                        Restock (Auto-Order)
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-950">ProLine Tankless Gas Water Heater</td>
                    <td className="p-3 capitalize">Heaters</td>
                    <td className="p-3 text-center font-bold">8</td>
                    <td className="p-3 text-center">5</td>
                    <td className="p-3 text-slate-400">A.O. Smith Distributor</td>
                    <td className="p-3 text-right font-semibold">$1,250.00</td>
                    <td className="p-3 text-right">
                      <button onClick={() => alert("Restock processed")} className="text-blue-600 hover:underline">Order 5</button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-950">Luxury Kitchen Pull-out Faucet</td>
                    <td className="p-3 capitalize">Fixtures</td>
                    <td className="p-3 text-center font-bold">24</td>
                    <td className="p-3 text-center">8</td>
                    <td className="p-3 text-slate-400">Kohler Wholesale</td>
                    <td className="p-3 text-right font-semibold">$185.00</td>
                    <td className="p-3 text-right">
                      <button onClick={() => alert("Restock processed")} className="text-blue-600 hover:underline">Order 10</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: SEO and marketing Review Hub (city schemas and review triggers) */}
        {activeTab === "marketing" && (
          <div className="lg:col-span-12 bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Local SEO Schema & Automated Customer Reviews Hub
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Local business schema */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Generated JSON-LD LocalBusiness Schema</span>
                <p className="text-xs text-slate-500">
                  This structured script is dynamically injected into target city search indexes to ensure our team takes #1 rankings on Google Maps and Local Pack:
                </p>
                
                <pre className="bg-slate-950 text-slate-300 text-[10px] p-4 rounded-xl font-mono overflow-x-auto leading-relaxed max-h-52">
{`{
  "@context": "https://schema.org",
  "@type": "PlumbingService",
  "name": "FlowMaster Plumbing & Operations",
  "image": "https://flowmasters.com/hero.jpg",
  "telePhone": "(555) FLOW-NOW",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "100 Elite Business Way",
    "addressLocality": "Springfield",
    "addressRegion": "WA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "47.6101",
    "longitude": "-122.2015"
  },
  "areaServed": ["Springfield", "Bellevue", "Lakewood"]
}`}
                </pre>
              </div>

              {/* Review Campaign Tool */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider block w-fit">
                  Automated Review Dispatcher
                </span>
                <h4 className="font-bold text-slate-900 text-sm">Convert completed work orders into verified 5-Star ratings</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our system automatically queues follow-up review prompts. Click below to trigger a follow-up SMS sequence to all homeowners completed in the past 24 hours.
                </p>

                <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-800">SMS Template:</span>
                  <p className="text-slate-500 italic mt-1">
                    "Hi Eleanor, thanks for trusting FlowMaster today! Alex Rivers enjoyed working with you. Could you spare 15 seconds to share your feedback? flowmaster.pro/review?id=389"
                  </p>
                </div>

                <button
                  onClick={triggerReviewCampaign}
                  disabled={campaignSuccess}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  {campaignSuccess ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Syncing feedback queues...
                    </>
                  ) : (
                    "Trigger Automated Review Prompts"
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
