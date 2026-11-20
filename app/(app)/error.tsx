"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppRouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("App route failed to load", error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col justify-center px-5 py-12 text-center">
      <div className="rounded-3xl border border-border bg-surface p-7 shadow-card sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-deep">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-ink">
          We couldn’t load this page.
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-soft">
          Your saved information is unchanged. Try loading the page again, or
          return to Home.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={unstable_retry}
            className="rounded-full bg-indigo px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-deep"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface-tint"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
