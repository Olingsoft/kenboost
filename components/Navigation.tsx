"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, User, List, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePoints } from "@/lib/points-context";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "Create Boost", href: "/create-boost", icon: PlusCircle },
  { name: "My Posts", href: "/my-posts", icon: List },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Navigation() {
  const pathname = usePathname();
  const { points } = usePoints();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white border-r border-slate-200 z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/kenboost.png" 
              alt="Kenboost Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Points Display - Desktop */}
        <div className="px-6 mb-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Your Points</span>
              <div className="flex items-center gap-1 text-emerald-600">
                <Zap size={10} fill="currentColor" />
                <span className="text-xs font-bold">{points}%</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 ease-out" 
                style={{ width: `${points}%` }}
              />
            </div>
            <p className="text-[9px] text-slate-400 mt-2 font-medium">Earn 100% to boost your own posts</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-emerald-600" : "group-hover:text-emerald-500 text-slate-400"
                  )}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mb-4">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium">
            <LogOut size={20} className="text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 px-2 py-3 flex justify-around items-center pb-safe box-border">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                isActive ? "text-emerald-600" : "text-slate-400"
              )}
            >
              <Icon size={22} className={cn(isActive && "drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]")} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 z-50 px-4 py-3 flex justify-between items-center box-border">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/kenboost.png" 
            alt="Kenboost Logo" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        
        {/* Points Display - Mobile Header */}
        <div className="flex-1 mx-4 max-w-[120px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">Points</span>
            <span className="text-[10px] font-bold text-emerald-600">{points}%</span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${points}%` }}
            />
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 p-[2px] shadow-sm">
          <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
             <User size={16} className="text-emerald-600" />
          </div>
        </div>
      </header>
    </>
  );
}
