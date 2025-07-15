"use client";

import { SignOutButton } from "@/components/sign-out-button";
import { withProtectedRoute } from "@/components/with-protected-component";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <h1>You need to sign in to view this page</h1>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="mb-5">Profile Page</h1>
      <p>Email : {session?.user?.email}</p>
      <p>First Name : {session?.user?.given_name}</p>
      <p>Last Name : {session?.user?.family_name}</p>
      <div className="mt-5">
        <SignOutButton />
      </div>
    </div>
  );
};

export default withProtectedRoute(Profile);
