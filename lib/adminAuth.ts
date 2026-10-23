import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

export function getAdminEmails(): string[] {
  const envEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    process.env.ADMIN_EMAILS ||
    "admin@yadavya.com,sunny@example.com";
  return envEmails
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

export async function loginAdmin(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  if (!isEmailAdmin(user.email)) {
    await firebaseSignOut(auth);
    throw new Error("Unauthorized: Access denied.");
  }

  return user;
}

export async function logoutAdmin(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAdminAuthStateChanged(
  callback: (user: User | null, isAdmin: boolean) => void
) {
  return onAuthStateChanged(auth, (user) => {
    if (user && isEmailAdmin(user.email)) {
      callback(user, true);
    } else {
      callback(null, false);
    }
  });
}
