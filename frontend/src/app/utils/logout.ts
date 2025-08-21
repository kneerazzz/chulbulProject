// utils/authActions.ts
import { useAuth } from "@/store/auth";
import axios from "axios";

export async function logout() {
  try {
    // Call backend logout route (if you have refresh token invalidation)
    await axios.post("/api/auth/logout", {} , {
      withCredentials: true
    })
  } catch (err) {
    console.error("Backend logout failed", err);
  } finally {
    // Always clear Zustand regardless
    useAuth.getState().logout();
  }
}
