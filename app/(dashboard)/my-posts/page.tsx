"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, ExternalLink, Activity, CheckCircle, Clock, Loader2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function MyPostsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, "boosts"),
      where("userId", "==", currentUserId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching boosts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Loading...";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4 animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
          <Inbox size={40} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">No boosts found</h2>
          <p className="text-slate-500 font-medium mt-1">You haven't created any boost campaigns yet.</p>
        </div>
        <a href="/create-boost" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 transform active:scale-95 transition-all mt-2">
          Create First Boost
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            My Posts
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and track your active boost campaigns.</p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-panel rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white/50 backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="py-4 px-6 text-sm font-bold text-slate-600 uppercase tracking-wide">Campaign / Link</th>
              <th className="py-4 px-6 text-sm font-bold text-slate-600 uppercase tracking-wide">Type</th>
              <th className="py-4 px-6 text-sm font-bold text-slate-600 uppercase tracking-wide">Clicks</th>
              <th className="py-4 px-6 text-sm font-bold text-slate-600 uppercase tracking-wide">Status</th>
              <th className="py-4 px-6 text-sm font-bold text-slate-600 uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <a href={post.target?.startsWith('http') ? post.target : `https://tiktok.com/@${post.target}`} target="_blank" rel="noreferrer" className="text-slate-900 font-bold text-sm hover:underline hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
                      {post.target.length > 30 ? post.target.substring(0, 30) + "..." : post.target} <ExternalLink size={14} className="text-slate-400" />
                    </a>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-1">{formatDate(post.createdAt)}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-bold text-slate-700">{post.type}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-black text-slate-900">{post.clicks.toLocaleString()}</span>
                </td>
                <td className="py-4 px-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-max border",
                    post.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    post.status === "Completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-slate-100 text-slate-600 border-slate-200"
                  )}>
                    {post.status === "Active" && <Activity size={12} strokeWidth={2.5} />}
                    {post.status === "Completed" && <CheckCircle size={12} strokeWidth={2.5} />}
                    {post.status === "Paused" && <Clock size={12} strokeWidth={2.5} />}
                    {post.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-slate-400 hover:text-slate-900 p-2 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-panel p-5 rounded-2xl border border-slate-200 flex flex-col gap-3 shadow-sm bg-white/50 backdrop-blur-xl">
            <div className="flex justify-between items-start">
              <div className="flex-1 overflow-hidden pr-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{post.type} Boost</span>
                <a href={post.target?.startsWith('http') ? post.target : `https://tiktok.com/@${post.target}`} className="block text-slate-900 font-bold text-sm mt-1 truncate hover:text-emerald-600">
                  {post.target}
                </a>
              </div>
              <button className="text-slate-400">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clicks</div>
                  <div className="text-lg font-black text-slate-900 leading-none mt-1">{post.clicks.toLocaleString()}</div>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold",
                post.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                post.status === "Completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-slate-100 text-slate-600"
              )}>
                {post.status}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
