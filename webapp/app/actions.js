"use server";

import { signIn } from "@/auth";

export async function signInAction() {
  await signIn("asgardeo", { redirectTo: "/workspace" });
}

export async function signUpAction() {
  await signIn("asgardeo", { redirectTo: "/workspace" });
}
