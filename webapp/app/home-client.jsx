"use client";

import { SignOutButton } from "@/components/sign-out-button";
import { SessionProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { signInAction, signUpAction } from "./actions";

export default function HomeClient({ session }) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-12 py-6">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* left */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h1
                className="text-4xl lg:text-5xl font-serif text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Work from Paradise, Explore the{" "}
                <span className="italic">Pearl of the Indian Ocean</span>
              </motion.h1>
              <motion.p
                className="text-gray-700 text-lg leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Your all-in-one digital nomad hub for Sri Lanka. Accommodation,
                remote work, community, and financial planning—simplified.
              </motion.p>{" "}
              {/* auth btns */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {" "}
                {!session ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <form action={signInAction}>
                      <motion.div>
                        <Button
                          variant="ghost"
                          type="submit"
                          className="!bg-slate-950  !hover:bg-blue-600 !text-white hover:cursor-pointer font-medium px-6 py-5 text-md rounded-md transition-colors duration-200"
                        >
                          Sign In
                        </Button>
                      </motion.div>
                    </form>
                    <form action={signUpAction}>
                      <motion.div>
                        <Button
                          variant="ghost"
                          type="submit"
                          className="border border-slate-950 !text-slate-950 hover:cursor-pointer font-medium px-6 py-5 text-md rounded-md transition-colors duration-200"
                        >
                          Sign Up
                        </Button>
                      </motion.div>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {" "}
                    <motion.div>
                      <Button
                        onClick={() => (window.location.href = "/workspace")}
                        className="!bg-slate-950  !hover:bg-blue-600 !text-white hover:cursor-pointer font-medium px-6 py-5 text-md rounded-md transition-colors duration-200"
                      >
                        Go to Workspace
                      </Button>
                    </motion.div>
                    <motion.div>
                      <SignOutButton />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative flex justify-center lg:justify-end pt-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative w-96 h-96 lg:w-[500px] lg:h-[500px]">
                <Image
                  src="/images/hero.avif"
                  alt="Paradise landscape"
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* footer */}
        <footer className="py-5 px-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span>
                Built for{" "}
                <a
                  href="https://innovatewithballerina.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Innovate with Ballerina 2025
                </a>
              </span>
              <span>
                The source code is available on{" "}
                <a
                  href="https://github.com/chamals3n4/iwb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Github
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}
