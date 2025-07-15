"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push("/");
    });
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <span>Signing Out...</span>
    </div>
  );
}
