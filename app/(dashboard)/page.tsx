"use client";

import { useState, useEffect } from "react";
import { Search, Flame, Loader2, Inbox } from "lucide-react";
import BoostCard from "@/components/BoostCard";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { extractTikTokVideoId, extractTikTokUsername } from "@/lib/utils";

const CATEGORIES = ["All", "Followers", "Views", "Likes", "Comments"];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "boosts"),
      where("status", "==", "Active"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedData = snapshot.docs.map(doc => {
        const data = doc.data();
        const type = data.type;
        const target = data.target;

        let username = "user";
        let videoId = "";
        let href = target;

        if (type === "Followers") {
          username = target.replace("@", "");
          href = `https://www.tiktok.com/@${username}`;
        } else {
          username = extractTikTokUsername(target);
          videoId = extractTikTokVideoId(target) || "";
        }

        return {
          id: doc.id,
          username,
          type,
          clicks: data.clicks || 0,
          href,
          videoId,
          ...data
        };
      });
      setFeed(feedData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching feed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredFeed = activeTab === "All" 
    ? feed 
    : feed.filter(item => item.type === activeTab);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
             Support others to grow <Flame className="text-emerald-500" />
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Support others to earn points and boost your own posts.</p>
        </div>


        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              activeTab === cat 
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 border-emerald-500" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : filteredFeed.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFeed.map((item) => (
            <BoostCard
              key={item.id}
              id={item.id}
              username={item.username}
              type={item.type as any}
              clicks={item.clicks}
              href={item.href}
              videoId={item.videoId}
              userId={item.userId}
              posterName={item.posterName}
              posterPhoto={item.posterPhoto}
              createdAt={item.createdAt}
              supportedBy={item.supportedBy}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Inbox size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No active boosts</h3>
            <p className="text-slate-500 text-sm">Be the first to create a boost!</p>
          </div>
        </div>
      )}
    </div>
  );
}
