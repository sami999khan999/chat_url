"use client";

import { Message, useChat } from "ai/react";
import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";

export const ChatWrapper = ({
  sessionId,
  initialMessages,
  indexingError = null,
}: {
  sessionId: string;
  initialMessages: Message[];
  indexingError?: string | null;
}) => {
  const {
    messages,
    handleInputChange,
    handleSubmit,
    input,
    isLoading,
    error,
  } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
    initialMessages: initialMessages ?? [],
  });

  const notice = indexingError ?? (error ? error.message : null);

  return (
    <div className="relative min-h-full bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2">
      <div className="flex-1 text-black bg-zinc-800 justify-between flex flex-col">
        {notice ? (
          <p className="bg-red-950/60 text-red-200 text-sm px-6 py-3">
            {notice}
          </p>
        ) : null}

        <Messages messages={messages} />
      </div>

      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
