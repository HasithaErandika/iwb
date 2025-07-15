"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  const { data: session } = useSession();

  const handleLogout = () => {
    if (session?.user?.id_token) {
      // Since next-auth does not support OIDC logout, we have to manually call the OIDC logout endpoint.
      window.location.assign(
        process.env.NEXT_PUBLIC_AUTH_ASGARDEO_LOGOUT_URL +
          "?id_token_hint=" +
          session?.user?.id_token +
          "&post_logout_redirect_uri=" +
          process.env.NEXT_PUBLIC_AUTH_ASGARDEO_POST_LOGOUT_REDIRECT_URL
      );
    } else {
      signOut();
    }
  };

  return (
    <Button
      variant="ghost"
      type="submit"
      className="border border-slate-950 !hover:bg-blue-600 !text-slate-950 hover:cursor-pointer font-medium px-6 py-5 text-md rounded-md transition-colors duration-200"
      onClick={handleLogout}
    >
      Sign Out
    </Button>
  );
};
