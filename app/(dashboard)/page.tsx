"use client";

import { useState, useEffect } from "react";
import { Search, Flame, Loader2, Inbox } from "lucide-react";
import BoostCard from "@/components/BoostCard";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { extractTikTokVideoId, extractTikTokUsername } from "@/lib/utils";

const CATEGORIES = ["All", "Followers", "Views", "Likes", "Comments"];

import useSWRInfinite from "swr/infinite";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("All");

  const getKey = (pageIndex: number, previousPageData: any[]) => {
    if (previousPageData && !previousPageData.length) return null;
    const lastId = previousPageData ? previousPageData[previousPageData.length - 1].id : null;
    return `/api/boosts?category=${activeTab}&limit=10${lastId ? `&lastId=${lastId}` : ""}`;
  };

  const { data, error, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateFirstPage: false,
  });

  const feed = data ? data.flat() : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10);

  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

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

      {isLoadingInitialData ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : feed.length > 0 ? (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feed.map((item) => (
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

          {!isReachingEnd && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setSize(size + 1)}
                disabled={isLoadingMore}
                className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-2xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Loading...
                  </>
                ) : (
                  "Load More Results"
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Inbox size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No active boosts in this category</h3>
            <p className="text-slate-500 text-sm">Be the first to create a boost!</p>
          </div>
        </div>
      )}
    </div>
  );
}
