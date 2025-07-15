import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const withProtectedRoute = (WrappedComponent) => {
  const ComponentWithAuth = (props) => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
      // If there is no session, redirect to the index page
      if (status === "unauthenticated") {
        router.push("/");
      }
    }, [router, status]);

    if (status === "loading") {
      return <p>Loading...</p>;
    }

    // If the user is authenticated, render the WrappedComponent
    // Otherwise, render null while the redirection is in progress
    return status === "authenticated" ? <WrappedComponent {...props} /> : null;
  };

  return ComponentWithAuth;
};
