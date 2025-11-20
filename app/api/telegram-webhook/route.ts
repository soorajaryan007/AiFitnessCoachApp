import { NextRequest, NextResponse } from "next/server";

function getChatIds(): number[] {
  try {
    return JSON.parse(process.env.CHAT_IDS || "[]");
  } catch {
    return [];
  }
}

function saveChatId(id: number) {
  const chats = getChatIds();

  if (!chats.includes(id)) {
    chats.push(id);

    // Save back to env variable at runtime using Vercel KV-like trick
    process.env.CHAT_IDS = JSON.stringify(chats);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message;

  if (!message?.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  if (text === "/start") {
    saveChatId(chatId);

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text:
            "Welcome! 🎉\nYou are now subscribed.\n\nYou will receive your daily fitness plan every morning!",
        }),
      }
    );
  }

  return NextResponse.json({ ok: true });
}
