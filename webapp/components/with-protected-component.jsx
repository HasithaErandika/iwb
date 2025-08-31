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
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            <p className="text-black">Loading workspace...</p>
          </div>
        </div>
      );
    }

    // If the user is authenticated, render the WrappedComponent
    // Otherwise, render null while the redirection is in progress
    return status === "authenticated" ? <WrappedComponent {...props} /> : null;
  };

  return ComponentWithAuth;
};
