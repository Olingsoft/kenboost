"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { db } from "./firebase";
import { doc, updateDoc, increment, arrayUnion } from "firebase/firestore";

export async function supportBoostAction(boostId: string, userId: string) {
  try {
    const boostRef = doc(db, "boosts", boostId);
    await updateDoc(boostRef, {
      clicks: increment(1),
      supportedBy: arrayUnion(userId)
    });
    
    // Invalidate the cache
    revalidatePath("/", "page");
    revalidatePath("/profile", "page");
    
    return { success: true };
  } catch (error) {
    console.error("Server Action Error supporting boost:", error);
    return { success: false, error: "Failed to support boost" };
  }
}

export async function createBoostAction() {
  // This would be called after a successful boost creation
  revalidatePath("/", "page");
  revalidatePath("/profile", "page");
}
