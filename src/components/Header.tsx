"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Droplet, Shield, User, HardHat, PhoneCall, Calendar, HelpCircle, Menu, X, ArrowRight, Settings } from "lucide-react";

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  specialty?: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);

  // Load user session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("flowmaster_session");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("flowmaster_session");
      }
    }
  }, [pathname]);

  const handleDemoLogin = (email: string, role: string) => {
    // Find matching demo credentials
    let name = "";
    let id = 6;
    let specialty = "";
    let phone = "";
    let address = "";

    if (role === "admin") {
      name = "Marcus Sterling";
      id = 1;
      phone = "(555) 123-4567";
      address = "100 Elite Business Way, Suite 400";
    } else if (role === "technician") {
      name = "Alex Rivers";
      id = 3; // Alex is seeded with ID 3
      specialty = "Water Heaters & Tankless Systems";
      phone = "(555) 345-6789";
      address = "128 Cascade Blvd";
    } else {
      name = "Eleanor Vance";
      id = 6; // Eleanor is seeded with ID 6
      phone = "(555) 987-6543";
      address = "742 Evergreen Terrace, Springfield";
    }

    const demoUser: DemoUser = { id, name, email, role, specialty, phone, address };
    localStorage.setItem("flowmaster_session", JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setShowDemoDropdown(false);
    
    // Redirect to the appropriate portal
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "technician") {
      router.push("/technician");
    } else {
      router.push("/portal");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("flowmaster_session");
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100/40 bg-white/80 backdrop-blur-md shadow-sm">
      {/* Top Banner for Emergency Alerts */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white py-1 px-4 text-xs font-semibold flex items-center justify-between text-center">
        <span className="flex items-center gap-1.5 mx-auto md:mx-0">
          <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          EMERGENCY DISPATCH LIVE: 24/7 Plumbing Response Team Active In Your Neighborhood
        </span>
        <span className="hidden md:flex items-center gap-3">
          <span>License #PL9981-01</span>
          <span className="text-blue-200">|</span>
          <span>A+ Rated BBB</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Droplet className="h-6 w-6 text-white animate-bounce-slow" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent tracking-tight">
                FLOWMASTER
              </span>
              <span className="block text-[10px] font-bold text-cyan-600 uppercase tracking-widest leading-none">
                Enterprise & Pro
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"}`}>
              Home
            </Link>
            <Link href="/book" className={`text-sm font-medium transition-colors ${pathname === "/book" ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"}`}>
              Book Service
            </Link>
            
            {/* Quick Portal Shortcuts (Visible if logged in) */}
            {currentUser && (
              <Link 
                href={currentUser.role === "admin" ? "/admin" : currentUser.role === "technician" ? "/technician" : "/portal"} 
                className="text-sm font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 bg-cyan-50 px-2.5 py-1 rounded-lg"
              >
                <Settings className="h-3.5 w-3.5 animate-spin-slow" />
                My Dashboard ({currentUser.role})
              </Link>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Demo Quick Logins Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl cursor-pointer transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-blue-600" />
                Demo Quick Logins
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>

              {showDemoDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-slate-800">
                  <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Select a Mock User Profile
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Instantly simulate different dashboards and see the full-stack database connection.
                  </p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDemoLogin("admin@flowmasters.com", "admin")}
                      className="w-full flex items-center gap-3 p-2 hover:bg-blue-50/80 rounded-xl text-left border border-slate-50 hover:border-blue-100 transition-all text-sm cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        AD
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Marcus (Admin)</div>
                        <div className="text-xs text-slate-500">Full Operational CRM & Dispatch</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleDemoLogin("alex@flowmasters.com", "technician")}
                      className="w-full flex items-center gap-3 p-2 hover:bg-amber-50/80 rounded-xl text-left border border-slate-50 hover:border-amber-100 transition-all text-sm cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                        TE
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Alex Rivers (Technician)</div>
                        <div className="text-xs text-slate-500">Route Map, Work logs, Signature</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleDemoLogin("customer@flowmasters.com", "customer")}
                      className="w-full flex items-center gap-3 p-2 hover:bg-purple-50/80 rounded-xl text-left border border-slate-50 hover:border-purple-100 transition-all text-sm cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                        CU
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Eleanor Vance (Customer)</div>
                        <div className="text-xs text-slate-500">History, Invoices, Referral, AI Assist</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout/Profile Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden lg:inline">Hello, <b>{currentUser.name.split(" ")[0]}</b></span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleDemoLogin("customer@flowmasters.com", "customer")}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
              >
                Sign In
              </button>
            )}

            {/* High Converting Emergency Booking Button */}
            <Link
              href="/book?urgency=emergency"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-md shadow-red-500/20 hover:shadow-red-500/30 transition-all hover:scale-102"
            >
              <PhoneCall className="h-4 w-4 animate-bounce" />
              24/7 Dispatch
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Quick emergency button on mobile */}
            <Link
              href="/book?urgency=emergency"
              className="bg-red-600 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <PhoneCall className="h-4 w-4 animate-bounce" />
              SOS
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-lg">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-slate-900 hover:bg-slate-50 rounded-xl"
            >
              Home
            </Link>
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-slate-900 hover:bg-slate-50 rounded-xl"
            >
              Book Service Online
            </Link>

            {currentUser && (
              <Link
                href={currentUser.role === "admin" ? "/admin" : currentUser.role === "technician" ? "/technician" : "/portal"}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-cyan-600 bg-cyan-50 rounded-xl"
              >
                My Dashboard ({currentUser.role})
              </Link>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Simulate Live Roles:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { handleDemoLogin("admin@flowmasters.com", "admin"); setMobileMenuOpen(false); }}
                className="bg-blue-50 text-blue-700 px-2 py-2 rounded-lg text-xs font-bold text-center"
              >
                Admin
              </button>
              <button
                onClick={() => { handleDemoLogin("alex@flowmasters.com", "technician"); setMobileMenuOpen(false); }}
                className="bg-amber-50 text-amber-700 px-2 py-2 rounded-lg text-xs font-bold text-center"
              >
                Technician
              </button>
              <button
                onClick={() => { handleDemoLogin("customer@flowmasters.com", "customer"); setMobileMenuOpen(false); }}
                className="bg-purple-50 text-purple-700 px-2 py-2 rounded-lg text-xs font-bold text-center"
              >
                Customer
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            {currentUser ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="text-sm font-semibold text-red-600"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => { handleDemoLogin("customer@flowmasters.com", "customer"); setMobileMenuOpen(false); }}
                className="text-sm font-semibold text-blue-600"
              >
                Log In
              </button>
            )}
            <Link
              href="/book?urgency=emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              Book Emergency
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
