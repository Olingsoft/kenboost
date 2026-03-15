"use client";

import { useState, useEffect } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, Settings, TrendingUp, Link as LinkIcon, Star, CheckCircle, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const recentBoosts = [
    { id: 1, type: "Followers", link: "https://tiktok.com/@alex/...1", status: "Completed", clicks: 350 },
    { id: 2, type: "Views", link: "https://tiktok.com/@alex/...2", status: "Active", clicks: 120 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <h2 className="text-xl font-bold text-slate-900">Please sign in to view your profile</h2>
        <a href="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold">Sign In</a>
      </div>
    );
  }

  const profile = {
    username: userData?.displayName || firebaseUser.displayName || "New User",
    email: firebaseUser.email,
    joinDate: formatDate(userData?.createdAt),
    stats: {
      clicks: userData?.totalClicks || "0",
      boosted: userData?.followersGained || "0",
      posts: userData?.totalPosts || "0"
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      {/* Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 relative overflow-hidden shadow-sm bg-white/50 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50 to-transparent rounded-full blur-3xl opacity-70" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 p-1 shadow-lg shadow-emerald-200">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              {userData?.photoURL || firebaseUser.photoURL ? (
                <img src={userData?.photoURL || firebaseUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-slate-800 uppercase">
                  {profile.username.slice(0, 2)}
                </span>
              )}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{profile.username}</h1>
            <p className="text-slate-500 text-sm font-medium">Member since {profile.joinDate}</p>
            <p className="text-slate-400 text-xs mt-1">{profile.email}</p>
            
            <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
              <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 px-6 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
                 <Settings size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 relative z-10">
          <div className="text-center md:text-left">
            <div className="text-2xl font-black text-slate-900">{profile.stats.clicks}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">Total Clicks</div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-2xl font-black text-emerald-600">{profile.stats.boosted}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">Followers Gained</div>
          </div>
          <div className="text-center md:text-left">
            <div className="text-2xl font-black text-slate-900">{profile.stats.posts}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mt-1">Total Posts</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <Star className="text-emerald-500 fill-emerald-100" size={20} /> Recent Boosts
        </h2>
        
        <div className="flex flex-col gap-3">
          {recentBoosts.map(boost => (
            <div key={boost.id} className="glass-panel p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg border ${boost.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {boost.status === 'Active' ? <TrendingUp size={20} /> : <CheckCircle size={20} />}
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-sm flex items-center gap-1">
                    {boost.type} Boost
                  </div>
                  <a href={boost.link} className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1 mt-1 truncate max-w-[200px]">
                    <LinkIcon size={12} /> {boost.link}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-slate-900 font-black">{boost.clicks}</div>
                  <div className="text-xs text-slate-500 font-medium">Clicks</div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full border ${boost.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {boost.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
