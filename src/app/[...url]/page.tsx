import { ChatWrapper } from "@/components/ChatWrapper";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { normalizeUrl, reconstructUrl } from "@/lib/url";
import { type Message } from "ai/react";
import { cookies } from "next/headers";
import Link from "next/link";

// Crawling and embedding a website takes a while; the platform default of 10s
// cuts the response stream mid-flight, which the browser reports as a
// client-side exception instead of a useful error.
export const maxDuration = 60;

interface PageProps {
  params: {
    url: string | string[] | undefined;
  };
}

const InvalidUrl = ({ url }: { url: string }) => (
  <div className="flex flex-col gap-2 items-center justify-center h-screen px-6 text-center">
    <h3 className="font-semibold text-xl text-white/80">
      That does not look like a website URL
    </h3>
    <p className="text-zinc-500 text-sm break-all max-w-lg">
      {url ? `We could not read "${url}" as a URL.` : "No URL was provided."}
    </p>
    <Link href="/" className="text-blue-500 text-sm underline">
      Enter another URL
    </Link>
  </div>
);

const Page = async ({ params }: PageProps) => {
  const sessionCookie = cookies().get("sessionId")?.value;
  const reconstructedUrl = reconstructUrl(params.url as string[] | undefined);
  const targetUrl = normalizeUrl(reconstructedUrl);

  if (!targetUrl) {
    return <InvalidUrl url={reconstructedUrl} />;
  }

  const sessionId = (targetUrl + "--" + sessionCookie).replace(/\//g, "");

  let initialMessages: Message[] = [];
  let indexingError: string | null = null;

  try {
    const isAlreadyIndexed = await redis.sismember("indexed-urls", targetUrl);

    initialMessages = (await ragChat.history.getMessages({
      amount: 10,
      sessionId,
    })) as Message[];

    if (!isAlreadyIndexed) {
      await ragChat.context.add({
        type: "html",
        source: targetUrl,
        config: { chunkOverlap: 50, chunkSize: 200 },
      });

      await redis.sadd("indexed-urls", targetUrl);
    }
  } catch (error) {
    // Never let a failed crawl take the whole page down - render the chat with
    // an explanation instead of an unhandled exception.
    console.error(`Failed to index ${targetUrl}:`, error);
    indexingError = `We could not read ${targetUrl}. The site may be unreachable or blocking crawlers, so answers may be unavailable.`;
  }

  return (
    <ChatWrapper
      sessionId={sessionId}
      initialMessages={initialMessages}
      indexingError={indexingError}
    />
  );
};

export default Page;
