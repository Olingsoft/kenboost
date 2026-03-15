import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractTikTokVideoId(url: string) {
  if (!url) return null;
  
  // Handle various TikTok URL formats
  // https://www.tiktok.com/@user/video/7617021202825039124
  // https://vm.tiktok.com/ZNeP8... (this would need another step but standard links work)
  const regex = /\/video\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
export function extractTikTokUsername(url: string) {
  if (!url) return "user";
  const match = url.match(/@([a-zA-Z0-9._]+)/);
  return match ? match[1] : "user";
}
