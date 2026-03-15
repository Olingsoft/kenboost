"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface TikTokEmbedProps {
  videoId?: string;
  username?: string;
  embedType: "video" | "creator";
}

export default function TikTokEmbed({ videoId, username, embedType }: TikTokEmbedProps) {
  useEffect(() => {
    const scriptId = "tiktok-embed-script";
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if ((window as any).tiktokEmbed) {
      (window as any).tiktokEmbed.lib.render();
    }
  }, [videoId, username, embedType]);

  return (
    <div className={cn(
      "flex justify-center w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100 relative z-10",
      embedType === "creator" ? "max-h-[130px]" : "max-h-[350px]"
    )}>
      {embedType === "video" && videoId ? (
        <blockquote 
          className="tiktok-embed" 
          cite={`https://www.tiktok.com/@${username || 'user'}/video/${videoId}`} 
          data-video-id={videoId} 
          style={{ maxWidth: "100%", width: "100%", margin: 0 }}
        >
          <section>
            <a target="_blank" title="TikTok Video" href={`https://www.tiktok.com/@${username || 'user'}/video/${videoId}`}>Loading video...</a>
          </section>
        </blockquote>
      ) : embedType === "creator" && username ? (
        <blockquote 
          className="tiktok-embed" 
          cite={`https://www.tiktok.com/@${username}`} 
          data-unique-id={username} 
          data-embed-type="creator" 
          style={{ maxWidth: "100%", width: "100%", margin: 0 }}
        > 
          <section> 
            <a target="_blank" href={`https://www.tiktok.com/@${username}?refer=creator_embed`}>@{username}</a> 
          </section> 
        </blockquote>
      ) : null}
    </div>
  );
}
