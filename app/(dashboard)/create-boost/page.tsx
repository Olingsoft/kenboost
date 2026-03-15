"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link2, Sparkles, Zap, User, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function CreateBoostPage() {
  const router = useRouter();
  const [boostType, setBoostType] = useState("Followers");
  const [inputValue, setInputValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifiedUser, setVerifiedUser] = useState<{username: string, avatar: string} | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<{displayName: string, photoURL: string | null} | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        // Get more details from auth or firestore
        setCurrentUserProfile({
          displayName: user.displayName || "User",
          photoURL: user.photoURL || null
        });
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Reset verification when boost type or input changes
  useEffect(() => {
    setVerifiedUser(null);
    setError(null);
  }, [boostType, inputValue]);

  const handleVerify = () => {
    if (!inputValue) return;
    
    setIsVerifying(true);
    setError(null);
    // Simulate API call to fetch TikTok user
    setTimeout(() => {
      setVerifiedUser({
        username: inputValue.replace("@", ""),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inputValue}`
      });
      setIsVerifying(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isFollowers = boostType === "Followers";

    if (isFollowers && !verifiedUser) {
      handleVerify();
      return;
    }

    if (!currentUserId) {
      setError("You must be signed in to create a boost.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the boost document
      const boostData = {
        userId: currentUserId,
        posterName: currentUserProfile?.displayName || "User",
        posterPhoto: currentUserProfile?.photoURL || null,
        type: boostType,
        target: inputValue,
        status: "Active",
        clicks: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(isFollowers && verifiedUser ? { tiktokUser: verifiedUser } : {})
      };

      await addDoc(collection(db, "boosts"), boostData);

      // 2. Increment user's totalPosts count
      const userRef = doc(db, "users", currentUserId);
      await updateDoc(userRef, {
        totalPosts: increment(1),
        updatedAt: serverTimestamp()
      });

      router.push("/profile");
    } catch (err: any) {
      console.error("Error creating boost:", err);
      setError(err.message || "Failed to create boost. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFollowers = boostType === "Followers";

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 w-full mt-2 animate-in fade-in duration-500">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
           <Sparkles className="text-white" size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Create a New Boost</h1>
        <p className="text-slate-500 font-medium">Get more engagement from the Kenboost community.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 flex flex-col gap-6 shadow-sm bg-white/50 backdrop-blur-xl">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Boost Type Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">I want to...</label>
          <div className="grid grid-cols-2 gap-2">
            {["Followers", "Views", "Likes", "Comments"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setBoostType(type)}
                className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                  boostType === type 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {type === "Followers" ? "Gain Followers" : `Get ${type}`}
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700">
            {isFollowers ? "TikTok Username" : "TikTok Video Link"}
          </label>
          <div className="relative">
            {isFollowers ? (
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            ) : (
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            )}
            <input 
              type={isFollowers ? "text" : "url"}
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isFollowers ? "@username" : "https://www.tiktok.com/@user/video/..."} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all font-medium"
            />
          </div>
        </div>

        {/* Verification Result for Followers */}
        {isFollowers && inputValue && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {!verifiedUser && !isVerifying && (
              <button 
                type="button"
                onClick={handleVerify}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <CheckCircle size={14} /> Click to verify username
              </button>
            )}

            {isVerifying && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                <Loader2 size={14} className="animate-spin" /> Verifying account...
              </div>
            )}

            {verifiedUser && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-200 bg-white">
                  <img src={verifiedUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-sm flex items-center gap-1">
                    @{verifiedUser.username} <CheckCircle size={14} className="text-emerald-500 fill-emerald-100" />
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Account Verified</div>
                </div>
              </div>
            )}
          </div>
        )}

        <button 
          type="submit"
          disabled={isVerifying || isSubmitting || !!(isFollowers && !verifiedUser && inputValue)}
          className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-xl mt-2 hover:opacity-90 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
            isVerifying || isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:-translate-y-0.5"
          }`}
        >
          {isVerifying ? "Verifying..." : isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Zap size={20} strokeWidth={2.5} /> Launch Boost
            </>
          )}
        </button>
      </form>
    </div>
  );
}
