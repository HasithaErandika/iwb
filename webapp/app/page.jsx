import { auth, signIn } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <SessionProvider>
      <div className={`min-h-screen bg-fundmate-light-bg `}>
        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center py-16 md:py-24 lg:py-39 px-6 md:px-10 lg:px-20 text-center">
          <h1 className=" text-4xl md:text-6xl lg:text-6xl font-bold font-serif leading-tight max-w-4xl text-fundmate-text-dark mb-6">
            Work from Paradise, Explore the Pearl of the Indian Ocean
          </h1>
          <p className="text-lg md:text-xl text-fundmate-text-light max-w-2xl mb-10">
            Your all-in-one digital nomad hub for Sri Lanka. Accommodation,
            remote work, community, and financial planning—simplified.
          </p>

          {/* Buttons or session info */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            {!session ? (
              <form
                action={async () => {
                  "use server";
                  await signIn("asgardeo", { redirectTo: "/workspace" });
                }}
              >
                <Button
                  type="submit"
                  className="bg-orange-500 text-white hover:cursor-pointer rounded-md px-10 py-6 text-xl font-medium transition-colors"
                >
                  Sign In
                </Button>
              </form>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-xl text-fundmate-text-dark mb-2">
                    Welcome,{" "}
                    <strong>
                      {session.user?.given_name} {session.user?.family_name}
                    </strong>
                  </p>
                  <SignOutButton />
                </div>
              </>
            )}
            <Button className="bg-orange-500 text-white hover:cursor-pointer rounded-md px-10 py-6 text-xl font-medium transition-colors ">
              Contribute to the Project
            </Button>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
