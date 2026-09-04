"use client";

import Link from "next/link";
import { useEffect } from "react";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen px-6 text-center">
      <h3 className="font-semibold text-xl text-white/80">
        Something went wrong
      </h3>
      <p className="text-zinc-500 text-sm max-w-md">
        We could not load this chat. The website may be unreachable, or the
        service may be temporarily unavailable.
      </p>

      <div className="flex gap-4 items-center">
        <button
          onClick={reset}
          className="h-10 px-6 rounded-xl bg-zinc-700 text-white text-sm"
        >
          Try again
        </button>
        <Link href="/" className="text-blue-500 text-sm underline">
          Enter another URL
        </Link>
      </div>

      {error.digest ? (
        <p className="text-zinc-600 text-xs">Reference: {error.digest}</p>
      ) : null}
    </div>
  );
};

export default Error;
