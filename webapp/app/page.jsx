"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState({ loading: true, healthy: false, message: "" });

  useEffect(() => {
    async function checkBackend() {
      try {
        const res = await fetch("http://localhost:8080/health");
        if (!res.ok) throw new Error("Backend not healthy");
        const data = await res.json();
        setBackendStatus({ loading: false, healthy: true, message: data.message || "Backend is healthy!" });
      } catch (err) {
        setBackendStatus({ loading: false, healthy: false, message: err.message || "Could not connect to backend." });
      }
    }
    checkBackend();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-white to-blue-50 dark:from-black dark:to-gray-900">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-xl">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="w-full">
          <div className="rounded-xl shadow-lg p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold mb-2">Backend Connection Status</h2>
            {backendStatus.loading ? (
              <span className="text-gray-500">Checking backend...</span>
            ) : backendStatus.healthy ? (
              <span className="text-green-600 font-semibold flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12.5l2.5 2.5L16 9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {backendStatus.message}
              </span>
            ) : (
              <span className="text-red-600 font-semibold flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ef4444"/><path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                {backendStatus.message}
              </span>
            )}
          </div>
        </div>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)] mt-6">
          <li className="mb-2 tracking-[-.01em]">
            Edit <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">app/page.jsx</code> to customize this page.
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
