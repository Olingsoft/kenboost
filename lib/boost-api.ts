import { db } from "./firebase";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter,
  doc,
  getDoc
} from "firebase/firestore";
import { unstable_cache } from "next/cache";
import { extractTikTokVideoId, extractTikTokUsername } from "./utils";

export interface Boost {
  id: string;
  userId: string;
  username: string;
  type: string;
  clicks: number;
  href: string;
  videoId: string;
  posterName: string;
  posterPhoto: string | null;
  createdAt: any;
  supportedBy: string[];
  status: string;
}

/**
 * Fetches boosts for the feed with caching
 */
export const getFeedBoosts = unstable_cache(
  async (category: string = "All", limitCount: number = 20, lastDocId?: string) => {
    try {
      let q = query(
        collection(db, "boosts"),
        where("status", "==", "Active"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      if (category !== "All") {
        q = query(q, where("type", "==", category));
      }

      if (lastDocId) {
        const lastDoc = await getDoc(doc(db, "boosts", lastDocId));
        if (lastDoc.exists()) {
          q = query(q, startAfter(lastDoc));
        }
      }

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
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
        } as Boost;
      });
    } catch (error) {
      console.error("Error fetching feed boosts:", error);
      return [];
    }
  },
  ["feed-boosts"],
  { revalidate: 60, tags: ["boosts", "feed"] }
);

/**
 * Fetches boosts for a specific user with caching
 */
export const getUserBoosts = async (userId: string) => {
  return unstable_cache(
    async () => {
      try {
        const q = query(
          collection(db, "boosts"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error fetching user boosts:", error);
        return [];
      }
    },
    [`user-boosts-${userId}`],
    { revalidate: 300, tags: ["boosts", `user-${userId}`] }
  )();
};
