import { ragChat } from "@/lib/rag-chat";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export const POST = async (req: NextRequest) => {
  try {
    const { messages, sessionId } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content;

    if (typeof lastMessage !== "string" || !lastMessage.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const response = await ragChat.chat(lastMessage, {
      streaming: true,
      sessionId,
    });

    return aiUseChatAdapter(response);
  } catch (error) {
    // A route handler that returns nothing makes Next.js throw, which reaches
    // the browser as an unexplained failure - always answer with a Response.
    console.error("chat-stream failed:", error);

    return NextResponse.json(
      { error: "Failed to generate a response. Please try again." },
      { status: 500 }
    );
  }
};
