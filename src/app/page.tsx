"use client";

import { MessageSquare, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { buildChatPath, normalizeUrl } from "@/lib/url";

const Page = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const route = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl) {
      setError("Please enter a valid website URL, e.g. https://example.com");
      return;
    }

    setError(null);
    route.push(buildChatPath(normalizedUrl));
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-screen">
      <div className=" flex flex-col items-center justify-center gap-2">
        <MessageSquare className="size-8 text-blue-500" />
        <h3 className="font-semibold text-xl text-white/80">
          Enter a URL to get started
        </h3>
        <p className="text-zinc-500 text-sm w-[20rem] md:w-[30rem] text-center">
          Please enter the URL of any website, and feel free to ask any
          questions you have about the content or details of that site.{" "}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-full gap-2"
      >
        <div className="flex w-full justify-center gap-0">
          <input
            className="outline-none h-10 w-[70%] max-w-md rounded-l-xl px-6 bg-zinc-900/45 text-white"
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
          />
          <button
            type="submit"
            className="h-10 px-6 rounded-r-xl bg-zinc-700 text-white flex items-center"
          >
            <Send className="size-4" />
          </button>
        </div>

        {error ? (
          <p className="text-red-400 text-sm text-center">{error}</p>
        ) : null}
      </form>
    </div>
  );
};

export default Page;
