"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

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
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center text-lg h-10 px-4"
      onClick={handleLogout}
    >
      Sign Out
    </button>
  );
};
