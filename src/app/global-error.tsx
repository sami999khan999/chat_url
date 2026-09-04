"use client";

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-zinc-800">
        <div className="flex flex-col gap-3 items-center justify-center h-screen px-6 text-center">
          <h3 className="font-semibold text-xl text-white/80">
            Something went wrong
          </h3>
          <p className="text-zinc-500 text-sm max-w-md">
            The application failed to load. Please try again.
          </p>
          <button
            onClick={reset}
            className="h-10 px-6 rounded-xl bg-zinc-700 text-white text-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
