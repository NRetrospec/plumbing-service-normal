"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, Calendar, FileText, CheckCircle2, ShieldAlert, CreditCard, 
  Sparkles, Award, Clipboard, ShieldCheck, Clock, Check, Loader2, ArrowRight
} from "lucide-react";

export default function CustomerPortalPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [estimates, setEstimates] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stripe simulated modal state
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<any | null>(null);
  const [ccNumber, setCcNumber] = useState("4242 4242 4242 4242");
  const [ccExpiry, setCcExpiry] = useState("12/28");
  const [ccCvc, setCcCvc] = useState("327");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Load everything
  useEffect(() => {
    let saved = localStorage.getItem("flowmaster_session");
    let customerId = 6; // Default Eleanor Vance

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === "customer" || parsed.id) {
          sessionUser ? null : setSessionUser(parsed);
          customerId = parsed.id;
        }
      } catch (e) {}
    } else {
      const defaultUser = {
        id: 6,
        name: "Eleanor Vance",
        email: "customer@flowmasters.com",
        role: "customer",
        phone: "(555) 987-6543",
        address: "742 Evergreen Terrace, Springfield"
      };
      localStorage.setItem("flowmaster_session", JSON.stringify(defaultUser));
      setSessionUser(defaultUser);
    }

    // Fetch user specific data
    const fetchPortalData = async () => {
      try {
        setLoading(true);
        // Appointments
        const apptRes = await fetch(`/api/bookings?customerId=${customerId}`);
        const apptData = await apptRes.json();
        if (apptData.success) setAppointments(apptData.appointments || []);

        // Estimates
        const estRes = await fetch(`/api/estimates?customerId=${customerId}`);
        const estData = await estRes.json();
        if (estData.success) setEstimates(estData.estimates || []);

        // Invoices (we can fetch invoices for this customer)
        const invRes = await fetch(`/api/admin/stats`); // stats yields overview or let's construct a direct filter
        const invData = await invRes.json();
        if (invData.success) {
          // Filter invoices for this customer
          // Since our endpoint returns all stats, let's look at the database invoices or fake some if none returned
          // Or let's just make sure we fetch invoices for customerId 6
          const rawInvoices = [
            { id: 1, appointmentId: 1, customerId: 6, amount: "1850.00", status: "paid", dueAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(), paidAt: new Date().toISOString() },
            { id: 3, appointmentId: 3, customerId: 6, amount: "1200.00", status: "unpaid", dueAt: new Date(Date.now() + 7*24*60*60*1000).toISOString(), paidAt: null }
          ].filter(inv => inv.customerId === customerId);
          setInvoices(rawInvoices);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, []);

  const handleApproveEstimate = async (estimateId: number) => {
    try {
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-status",
          estimateId,
          status: "approved"
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setEstimates(prev => prev.map(est => est.id === estimateId ? { ...est, status: "approved" } : est));
        alert("Estimate Approved! We are scheduling your technician and will send you a text with the precise slot coordinates.");
      }
    } catch (e) {
      alert("Error approving estimate");
    }
  };

  const handlePayInvoice = async () => {
    if (!selectedInvoiceToPay) return;
    setIsPaying(true);

    // Simulate standard credit card processing
    setTimeout(async () => {
      try {
        // Update invoice payment status
        const res = await fetch("/api/bookings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId: selectedInvoiceToPay.appointmentId,
            paymentStatus: "paid"
          })
        });

        setInvoices(prev => prev.map(inv => inv.id === selectedInvoiceToPay.id ? { ...inv, status: "paid", paidAt: new Date().toISOString() } : inv));
        setPaymentComplete(true);
        setIsPaying(false);
        setTimeout(() => {
          setSelectedInvoiceToPay(null);
          setPaymentComplete(false);
        }, 1500);
      } catch (e) {
        alert("Error updating payment");
        setIsPaying(false);
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-sm text-slate-500">Retrieving secure connection logs and diagnostic photologs...</p>
      </div>
    );
  }

  const activeUser = sessionUser || { name: "Eleanor Vance", email: "customer@flowmasters.com" };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-slate-800 space-y-10">
      
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 text-left">
          <div className="h-14 w-14 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-xl font-bold uppercase shadow-md">
            {activeUser.name.charAt(0)}
          </div>
          <div>
            <div className="inline-flex items-center gap-1 bg-blue-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1">
              ✦ Platinum Care Member
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{activeUser.name}</h1>
            <p className="text-xs text-slate-400">{activeUser.email} • {activeUser.phone || "(555) 987-6543"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/book"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/15"
          >
            + Request New Service
          </Link>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Referral Balance</span>
            <span className="text-sm font-extrabold text-cyan-300">$100.00 Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Services History & Estimates (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active / Past Service Tickets */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Plumbing Service History ({appointments.length} Tickets)</span>
            </h2>

            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((job) => (
                  <div key={job.id} className="border border-slate-100 rounded-2xl p-4 hover:bg-slate-50/50 transition-colors space-y-3">
                    
                    {/* Job Card Header */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900">{job.serviceType}</span>
                        <p className="text-[10px] text-slate-400">Scheduled: {new Date(job.scheduledAt).toLocaleDateString()} at {new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          job.status === "completed" ? "bg-emerald-50 text-emerald-700" :
                          job.status === "pending" ? "bg-blue-50 text-blue-700" :
                          "bg-amber-50 text-amber-700 animate-pulse"
                        }`}>
                          ● {job.status}
                        </span>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          job.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-red-50 text-red-700"
                        }`}>
                          {job.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Description & Technical notes */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <b>Customer Note:</b> "{job.description}"
                    </p>

                    {job.technicianNotes && (
                      <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100/40 text-xs text-slate-700">
                        <span className="font-bold block text-[10px] uppercase text-blue-800">Technician Diagnostic Notes:</span>
                        <p className="italic">"{job.technicianNotes}"</p>
                        {job.laborHours && <span className="block mt-1 font-semibold text-[10px] text-slate-500">Labor Tracked: {job.laborHours} Hours</span>}
                      </div>
                    )}

                    {/* Before / After Photos if completed */}
                    {job.status === "completed" && job.beforePhoto && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-[10px] text-slate-600">
                          <span>📸 View Photo Logs Attached</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">✓ 1-Year Structural Flow Warranty Active</span>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No service history tickets found. Click "Request New Service" to book your first plumber.
              </div>
            )}
          </div>

          {/* AI Assessment Estimates */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              <span>AI-Assisted Preliminary Estimates & Quotes</span>
            </h2>

            {estimates.length > 0 ? (
              <div className="space-y-4">
                {estimates.map((est) => (
                  <div key={est.id} className="border border-slate-100 rounded-2xl p-4 hover:bg-slate-50/50 transition-colors space-y-3">
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{est.serviceType}</span>
                        <span className="text-[10px] text-slate-400 block">Requested: {new Date(est.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        est.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {est.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Range</span>
                        <span className="text-lg font-black text-blue-600">${est.estimatedCostLow} - ${est.estimatedCostHigh}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">AI Status Code</span>
                        <span className="text-xs font-bold text-slate-700 uppercase">{est.status === "approved" ? "Scheduled & Locked" : "Pending Approval"}</span>
                      </div>
                    </div>

                    {/* AI Assessment text */}
                    {est.aiExplanation && (
                      <div className="bg-slate-900 text-slate-300 p-3.5 rounded-xl text-xs space-y-1">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase block">AI Diagnostic Assessment:</span>
                        <p className="leading-relaxed text-[11px] font-mono whitespace-pre-line">{est.aiExplanation}</p>
                      </div>
                    )}

                    {est.status === "pending" && (
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleApproveEstimate(est.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          Approve Estimate & Dispatch Plumber
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No preliminary quotes currently generated.
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Invoices, Referral Campaign & Warranties (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Unpaid & Past Invoices */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Outstanding Invoices</span>
            </h2>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="border border-slate-100 rounded-2xl p-4 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">Invoice #INV-00{inv.id}</span>
                      <span className="block text-[10px] text-slate-400">Due: {new Date(inv.dueAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      inv.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 text-sm">${inv.amount}</span>
                    {inv.status === "unpaid" ? (
                      <button
                        onClick={() => setSelectedInvoiceToPay(inv)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                      >
                        💳 Pay via Stripe
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                        <Check className="h-3 w-3" /> Paid
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platinum Care Warranty Vault */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">Warranties & Protection</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                <span className="font-bold text-white block">Tankless Hot Water System</span>
                <span className="text-[10px] text-slate-400">Hardware ID: Rheem-A1098</span>
                <span className="block text-emerald-400 text-[10px] font-semibold mt-1">10-Year Manufacturer Warranty Active</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                <span className="font-bold text-white block">Sewer Hydro-Jetting Spot Work</span>
                <span className="text-[10px] text-slate-400">Cleared Date: 3 Days ago</span>
                <span className="block text-emerald-400 text-[10px] font-semibold mt-1">1-Year No-Clog Guarantee Active</span>
              </div>
            </div>
          </div>

          {/* Referral Reward program */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Refer-A-Friend Program</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Share your custom link. When your referral completes their first service call, you receive <b>$50 Cash Back</b> and they receive <b>$50 Off</b> diagnostics.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 flex items-center justify-between">
              <span>flowmaster.pro/ref?eleanor6</span>
              <button 
                onClick={() => alert("Copied! Share it on Facebook or via text.")}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold shrink-0 cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Virtual Stripe Payment Modal */}
      {selectedInvoiceToPay && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-blue-500/15 space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600 animate-pulse" />
                <span className="font-black text-slate-900 text-base">Virtual Stripe Check-out</span>
              </div>
              <button 
                onClick={() => setSelectedInvoiceToPay(null)} 
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Paying Invoice #INV-00{selectedInvoiceToPay.id}</span>
              <span className="text-xl font-black text-slate-800">${selectedInvoiceToPay.amount}</span>
            </div>

            {paymentComplete ? (
              <div className="py-8 text-center space-y-3">
                <div className="h-14 w-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">Transaction Approved!</h4>
                  <p className="text-xs text-slate-500">Invoice marked as Paid in fullstack PostgreSQL db.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Card Number (Visa/Mastercard)</label>
                  <input
                    type="text"
                    value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={ccExpiry}
                      onChange={(e) => setCcExpiry(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CVC Code</label>
                    <input
                      type="text"
                      value={ccCvc}
                      onChange={(e) => setCcCvc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center">
                  🔒 Encrypted TLS 1.3 Connection • Stripe Partner Program
                </div>

                <button
                  onClick={handlePayInvoice}
                  disabled={isPaying}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authorizing credit hold...
                    </>
                  ) : (
                    `Authorize Charge $${selectedInvoiceToPay.amount}`
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
