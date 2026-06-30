"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Navigation, CheckSquare, Clipboard, Box, Clock, ChevronRight, 
  MapPin, User, Check, Phone, ShieldAlert, Sparkles, Loader2, ArrowRight
} from "lucide-react";

export default function TechnicianDashboardPage() {
  const [techUser, setTechUser] = useState<any>(null);
  const [assignedJobs, setAssignedJobs] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for active job completion
  const [techNotes, setTechNotes] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [partAmount, setPartAmount] = useState("1");
  const [laborHours, setLaborHours] = useState("2.0");
  const [customerSig, setCustomerSig] = useState("");
  const [submittingCompletion, setSubmittingCompletion] = useState(false);
  const [statusProgress, setStatusProgress] = useState<"scheduled" | "arrived" | "in_progress" | "completed">("scheduled");

  useEffect(() => {
    // 1. Identify active session or force Alex Rivers as default demo tech
    const saved = localStorage.getItem("flowmaster_session");
    let techId = 3; // Alex Rivers default seeded ID

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === "technician" || parsed.id) {
          setTechUser(parsed);
          techId = parsed.id;
        }
      } catch (e) {}
    } else {
      const defaultTech = {
        id: 3,
        name: "Alex Rivers",
        email: "alex@flowmasters.com",
        role: "technician",
        specialty: "Water Heaters & Tankless Systems",
        phone: "(555) 345-6789"
      };
      localStorage.setItem("flowmaster_session", JSON.stringify(defaultTech));
      setTechUser(defaultTech);
    }

    // 2. Fetch Assigned Jobs & Inventory
    const loadTechData = async () => {
      try {
        setLoading(true);
        // Jobs
        const apptRes = await fetch(`/api/bookings?technicianId=${techId}`);
        const apptData = await apptRes.json();
        if (apptData.success) {
          const list = apptData.appointments || [];
          setAssignedJobs(list);
          // Set the first non-completed job as the current active focus
          const incomplete = list.find((j: any) => j.status !== "completed");
          if (incomplete) {
            setActiveJob(incomplete);
            setStatusProgress(incomplete.status as any || "scheduled");
          } else if (list.length > 0) {
            setActiveJob(list[0]);
          }
        }

        // Inventory list
        const invRes = await fetch("/api/inventory");
        const invData = await invRes.json();
        if (invData.success) {
          setInventoryList(invData.inventory || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTechData();
  }, []);

  const handleUpdateStatus = async (newStatus: "dispatched" | "arrived" | "in_progress") => {
    if (!activeJob) return;
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: activeJob.id,
          status: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setActiveJob(data.appointment);
        setStatusProgress(newStatus as any);
        // Update job list
        setAssignedJobs(prev => prev.map(j => j.id === activeJob.id ? { ...j, status: newStatus } : j));
      }
    } catch (e) {
      alert("Error updating status");
    }
  };

  const handleCompleteJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob) return;
    if (!customerSig) {
      alert("Please capture the Customer Signature before closing out the job.");
      return;
    }

    setSubmittingCompletion(true);

    try {
      // 1. Deduct part from inventory in database
      if (selectedPart && parseInt(partAmount) > 0) {
        await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "adjust-stock",
            itemId: selectedPart,
            amount: -parseInt(partAmount)
          })
        });
      }

      // 2. Mark appointment as completed
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: activeJob.id,
          status: "completed",
          technicianNotes: techNotes,
          laborHours: parseFloat(laborHours),
          customerSignature: customerSig,
          notes: `Job completed by ${techUser?.name || "Alex Rivers"}. Signature: ${customerSig}`
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("Job completed! Inventory deducted, invoice generated, and review campaign triggered to homeowner.");
        setActiveJob(data.appointment);
        setStatusProgress("completed");
        setAssignedJobs(prev => prev.map(j => j.id === activeJob.id ? data.appointment : j));
        // Reset completion inputs
        setTechNotes("");
        setSelectedPart("");
        setCustomerSig("");
      }
    } catch (e) {
      alert("Error completing job");
    } finally {
      setSubmittingCompletion(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-medium">Bootstrapping Technician mobile routing tools...</p>
      </div>
    );
  }

  const currentTech = techUser || { name: "Alex Rivers", specialty: "Heating Expert" };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-slate-800 space-y-8">
      
      {/* Technician Portal Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-lg">
        <div className="flex items-center gap-4 text-left">
          <div className="h-14 w-14 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center text-2xl shadow">
            👷
          </div>
          <div>
            <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2.5 py-0.5 rounded-full font-bold uppercase block w-fit mb-1">
              Active Duty Specialist
            </span>
            <h1 className="text-xl font-black">{currentTech.name}</h1>
            <p className="text-xs text-amber-100">{currentTech.specialty} • {currentTech.phone}</p>
          </div>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/15 text-center text-xs shrink-0">
          <span>Truck Inventory: Loaded</span>
          <span className="block font-bold text-amber-200">Pro-Mobile Kit #3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Daily route schedule maps and active job focus (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Daily Scheduled Jobs */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clipboard className="h-5 w-5 text-amber-600" />
              <span>Assigned Schedule for Today</span>
            </h2>

            {assignedJobs.length > 0 ? (
              <div className="space-y-3">
                {assignedJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => {
                      setActiveJob(job);
                      setStatusProgress(job.status);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center gap-4 ${
                      activeJob?.id === job.id 
                        ? "bg-amber-50/50 border-amber-300 shadow-sm" 
                        : "bg-white border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{job.serviceType}</span>
                        {job.urgency === "emergency" && (
                          <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded">Emergency</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">{job.address}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        job.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700 animate-pulse"
                      }`}>
                        {job.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active jobs currently assigned. Enjoy your break!
              </div>
            )}
          </div>

          {/* Simulated GPS Navigation Map card */}
          {activeJob && activeJob.status !== "completed" && (
            <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-amber-400 animate-spin-slow" />
                  Route & Directions Navigation
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-300">ETA: 9 Mins</span>
              </div>
              
              {/* Simulated Map */}
              <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Simulated GPS pathway line */}
                <svg className="absolute inset-0 h-full w-full opacity-60 pointer-events-none">
                  <path d="M 40,150 Q 180,30 290,120 T 400,60" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 4" className="animate-pulse" />
                </svg>

                <div className="absolute bottom-4 left-4 text-left">
                  <span className="text-[10px] text-amber-400 font-bold block">CURRENT ROUTE:</span>
                  <p className="text-xs text-white font-bold">{activeJob.address}</p>
                </div>

                <div className="absolute top-1/2 right-12 bg-slate-900 border border-amber-400 p-2.5 rounded-xl text-[10px] text-white">
                  📍 Plumber In Route
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("arrived")}
                  disabled={statusProgress === "arrived" || statusProgress === "in_progress"}
                  className={`flex-grow py-2.5 px-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    statusProgress === "arrived" || statusProgress === "in_progress"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow"
                  }`}
                >
                  ✓ Arrived On Site
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus("in_progress")}
                  disabled={statusProgress !== "arrived"}
                  className={`flex-grow py-2.5 px-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                    statusProgress === "in_progress"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
                  }`}
                >
                  ⚙ Begin Labor Work
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Active Work notes & dynamic parts deduction catalog (5 columns) */}
        <div className="lg:col-span-5">
          {activeJob ? (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xl space-y-5">
              
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase w-fit mb-1">
                  Active Ticket Focus
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{activeJob.serviceType}</h3>
                <p className="text-xs text-slate-500 leading-snug">Address: {activeJob.address}</p>
              </div>

              {activeJob.status === "completed" ? (
                <div className="py-10 text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Job Complete & Paid</h4>
                    <p className="text-xs text-slate-500 mt-1">This ticket has been locked and synced to office databases.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCompleteJob} className="space-y-4 text-xs">
                  
                  {/* Notes Field */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Diagnostic Report / Work Done *</label>
                    <textarea
                      required
                      rows={3}
                      value={techNotes}
                      onChange={(e) => setTechNotes(e.target.value)}
                      placeholder="e.g. Swapped failing heating elements, descaled calcium build-up, and tested the expansion bypass loop. No leaks detected under 40 PSI pressure."
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 rounded-xl p-3 focus:outline-none"
                    />
                  </div>

                  {/* Dynamic Parts Deduction Dropdown */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Inventory Replacement Parts Used</label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={selectedPart}
                        onChange={(e) => setSelectedPart(e.target.value)}
                        className="col-span-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 rounded-xl px-2 py-2 focus:outline-none"
                      >
                        <option value="">-- Deduct Part From Truck --</option>
                        {inventoryList.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.itemName} ({item.count} left)
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={partAmount}
                        onChange={(e) => setPartAmount(e.target.value)}
                        className="col-span-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 rounded-xl px-2 py-2 focus:outline-none text-center"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-1">Deducts quantity from Central Warehouse Database upon closing ticket.</span>
                  </div>

                  {/* Labor hours input */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Labor Hours Tracked</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={laborHours}
                      onChange={(e) => setLaborHours(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 rounded-xl px-3 py-2 focus:outline-none"
                    />
                  </div>

                  {/* Digital Signature */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Customer Authorization Signature *</label>
                    <input
                      type="text"
                      required
                      value={customerSig}
                      onChange={(e) => setCustomerSig(e.target.value)}
                      placeholder="Type client's full name to sign off work authorization"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-500 rounded-xl px-3 py-2 focus:outline-none font-mono text-sm"
                    />
                    <div className="mt-1.5 h-16 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-mono text-[10px]">
                      {customerSig ? (
                        <span className="text-blue-700 font-bold italic text-sm">{customerSig}</span>
                      ) : (
                        "Handwrite or type above to authorize digital signature"
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingCompletion}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                  >
                    {submittingCompletion ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adjusting Stock & Invoicing...
                      </>
                    ) : (
                      <>
                        <span>Complete Job & Charge Client</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-8 text-center text-slate-400 text-xs">
              Select an active job ticket on the left to activate technician checklists.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
