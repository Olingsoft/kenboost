"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Chrome, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { email, password } = formData;
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "An error occurred during Google sign in.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
             <Sparkles className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium text-sm">Boost your TikTok engagement today.</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-200 shadow-sm bg-white/80 backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-medium text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Password</label>
                <Link href="#" className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-2 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 transform active:scale-95 shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Sign In <ArrowRight size={18} strokeWidth={2.5} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Social Auth */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {googleLoading ? (
               <Loader2 className="animate-spin text-emerald-500" size={20} />
             ) : (
               <>
                 <Chrome size={20} className="text-emerald-500" />
                 <span className="text-sm">Sign in with Google</span>
               </>
             )}
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 font-medium">
          Don't have an account? <Link href="/signup" className="text-emerald-600 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
