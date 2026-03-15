import { Heart, MessageCircle, Eye, UserPlus, ExternalLink, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePoints } from "@/lib/points-context";

import TikTokEmbed from "./TikTokEmbed";

type BoostType = "Followers" | "Views" | "Likes" | "Comments";

interface BoostCardProps {
  username: string; // This is the target TikTok username
  type: BoostType;
  clicks: number;
  href: string;
  videoId?: string;
  userId?: string; // The Kenboost user ID who created the boost
  createdAt?: any;
}

const typeConfig = {
  Followers: { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  Views: { icon: Eye, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  Likes: { icon: Heart, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  Comments: { icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
};

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BoostCard({ username, type, clicks, href, videoId, userId, createdAt }: BoostCardProps) {
  const Config = typeConfig[type];
  const Icon = Config.icon;
  const { addPoints } = usePoints();
  const [posterName, setPosterName] = useState<string>("User");

  useEffect(() => {
    if (!userId) return;
    
    const fetchPoster = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setPosterName(userDoc.data().displayName || "User");
        }
      } catch (err) {
        console.error("Error fetching poster:", err);
      }
    };
    
    fetchPoster();
  }, [userId]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return date.toLocaleDateString();
  };

  const handleSupport = () => {
    // Add 5 points for supporting
    addPoints(5);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-emerald-200 transition-all duration-300">
      {/* Top row: User and Badges */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center">
            <span className="text-sm font-bold text-emerald-700 uppercase">{posterName.slice(0, 2)}</span>
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-sm">{posterName}</h3>
            <p className="text-[10px] text-slate-500 font-medium">{formatDate(createdAt)}</p>
          </div>
        </div>
        
        <div className={cn("px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 border", Config.bg, Config.color, Config.border)}>
          <Icon size={12} strokeWidth={2.5} />
          {type}
        </div>
      </div>

      {/* Instruction Text */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-lg py-2 px-3">
        <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {type === "Followers" ? "Click button to follow this creator" : 
           type === "Views" ? "Click button to view this video" :
           type === "Likes" ? "Click button to like this video" :
           "Click button to comment on this video"}
        </p>
      </div>

      {/* Embed TikTok for Views, Likes, Comments or Creator for Followers */}
      {type === "Followers" ? (
        <TikTokEmbed username={username} embedType="creator" />
      ) : videoId ? (
        <TikTokEmbed videoId={videoId} embedType="video" />
      ) : null}

      {/* Middle: Stats */}
      <div className="flex items-center gap-6 py-3 border-y border-slate-100">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Total Clicks</span>
          <div className="flex items-center gap-1.5">
            <MousePointerClick size={16} className="text-emerald-500" />
            <span className="text-xl font-black text-slate-900 tracking-tight">{clicks.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom: Action */}
      <div className="flex gap-3 mt-1">
        <a
          href={type === "Followers" ? `https://www.tiktok.com/@${username}` : (videoId ? `https://www.tiktok.com/video/${videoId}` : href)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSupport}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-200"
        >
          Open & Support <ExternalLink size={16} strokeWidth={2.5} />
        </a>
      </div>

      {/* Subtle Glow on Hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 blur-3xl rounded-full group-hover:bg-emerald-100 transition-colors pointer-events-none opacity-50" />
    </div>
  );
}
